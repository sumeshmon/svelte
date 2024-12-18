<script lang="ts">
    import { getWebsiteContentBySlug, getWebsiteContentHtml } from '$utils/website-content/helper';
    import type { WebsiteContent } from '$utils/website-content/types';
    import { locale, t } from '$lib/translations';
    import Loader from '$components/Loader.svelte';
    import Editor from '$components/ckeditor/Editor.svelte';
    import { onEntityStatusSubmit, setWebsiteContentBySlug } from '$utils/website-content/api';
    import { isPreviewMode } from '$utils/website-content/constants';
    import { onMount } from 'svelte';
    import Modal from '$components/Modal.svelte';
    import { getImageGalleryFolderName } from '$utils/image-gallery/api';

    export let slug: string | null = null;
    let loader: boolean = true;
    let showEditor = false;
    let conf = {};
    let contentId: string;
    let isUpdatedContent: boolean = false;
    let websiteContent: WebsiteContent[] = [];
    let entityStatus: string;
    let showModal: boolean = false;
    let galleryFolderName: string;
    //Hack to avoid calling the on click on div wrapper around editor :)
    let disableOnClickLoad = false;

    let publishStatus = 'publish';
    let unPublishStatus = 'unpublish';
    let confirmLabel = '';

    const getContentBySlug = async (slug: string, cache_bust = false) => {
        loader = true;
        try {
            const params = new URLSearchParams();
            params.set('slug', slug);
            params.set('localId.languageCode', $locale);
            cache_bust && params.set('cache_buster', new Date().getTime().toString());
            const response = await getWebsiteContentBySlug(params);
            websiteContent = response.content;
            if (websiteContent.length && isPreviewMode()) {
                galleryFolderName = await getImageGalleryFolderName(
                    websiteContent[0].id,
                    websiteContent[0].slug
                );
            }
        } catch (error) {
            console.error('Error fetching Website Content:', error);
        } finally {
            loader = false;
        }
    };

    const setContentBySlug = async (id: string, content: string) => {
        loader = true;
        isUpdatedContent = false;
        try {
            await setWebsiteContentBySlug(id, content);
        } catch (error) {
            console.error('Error fetching Website Content:', error);
        } finally {
            loader = false;
            showEditor = false;
            isUpdatedContent = true;
        }
    };

    const edit = (id: string) => {
        if (showEditor || disableOnClickLoad) {
            disableOnClickLoad = !disableOnClickLoad;
            return; //to avoid double loading.
        }
        contentId = id;
        showEditor = true;

        conf = {
            versionCheck: false,
            toolbarGroups: [
                { name: 'document', groups: ['mode', 'document', 'doctools'] },
                { name: 'clipboard', groups: ['clipboard', 'undo'] },
                { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
                { name: 'forms', groups: ['forms'] },
                { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                {
                    name: 'paragraph',
                    groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']
                },
                { name: 'links', groups: ['links'] },
                { name: 'insert', groups: ['insert'] },
                { name: 'styles', groups: ['styles'] },
                { name: 'colors', groups: ['colors'] },
                { name: 'tools', groups: ['tools'] },
                { name: 'others', groups: ['others'] },
                { name: 'about', groups: ['about'] },
                { name: 'cms', groups: ['contentworkflow'] }
            ],
            removeButtons:
                'Print,Find,Save,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Language,About,Source',
            extraPlugins: ['justify', 'cmsmode', 'divarea'],
            enterMode: 2,
            allowedContent: true,
            autoParagraph: false,
            clipboard_defaultContentType: 'text',
            uiColor: '#FFFFFF',
            cmsSaveCallback: onEditorSubmit,
            cmsCancelCallback: () => {
                onEditorClose();
            },
            cmsFolderName: galleryFolderName,
            cmsEntityId: contentId,
            cmsEntityType: 'website-content',
            dtdOverride: [{ a: { span: 1, div: 1, p: 1 } }],
            cmsLabels: {
                uploadButton: $t('common.uploadImageBtn'),
                altTextMissing: $t('common.altTextMissing')
            }
        };
    };

    const onEditorSubmit = (updatedContent: any) => {
        setContentBySlug(contentId, updatedContent);
    };

    const onEditorClose = () => {
        showEditor = false;
        contentId = '';
        disableOnClickLoad = true;
    };

    const onConfirmOpen = async (id: string, status: string) => {
        entityStatus = status;
        contentId = id;
        showModal = true;
    };

    const onConfirmSave = async () => {
        try {
            loader = true;
            isUpdatedContent = false;
            await onEntityStatusSubmit(contentId, entityStatus);
        } catch (error) {
            console.error('Error publishing Website Content:', error);
        } finally {
            loader = false;
            isUpdatedContent = true;
        }
    };

    const getConfirmLabel = () => {
        return entityStatus === publishStatus
            ? $t('common.websiteContentConfirmPublish')
            : $t('common.websiteContentConfirmUnPublish');
    };

    onMount(() => {
        isPreviewMode();
    });

    $: if (slug && $locale) {
        showEditor = false;
        getContentBySlug(slug);
    }
    $: if (isUpdatedContent && slug) {
        getContentBySlug(slug, true);
        setTimeout(() => {
            // because of async publish process
            getContentBySlug(slug, true);
        }, 3000);
    }
    $: if (entityStatus) {
        confirmLabel = getConfirmLabel();
    }
</script>

{#if slug}
    <Loader bind:loader animation={true} align="center">
        <svelte:fragment slot="withoutWrapper">
            {#each websiteContent as content}
                {#if isPreviewMode()}
                    <div class="website-content_wrapper__badges">
                        {#if content.itemPublished}
                            <span class="wc-badge wc-badge-publish">
                                {$t('common.websiteContentPublishBadge')}
                            </span>
                        {/if}
                        {#if !content.itemPublished || content.draftAhead}
                            <span class="wc-badge wc-badge-draft">{$t('common.draft')}</span>
                        {/if}
                        {#if content.itemPublished}
                            <button
                                on:click|preventDefault={() => {
                                    onConfirmOpen(content.id, unPublishStatus);
                                }}
                                title={$t('common.unPublish')}
                            >
                                <img src="/images/unpublish.svg" alt={$t('common.unpublish')} />
                            </button>
                        {/if}
                        {#if !content.itemPublished || content.draftAhead}
                            <button
                                on:click|preventDefault={() => {
                                    onConfirmOpen(content.id, publishStatus);
                                }}
                                title={$t('common.publish')}
                            >
                                <img src="/images/publish.svg" alt={$t('common.publish')} />
                            </button>
                        {/if}
                        <button
                            on:click|preventDefault={() => {
                                edit(content.id);
                            }}
                            title={$t('common.edit')}
                        >
                            <img
                                src="/images/edit.svg"
                                alt={$t('common.websiteContentPublishStatus')}
                            />
                        </button>
                    </div>
                    <div
                        class="website-content_wrapper__content"
                        id="content-{content.id}"
                        on:click={() => edit(content.id)}
                        role="button"
                        tabindex="0"
                        on:keydown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                edit(content.id);
                            }
                        }}
                    >
                        {#if showEditor}
                            <Editor {conf} value={getWebsiteContentHtml(content)} />
                        {:else}
                            {@html getWebsiteContentHtml(content)}
                        {/if}
                    </div>
                {:else}
                    {@html getWebsiteContentHtml(content)}
                {/if}
            {/each}
        </svelte:fragment>
    </Loader>
{:else}
    <slot />
{/if}
{#if isPreviewMode()}
    <Modal
        bind:showModal
        on:onConfirmSave={onConfirmSave}
        showConfirm={true}
        {confirmLabel}
        cssClass="wc-modal"
    >
        <h2 slot="header">
            {#if entityStatus === publishStatus}
                {$t('common.websiteContentPublishHeader')}
            {:else}
                {$t('common.websiteContentUnPublishHeader')}
            {/if}
        </h2>
        <p>
            {#if entityStatus === publishStatus}
                {$t('common.websiteContentPublishStatus')}
            {:else}
                {$t('common.websiteContentUnpublishStatus')}
            {/if}
        </p>
    </Modal>
{/if}
