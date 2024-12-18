<script lang="ts">
    import { tick } from 'svelte';
    import Loader from '$components/Loader.svelte';
    import { getDocumentList, getDocumentTitle } from '$utils/documents/helper';
    import type { Document } from '$utils/documents/types';
    import { PUBLIC_PAGE_LIMIT } from '$env/static/public';
    import { PaginatorType } from '$utils/constants';
    import {
        documentHasFile,
        getDocumentFormattedDate,
        getDocumentUrl
    } from '$utils/documents/helper';
    import { t, locale } from '$lib/translations';
    import DynamicPaginator from '$components/DynamicPaginator.svelte';
    import { handleClick } from '$components/disclaimer/handleClick';
    import { debounce } from '$utils/ops';
    export let itemsPerPage: string = PUBLIC_PAGE_LIMIT;
    export let years: string[] = [];
    export let categories: string[] = [];
    export let tags: string[] = [];
    export let featureDocument: string | null = null;
    export let notFound: string = $t('documents.no_item_found');
    export let paginatorType: string = 'pagination';
    export let sortOrder: string | null = null;
    export let dateOrder: string = 'DESC';
    export let timeOrder: string | null = null;
    let documents: Document[] = [];
    let documentList: Document[] = [];
    let currentPage: number = 1;
    let totalItems: number = 0;
    let loader: boolean = true;
    const getData = debounce(async () => {
        loader = true;
        await tick();
        try {
            const response = await getDocumentList({
                lang: $locale,
                itemsPerPage: itemsPerPage,
                years: years,
                featureDocument: featureDocument,
                categories: categories,
                tags: tags,
                page: currentPage,
                sortOrder: sortOrder,
                dateOrder: dateOrder,
                timeOrder: timeOrder
            });

            documents = response.documents;
            totalItems = response.totalItems;
        } catch (error) {
            console.error('Error fetching Documents:', error);
        } finally {
            loader = false;
        }
    });

    $: $locale && getData();

    $: if (paginatorType == PaginatorType.LoadMore) {
        documentList = [
            ...documentList,
            ...documents.filter(
                (doc) => !documentList.some((existingDoc) => existingDoc.id === doc.id)
            )
        ];
    } else {
        documentList = documents;
    }
    const dateFormat = {
        en: {
            day: '2-digit ',
            month: 'long ',
            year: 'numeric'
        },
        de: {
            day: '2-digit.',
            month: '2-digit.',
            year: 'numeric'
        }
    };
</script>

<Loader {loader}>
    {#if documentList && totalItems > 0}
        {#each documentList as document}
            <div class="ipo__news">
                <div class="ipo__news-date">
                    {getDocumentFormattedDate(document, dateFormat)}
                </div>
                <div class="ipo__news-title">
                    <strong>{@html getDocumentTitle(document)}</strong>
                </div>
                <div class="ipo__news-button">
                    {#if documentHasFile(document)}
                        <a
                            class="document__download"
                            href={getDocumentUrl(document)}
                            target="_blank"
                            on:click={(event) => handleClick(event, document)}
                            data-disclaimer={document.disclaimer}
                            data-uuid={document.id}
                        >
                            {$t('common.readMore')}</a
                        >
                    {:else if document.link}
                        {#each document.link as link}
                            <a
                                class="document__download"
                                href={link.url}
                                target="_blank"
                                on:click={(event) => handleClick(event, document)}
                                data-disclaimer={document.disclaimer}
                                data-uuid={document.id}
                                ><span class="icon-master-link" /> {link.title}</a
                            >
                        {/each}
                    {:else}
                        {$t('documents.download_na')}
                    {/if}
                </div>
            </div>
        {/each}

        <DynamicPaginator {paginatorType} {totalItems} {itemsPerPage} bind:currentPage />
    {:else if documentList && totalItems === 0 && notFound !== ''}
        <p>{notFound}</p>
    {/if}
</Loader>
