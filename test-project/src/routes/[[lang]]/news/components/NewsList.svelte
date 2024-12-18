<script lang="ts">
    import { tick, onMount, onDestroy } from 'svelte';
    import { getNewsCategories } from '$utils/news/ops';
    import News from './News.svelte';
    import { PaginatorType } from '$utils/constants';
    import { PUBLIC_PAGE_LIMIT } from '$env/static/public';
    import Loader from '$components/Loader.svelte';
    import { t, locale } from '$lib/translations';
    import YearSelector from '$routes/news/components/YearSelector.svelte';
    import CategorySelector from '$routes/news/components/CategorySelector.svelte';
    import LimitSelector from '$routes/news/components/LimitSelector.svelte';
    import DateSelector from '$routes/news/components/DateSelector.svelte';
    import NewsDefault from './templates/NewsDefault.svelte';
    export let template: typeof NewsDefault = NewsDefault;
    export let itemsPerPage: string = PUBLIC_PAGE_LIMIT;
    export let years: string[] = [];
    export let categories: string[] = [];
    export let restrictions: string[] = [];
    export let selectorCategories: string[] = categories;
    export let selectedCategories: string[] = categories;
    export let tags: string[] = [];
    export let newsTypes: string[] = [];
    export let notFound: string = $t('news.noItemsFound');
    export let paginatorType: string | boolean = PaginatorType.Pagination;
    export let groupBy: string | null = null;
    export let activeYear: string | null = null;
    export let archive: boolean = false;
    export let isLandingPage: boolean = false;
    export let showDetailViewModal: boolean = false;
    export let showSearch: boolean = false;
    export let categorySelector: string | null = null;
    export let showDateSelector: boolean = false;
    export let showLimitSelector: boolean = false;
    export let yearSelector: string | null = null;
    export let noOfYears: number | null = null;
    export let showAllCategory: boolean = false;
    export let showAllYears: boolean = false;
    export let archiveTill: string = '';
    export let fiscalYearBeginMD: string | null = null;
    export let fiscalYearEndMD: string | null = null;
    export let showSummary: boolean = false;
    export let mixedLanguage: boolean = false; // If news is in only one language, show regardless of current website language.
    export let multiSelect: boolean = false; // For Select
    export let showPdf: boolean = false;
    export let resetPageOnFilterChange = true;

    let search: string | null = null;
    let listLoader: { [key: string]: boolean } = {};
    let categoriesData: { name: string; value: string }[] = [];
    let listNotFound: { [key: string]: boolean } = {};
    let listNotFoundMessage: string = '';
    let loader = true;
    let selectedYear: string = '';
    let selectedLimit: string = '';
    let selectedCategory: string = '';
    let currentPage: number = 1;
    let from: Date | null = null;
    let till: Date | null = null;
    let validationError: string = '';

    /* Storage functions */
    import { createSnapshot } from '$utils/component-states/snapshot';
    import { debounce, getDomPathOfElement, noop } from '$utils/ops';
    const { getCurrentValue, saveSnapshot, setSnapshotKey } = createSnapshot();
    const updateValuesFromSnapshot = () => {
        from = getCurrentValue('from') || from;
        till = getCurrentValue('till') || till;
        selectedLimit = getCurrentValue('selectedLimit') || selectedLimit;
        search = getCurrentValue('search') || search;
        selectedCategory = getCurrentValue('selectedCategory') || selectedCategory;
        years = getCurrentValue('years') || years;
        selectedYear = getCurrentValue('selectedYear') || selectedYear;
    };
    let compRootHtmlEl: HTMLElement;
    onMount(() => {
        // compRootHtmlEl is only available once component is mounted
        setSnapshotKey(`newslist-${getDomPathOfElement(compRootHtmlEl)}`);
        updateValuesFromSnapshot();
    });
    onDestroy(() => {
        saveSnapshot({
            from: from,
            till: till,
            selectedLimit: selectedLimit,
            search: search,
            selectedCategory: selectedCategory,
            selectedYear,
            years
        });
    });
    /* Storage functions */

    if (categories.length > 0) {
        listNotFound['all_categories'] = false;
        if (!tags) {
            listNotFound['all_tags'] = false;
        }
    }

    const getCategoryNames = debounce(async (categories: string[]) => {
        listLoader['categories'] = true;
        await tick();
        try {
            categoriesData = await getNewsCategories(categories);
            // Use custom category name from translations if available, otherwise use the original name
            categoriesData = categoriesData.map(({ name, value }) => ({
                name: $t(`news.${value}`) || name,
                value
            }));
        } catch (error) {
            console.error('Error fetching News category names:', error);
        } finally {
            listLoader['categories'] = false;
        }
    });

    $: if (
        Object.keys(listNotFound).length > 0 &&
        Object.values(listNotFound).every((value) => value === true)
    ) {
        listNotFoundMessage = notFound;
    } else {
        listNotFoundMessage = '';
    }

    $: $locale && groupBy && groupBy.includes('category') && getCategoryNames(categories);
    $: if ($locale && Object.values(listLoader).every((value) => value === false)) {
        loader = false;
    }
    const setCategories = () => {
        if (selectedCategory !== '') {
            if (Array.isArray(selectedCategory)) {
                selectedCategories = selectedCategory;
            } else {
                selectedCategories = selectedCategory.split(';');
            }
        } else {
            selectedCategories = categories;
        }
    };
    $: if (categorySelector || selectedCategory) {
        setCategories();
    }

    /**
     * this can reset the years when group by is category
     */
    const resetYearWhenGroupByCategory = () => {
        if ((groupBy === null || !groupBy.includes('year')) && categorySelector) {
            years = [''];
        }
    };

    /**
     * reset years on change of category when group by is category
     * and sub group is years
     */
    $: {
        noop(selectedCategory);
        resetYearWhenGroupByCategory();
    }

    $: {
        if (from && till) {
            if (from > till) {
                validationError = 'Timerange end is before timerange start.';
            }
        }
    }

    $: {
        if (selectedLimit) {
            itemsPerPage = selectedLimit;
        }
    }
