<script lang="ts" context="module">
    declare let CKEDITOR: any;

    declare let global: { CKEDITOR: any };
    declare let window: Window & { CKEDITOR: any };

    const uuid = (prefix: string): string => {
        return prefix + '_' + Math.floor(Math.random() * 1000000000) + String(Date.now());
    };

    const createScriptLoader = () => {
        let state: {
            listeners: Array<() => void>;
            scriptId: string;
            scriptLoaded: boolean;
            injected: boolean;
        } = {
            listeners: [],
            scriptId: uuid('ckeditor-script'),
            scriptLoaded: false,
            injected: false
        };

        const injectScript = (scriptId: string, doc: Document, url: string, cb: () => void) => {
            state.injected = true;
            const script = doc.createElement('script');
            script.referrerPolicy = 'origin';
            script.type = 'application/javascript';
            script.src = url;
            script.onload = () => {
                cb();
            };
            if (doc.head) doc.head.appendChild(script);
        };

        const load = (doc: Document, url: string, callback: () => void) => {
            if (state.scriptLoaded) {
                callback();
            } else {
                state.listeners.push(callback);
                // check we can access doc
                if (!state.injected) {
                    injectScript(state.scriptId, doc, url, () => {
                        state.listeners.forEach((fn) => fn());
                        state.scriptLoaded = true;
                    });
                }
            }
        };

        return {
            load
        };
    };
    let scriptLoader = createScriptLoader();
</script>

<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import './editor.scss';
    import { getUploadUrl, uploadImage } from '$utils/image-gallery/api';

    interface Config {
        [key: string]: any;
    }

    export let id: string = uuid('ckeditor-svelte'); // default values
    export let value: string = '';
    export let conf: Config = {};
    export let inline: boolean | undefined = undefined;
    export let cssClass: string = 'ckeditor-wrapper';

    let container: HTMLElement;
    let editorRef: any | null;
    let lastVal = value;
    let uploadedFile: File;
    let isUploading = false;

    if (typeof conf.on === 'undefined') {
        conf.on = {};
    }
    conf.on.instanceReady = (evt: any) => {
        editorRef = evt.editor;
        const undo = editorRef.undoManager;

        if (value) {
            undo && undo.lock();
            editorRef.setData(value, {
                callback: () => {
                    // Locking undoManager prevents 'change' event.
                    // Trigger it manually to updated bound data.
                    if (value !== editorRef.getData()) {
                        undo ? editorRef.fire('change') : editorRef.fire('dataReady');
                    }
                    undo && undo.unlock();
                }
            });
        }
    };

    const getCkeditor = (): any | null => {
        const getSink = (): { CKEDITOR: any } => {
            return typeof window !== 'undefined' ? window : global;
        };
        const sink = getSink();
        return sink && sink.CKEDITOR ? sink.CKEDITOR : null;
    };

    $: {
        if (editorRef && lastVal !== value) {
            editorRef.setContent(value);
        }
    }

    const initCkeditor = (): void => {
        if (inline) {
            CKEDITOR.inline(id, conf);
        } else {
            CKEDITOR.replace(id, conf);
        }
    };

    const initCkeditorEvents = (): void => {
        window.addEventListener('message', function (event) {
            const payload = event.data;
            if (!payload || typeof payload !== 'object' || payload.action !== 'presignedUpload') {
                return;
            }
            CKEDITOR.fire('handlePresignedUrlUpload', payload);
        });

        CKEDITOR.on('handlePresignedUrlUpload', (evt: any) => {
            const presignedUrl = evt.data.presignedUrl;
            uploadImage(uploadedFile, presignedUrl).then((imgStatus) => {
                isUploading = false;
                CKEDITOR.fire('cmsImageUploadLoader', {
                    show: false
                });
                if (imgStatus) {
                    CKEDITOR.fire('cmsImageUrlDisplay', {
                        url: evt.data.mediaUrl
                    });
                }
            });
        });

        CKEDITOR.on('cmsImageUploadTrigger', (event: { data: { file: any; config: any } }) => {
            getUploadUrl(
                event.data.file,
                event.data.config.cmsFolderName,
                event.data.config.cmsEntityId,
                event.data.config.cmsEntityType
            ).then(() => {
                uploadedFile = event.data.file;
            });
        });
    };

    onMount(() => {
        if (getCkeditor() === null) {
            const script = '/ckeditor/ckeditor.js';
            scriptLoader.load(container.ownerDocument, script, () => {
                initCkeditor();
                initCkeditorEvents();
            });
        } else {
            initCkeditor();
        }
    });

    onDestroy(() => {
        if (editorRef) {
            editorRef.destroy();
            editorRef = null;
        }
    });
</script>

<div bind:this={container} class={cssClass}>
    <textarea {id} name={id} style="visibility:hidden" />
</div>
