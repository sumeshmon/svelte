<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Loader from '$components/Loader.svelte';
    import { getDocumentList, prepareDocumentList } from '$utils/documents/helper';
    import type { Document } from '$utils/documents/types';
    import { PUBLIC_PAGE_LIMIT } from '$env/static/public';
    import { PaginatorType } from '$utils/constants';
    import { t, locale } from '$lib/translations';
    import DynamicPaginator from '$components/DynamicPaginator.svelte';
    import DocumentsDefault from './templates/DocumentsDefault.svelte';
    export let template: typeof DocumentsDefault = DocumentsDefault;
    export let itemsPerPage: string = PUBLIC_PAGE_LIMIT;
    export let years: string[] | null = [];
    export let categories: string[] = [];
    export let restrictions: string[] = [];
    export let tags: string[] = [];
    export let featureDocument: string | null = null;
    export let notFound: string = $t('documents.no_item_found');
    export let itemsNotFound: boolean | null = null;
    export let paginatorType: string | boolean = PaginatorType.Pagination;
    export let currentPage: number = 1;
    export let groupBy: string | null = null;
    export let listLoader: boolean = !groupBy === null;
    export let sortOrder: string | null = null;
    export let dateOrder: string | null = null;
    export let timeOrder: string | null = null;
    export let orderDate: string | null = 'DESC';
    export let loader: boolean = groupBy === null;
    export let resetPageOnFilterChange = true;
    let maxPages;
    let documentList: Document[] = [];
    let totalItems: number = -1;
    const getData = debounce(async () => {
        if (totalItems > 0) {
            loader = true;
        }
        try {
            const response = await getDocumentList({
                lang: $locale,
                itemsPerPage: itemsPerPage,
                years: years as string[],
                featureDocument: featureDocument,
                categories: categories,
                tags: tags,
                page: currentPage,
                sortOrder: sortOrder,
                dateOrder: dateOrder,
                timeOrder: timeOrder,
                orderDate: orderDate,
                restrictions: restrictions
            });
            documentList = prepareDocumentList(response.documents, documentList, paginatorType);
            totalItems = response.totalItems;
            itemsNotFound = totalItems < 1;
        } catch (error) {
            console.error('Error fetching Documents:', error);
        } finally {
            loader = listLoader = false;
        }
    });

    /* Storage functions */
    import { createSnapshot } from '$utils/component-states/snapshot';
    import { debounce, getDomPathOfElement, noop } from '$utils/ops';
    const { getCurrentValue, saveSnapshot, setSnapshotKey, getInitialValue } = createSnapshot({
        currentPage,
        categories,
        years,
        tags,
        itemsPerPage,
        groupBy
    });
    let compRootHtmlEl: HTMLElement;
    const updateValuesFromSnapshot = () => {
        currentPage = getCurrentValue('currentPage') || currentPage;
        categories = getCurrentValue('categories') || categories;
        years = getCurrentValue('years') || years;
        tags = getCurrentValue('tags') || tags;
        itemsPerPage = getCurrentValue('itemsPerPage') || itemsPerPage;
        groupBy = getCurrentValue('groupBy') || groupBy;
    };
    const resetCurrentPage = (totalItems: number, force = false) => {
        if (force === true) {
            currentPage = getInitialValue('currentPage');
        } else if (totalItems > 0) {
            maxPages = Math.ceil(totalItems / parseInt(itemsPerPage));
            if (currentPage > maxPages) {
                currentPage = getInitialValue('currentPage');
            }
        }
    };
    onMount(() => {
        // compRootHtmlEl is only available once component is mounted
        setSnapshotKey(`documents-${getDomPathOfElement(compRootHtmlEl)}`);
        updateValuesFromSnapshot();
    });
    onDestroy(() => {
        saveSnapshot({ currentPage, categories, years, tags, itemsPerPage, groupBy });
    });
    $: {
        noop(years, categories, tags, itemsPerPage, groupBy, $locale);
        resetCurrentPage(totalItems, resetPageOnFilterChange);
    }
    /* Storage functions */
    $: {
        noop(years, categories, tags, itemsPerPage, groupBy, $locale, currentPage);
        if (years !== null) {
            getData();
        }
    }
</script>

<Loader {loader} bind:compRootHtmlEl>
    {#if documentList && totalItems > 0}
        {#if template}
            <svelte:component this={template} {documentList} />
        {/if}
        {#if paginatorType}
            <DynamicPaginator {paginatorType} {totalItems} {itemsPerPage} bind:currentPage />
        {/if}
    {:else if documentList && totalItems == 0}
        <p>{notFound}</p>
    {/if}
</Loader>