</script>

<Loader {loader} bind:compRootHtmlEl>
    {#if groupBy === null || !groupBy.includes('year')}
        {#if categorySelector}
            <CategorySelector
                {selectorCategories}
                bind:selectedCategory
                {showAllCategory}
                {categorySelector}
                {multiSelect}
                {years}
            />
        {/if}
        {#if yearSelector}
            <!-- if yearSelector prop is set -->
            <YearSelector
                {showAllYears}
                bind:selectedYear={years[0]}
                categories={selectedCategories}
                {tags}
                {noOfYears}
                {activeYear}
                {archive}
                {archiveTill}
                {yearSelector}
                {fiscalYearBeginMD}
                {fiscalYearEndMD}
                {newsTypes}
            />
        {/if}
    {/if}
    {#if showSearch}
        <input
            type="text"
            placeholder={$t('common.searchPlaceholder')}
            bind:value={search}
            class="news__search"
        />
    {/if}
    {#if showLimitSelector}
        <LimitSelector bind:selectedLimit />
    {/if}
    {#if showDateSelector}
        <DateSelector bind:from bind:till />
    {/if}
    {#if groupBy}
        <!-- if GroupBy -->
        {#if categoriesData.length > 0 && groupBy === 'category'}
            <!-- if GroupBy category -->
            {#each categoriesData as category}
                <div>
                    <h4 class="news__category-name">
                        {category.name}
                    </h4>
                    <News
                        {paginatorType}
                        {years}
                        {groupBy}
                        categories={[category.value]}
                        {tags}
                        {itemsPerPage}
                        {notFound}
                        {currentPage}
                        bind:itemsNotFound={listNotFound[category.value]}
                        bind:listLoader={listLoader[category.value]}
                        {template}
                        {isLandingPage}
                        {newsTypes}
                        {search}
                        {showSummary}
                        {mixedLanguage}
                        {showPdf}
                        {from}
                        {till}
                        {showDetailViewModal}
                        {restrictions}
                        {resetPageOnFilterChange}
                    />
                </div>
            {/each}
        {:else if groupBy.includes('year')}
            {#if yearSelector}
                <!-- if yearSelector prop is set -->
                <YearSelector
                    {showAllYears}
                    bind:selectedYear
                    {categories}
                    {tags}
                    {noOfYears}
                    {activeYear}
                    {archive}
                    {archiveTill}
                    {yearSelector}
                    {fiscalYearBeginMD}
                    {fiscalYearEndMD}
                    {newsTypes}
                />
            {/if}
            {#if categorySelector}
                <CategorySelector
                    {selectorCategories}
                    bind:selectedCategory
                    {showAllCategory}
                    {categorySelector}
                    {multiSelect}
                    {years}
                />
            {/if}
            <News
                {paginatorType}
                years={[selectedYear]}
                {groupBy}
                categories={[selectedCategory]}
                {tags}
                {itemsPerPage}
                {notFound}
                {currentPage}
                {template}
                {isLandingPage}
                {newsTypes}
                {search}
                {showSummary}
                {mixedLanguage}
                {showPdf}
                {from}
                {till}
                {showDetailViewModal}
                {restrictions}
                {resetPageOnFilterChange}
            />
        {:else}
            {notFound}
        {/if}
    {:else}
        <!--  no GroupBy, Show news from given category or tags -->
        <News
            {paginatorType}
            {years}
            categories={selectedCategories}
            {tags}
            {itemsPerPage}
            {notFound}
            {currentPage}
            bind:listLoader={listLoader['all']}
            {template}
            {isLandingPage}
            {newsTypes}
            {search}
            {showSummary}
            {mixedLanguage}
            {showPdf}
            {from}
            {till}
            {showDetailViewModal}
            {restrictions}
            {resetPageOnFilterChange}
        />
    {/if}
    {#if listNotFoundMessage}
        <p>{listNotFoundMessage}</p>
    {/if}
</Loader>
