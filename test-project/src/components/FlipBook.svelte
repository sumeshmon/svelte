<script lang="ts" context="module">
    import jQuery from 'jquery';

    declare let DFLIP: any;
    declare let window: any;

    const uuid = (prefix: string): string => {
        return prefix + '_' + Math.floor(Math.random() * 1000000000) + String(Date.now());
    };

    // dynamic script loader function
    const createScriptLoader = (id: string) => {
        let state: {
            listeners: Array<() => void>;
            scriptId: string;
            scriptClassIdentifier: string;
            scriptLoaded: boolean;
            injected: boolean;
        } = {
            listeners: [],
            scriptId: uuid(`${id}-script`),
            scriptClassIdentifier: 'flipBookScript',
            scriptLoaded: false,
            injected: false
        };

        const injectScript = (
            scriptId: string,
            scriptClassIdentifier: string,
            doc: Document,
            url: string,
            cb: () => void
        ) => {
            state.injected = true;
            if (!doc) return;
            const script = doc.createElement('script');
            script.referrerPolicy = 'origin';
            script.type = 'application/javascript';
            script.id = scriptId;
            script.className = scriptClassIdentifier;
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
                    injectScript(state.scriptId, state.scriptClassIdentifier, doc, url, () => {
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

    // assigning static path configured in viteConfig
    const dearFlipScriptPath = '/dearflip/js/dflip.min.js';
</script>

<script lang="ts">
    import { t, locale } from '$lib/translations';
    import '@eqs/dflip-lib/css/dflip.min.css';
    import '@eqs/dflip-lib/css/metaboxes.css';
    import { onMount } from 'svelte';
    import Loader from './Loader.svelte';

    export let pdfUrl: string = '';
    export let options: { [key: string]: any } = {
        webgl: false,
        scrollWheel: false
    };
    export let controlClass: string = 'df-floating df-controls-bottom';
    export let cssClass: string = 'flip-book-wrapper';

    const containerID: string = uuid(`dearFlipContainer`);
    const dFlipID: string = uuid(`dearFlip`);
    let mainContainer: HTMLElement;
    const notFound: string = $t('documents.no_item_found');
    let loader = true;
    let compRootHtmlEl: HTMLElement;

    interface PageParams {
        startPage: number;
        pageCount: number | null;
        currentPageNumber: number;
    }

    const getFlipBookControlsLocale = () => {
        return {
            doublePageMode: $t('flipbook.doublePageMode'),
            downloadPDFFile: $t('flipbook.downloadPDFFile'),
            gotoFirstPage: $t('flipbook.gotoFirstPage'),
            gotoLastPage: $t('flipbook.gotoLastPage'),
            loading: $t('flipbook.loading'),
            mailBody: $t('flipbook.mailBody'),
            mailSubject: $t('flipbook.mailSubject'),
            nextPage: $t('flipbook.nextPage'),
            pause: $t('flipbook.pause'),
            play: $t('flipbook.play'),
            previousPage: $t('flipbook.previousPage'),
            share: $t('flipbook.share'),
            singlePageMode: $t('flipbook.singlePageMode'),
            toggleFullscreen: $t('flipbook.toggleFullscreen'),
            toggleHelp: $t('flipbook.toggleHelp'),
            toggleOutline: $t('flipbook.toggleOutline'),
            toggleSound: $t('flipbook.toggleSound'),
            toggleThumbnails: $t('flipbook.toggleThumbnails'),
            zoomIn: $t('flipbook.zoomIn'),
            zoomOut: $t('flipbook.zoomOut')
        };
    };

    // flipbook initialization and update translations
    const initDFLIP = (): void => {
        DFLIP.defaults.onCreate = (flipbook: any) => {
            flipbook.id = dFlipID;
            Object.entries(options).map(([key, value]) => {
                flipbook.options[key] = value;
            });
        };

        DFLIP.defaults.onReady = (flipbook: any) => {
            const currentPageNumber = getPageNumberFromUrlHash({
                startPage: flipbook.startPage,
                pageCount: flipbook.pageCount,
                currentPageNumber: flipbook.currentPageNumber
            });

            flipbook.currentPageNumber = currentPageNumber;
            flipbook.events.resize();
        };

        DFLIP.defaults.onFlip = function (flipbook: any) {
            const pageNumber = Number(getPageNumber());
            if (isNaN(pageNumber)) return;
            window.location.hash = `#${flipbook.currentPageNumber}`;
        };

        DFLIP.defaults['scrollWheel'] = false;
    };

    const getPageNumber = () => {
        if (typeof window === 'undefined') return;
        const hash = window.location.hash;
        return hash ? hash.slice(1) : undefined;
    };

    const getPageNumberFromUrlHash = (params: PageParams) => {
        const pageNumber = Number(getPageNumber());

        if (isNaN(pageNumber)) return params.currentPageNumber;

        if (params.pageCount && pageNumber >= params.startPage && pageNumber <= params.pageCount) {
            return pageNumber;
        }

        return params.currentPageNumber;
    };

    onMount(() => {
        if (typeof window !== 'undefined') {
            window.jQuery = jQuery;
            // load flipbook onMount
            loadFlipBook();
        }
    });

    /* dynamically creating flipbook container and removing old container
       on lang switch or redirection cases
    */
    const loadContainer = () => {
        loader = false;
        const dfContainer = document.getElementById(containerID);
        let container;
        if (dfContainer) {
            dfContainer.innerHTML = '';
            container = document.createElement('div');
            container.className = 'df-container';
            container.setAttribute('class', `_df_book df-floating ${controlClass}`);
            container.setAttribute('source', pdfUrl);
            dfContainer.appendChild(container);
            initDFLIP();
        }
    };

    // injecting dependency scripts into the dom
    const loadFlipBook = () => {
        // removing dependency scripts on page load if exists
        document.querySelector(`.flipBookScript`)?.remove();
        if (mainContainer) {
            const dearFlipScriptLoader = createScriptLoader('dearflip');
            dearFlipScriptLoader.load(mainContainer?.ownerDocument, dearFlipScriptPath, () => {
                loadContainer();
            });
        }
    };

    $: if ($locale) {
        loader = true;
        options['isLightBox'] = true;
        options['text'] = getFlipBookControlsLocale();
        if (typeof window.jQuery !== 'undefined') {
            // load flipbook on locale change
            loadFlipBook();
        }
    }

    $: if (!pdfUrl) {
        loader = false;
    }
</script>

<Loader {loader} bind:compRootHtmlEl>
    {#if pdfUrl}
        <div id={containerID} bind:this={mainContainer} class={cssClass}>
            <div
                id={dFlipID}
                class={`_df_book df-container ${controlClass}`}
                {...{ source: pdfUrl }}
            />
        </div>
    {:else}
        <p>{notFound}</p>
    {/if}
</Loader>
