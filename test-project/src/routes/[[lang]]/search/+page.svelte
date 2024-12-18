<script lang="ts">
    import { t, locale } from '$lib/translations';
    import Pagination from '$components/Pagination.svelte';
    import { PUBLIC_PAGE_LIMIT } from '$env/static/public';
    import { getSearchConfig, getSearchResults } from '$utils/search/helper';
    import Loader from '$components/Loader.svelte';
    import { page } from '$app/stores';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { debounce } from '$utils/ops';
    export let itemsPerPage: string = PUBLIC_PAGE_LIMIT;
    export let currentPage: number = 1;
    export let totalItems: number = 0;
    export let keyword: string = '';
    export let search: any;
    let loader: boolean = true;
    let searchPath: string;

    if ($page.url.searchParams.get('q')) {
        keyword = $page.url.searchParams.get('q') ?? '';
    }

    const searchConfigData = getSearchConfig();

    const fetchSearchResults = debounce(async () => {
        await getSearchResults({
            itemsPerPage: PUBLIC_PAGE_LIMIT,
            page: currentPage ?? 1,
            lang: $locale,
            keyword: keyword
        }).then((response) => {
            search = {
                searchResults: response.searchResults,
                totalItems: response.totalItems,
                keyword: keyword,
                lang: $locale
            };
            totalItems = response.totalItems;
            loader = false;
        });
    });

    $: {
        if ($page.url.searchParams.get('q')) {
            keyword = $page.url.searchParams.get('q') ?? '';
        }

        if (currentPage) {
            fetchSearchResults();
            loader = false;
        }
    }
    $: {
        searchPath = searchConfigData['search']?.[$locale]?.searchPath;
    }
</script>

<svelte:head>
    <title>{$t('search.title')}</title>
    <meta name="description" content="Search" />
    <meta name="robots" content="index, follow" />
</svelte:head>
<div class="page">
    <Banner title={$t('search.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <div class="search__results">
                <form role="search" method="get" class="search__form" action={searchPath}>
                    <input
                        id="search"
                        type="text"
                        name="q"
                        class="search__field search__field--results"
                        data-search-field=""
                        placeholder="{$t('search.placeholder')}..."
                    />
                    <button type="submit" value="" class="search__submit">
                        <span class="icon-master-search" /></button
                    >
                </form>
                <div class="search__results-wrapper">
                    <Loader {loader} animation={true} align="center">
                        <div class="search-result-listing">
                            {#await search}
                                <p>Loading...</p>
                            {:then search}
                                {#if totalItems > 0}
                                    <p class="search-results__number">
                                        <span>{totalItems}</span>
                                        {$t('search.found')} "{keyword}".
                                    </p>
                                    {#each search.searchResults as item}
                                        <a href={item.url}>
                                            <div class="search-results__item">
                                                <h3 class="search-results__headline">
                                                    {item.title}
                                                </h3>
                                                <div class="search-results__link">{item.url}</div>
                                                <div class="search-results__description">
                                                    {item.description}...
                                                </div>
                                            </div>
                                        </a>
                                    {/each}
                                {:else}
                                    <div>
                                        {$t('search.no_item_found')}
                                    </div>
                                {/if}
                            {/await}
                        </div>
                    </Loader>
                </div>
                <div class="search__results-pagination">
                    <Pagination {totalItems} {itemsPerPage} bind:currentPage />
                </div>
            </div>
        </div>
    </div>
</div>
