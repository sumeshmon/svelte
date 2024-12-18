<script lang="ts">
    import { tick, onMount, onDestroy } from 'svelte';
    import Loader from '$components/Loader.svelte';
    import { getNewsFormattedDate, getNewsList, prepareNewsList } from '$utils/news/ops';
    import type { NewsType } from '$utils/news/types';
    import { PUBLIC_PAGE_LIMIT } from '$env/static/public';
    import { PaginatorType } from '$utils/constants';
    import { t, locale } from '$lib/translations';
    import DynamicPaginator from '$components/DynamicPaginator.svelte';
    import NewsDefault from './templates/NewsDefault.svelte';
    import { v4 as uuidv4 } from 'uuid';
    export let template: typeof NewsDefault = NewsDefault;
    export let itemsPerPage: string = PUBLIC_PAGE_LIMIT;
    export let years: string[] = [];
    export let categories: string[] = [];
    export let restrictions: string[] = [];
    export let tags: string[] = [];
    export let newsTypes: string[] = [];
    export let notFound: string = $t('news.noItemsFound');
    export let itemsNotFound: boolean | null = null;
    export let paginatorType: string | boolean = PaginatorType.Pagination;
    export let currentPage: number = 1;
    export let groupBy: string | null = null;
    export let listLoader: boolean = !groupBy === null;
    export let isLandingPage: boolean = false;
    export let showDetailViewModal: boolean = false;
    export let search: string | null = null;
    export let from: Date | null = null;
    export let till: Date | null = null;
    export let loader: boolean = groupBy === null;
    export let showSummary: boolean = false;
    export let mixedLanguage: boolean = false; // If news is in only one language, show regardless of current website language.
    export let showPdf: boolean = false;
    export let resetPageOnFilterChange = true;
    let requestId: string = uuidv4();

    let maxPages;
    let content: boolean = false;
    showSummary && (content = true);
    let newsList: NewsType[] = [];
    let totalItems: number = -1;
    const getData = debounce(async () => {
        if (totalItems > 0) {
            loader = true;
        }
        await tick();
        let lang: string | null = $locale;
        mixedLanguage && (lang = null);
        try {
            const response = await getNewsList({
                lang: lang,
                itemsPerPage: itemsPerPage,
                years: years,
                categories: categories,
                newsTypes: newsTypes,
                tags: tags,
                search: search,
                page: currentPage,
                isLandingPage: isLandingPage,
                content: content,
                from: from
                    ? getNewsFormattedDate(new Date(from).toString(), {
                          en: {
                              year: 'numeric-',
                              month: '2-digit-',
                              day: '2-digit'
                          },
                          de: {
                              year: 'numeric-',
                              month: '2-digit-',
                              day: '2-digit'
                          }
                      })
                    : null,
                till: till
                    ? getNewsFormattedDate(new Date(till).toString(), {
                          en: {
                              year: 'numeric-',
                              month: '2-digit-',
                              day: '2-digit'
                          },
                          de: {
                              year: 'numeric-',
                              month: '2-digit-',
                              day: '2-digit'
                          }
                      })
                    : null,
                restrictions: restrictions,
                requestId: requestId
            });
            if (response) {
                if (currentPage === 1) {
                    newsList = [];
                }
                newsList = prepareNewsList(response.news, newsList, paginatorType);
                totalItems = response.totalItems;
                itemsNotFound = totalItems < 1;
            }
        } catch (error) {
            console.error('Error fetching News:', error);
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
        groupBy,
        search
    });
    let compRootHtmlEl: HTMLElement;
    const updateValuesFromSnapshot = () => {
        currentPage = getCurrentValue('currentPage') || currentPage;
        categories = getCurrentValue('categories') || categories;
        years = getCurrentValue('years') || years;
        tags = getCurrentValue('tags') || tags;
        itemsPerPage = getCurrentValue('itemsPerPage') || itemsPerPage;
        groupBy = getCurrentValue('groupBy') || groupBy;
        search = getCurrentValue('search') || search;
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
        setSnapshotKey(`news-${getDomPathOfElement(compRootHtmlEl)}`);
        updateValuesFromSnapshot();
    });
    onDestroy(() => {
        saveSnapshot({ currentPage, categories, years, tags, itemsPerPage, groupBy, search });
    });

    $: {
        noop(years, categories, tags, itemsPerPage, groupBy, $locale, from, till);
        resetCurrentPage(totalItems, resetPageOnFilterChange);
    }
    const searcher = async () => {
        getData();
    };
    const debouncedSearch = debounce(searcher, 500);
    $: {
        debouncedSearch(search);
    }
    /* Storage functions */
    $: {
        noop(years, categories, tags, itemsPerPage, groupBy, currentPage, $locale, from, till);
        getData();
    }
</script>

<Loader {loader} bind:compRootHtmlEl>
    {#if newsList && totalItems > 0}
        {#if template}
            <svelte:component
                this={template}
                {newsList}
                {...showSummary ? { showSummary } : {}}
                {...showPdf ? { showPdf } : {}}
                {showDetailViewModal}
            />
        {/if}
        {#if paginatorType}
            <DynamicPaginator {paginatorType} {totalItems} {itemsPerPage} bind:currentPage />
        {/if}
    {:else if newsList && totalItems == 0}
        <p class="mt-1">{notFound}</p>
    {/if}
</Loader>
