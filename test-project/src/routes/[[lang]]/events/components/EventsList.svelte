<script lang="ts">
    import { tick, onMount, onDestroy } from 'svelte';
    import { getEventsCategories } from '$utils/events/ops';
    import Events from '$routes/events/components/Events.svelte';
    import { PaginatorType } from '$utils/constants';
    import { PUBLIC_PAGE_LIMIT } from '$env/static/public';
    import Loader from '$components/Loader.svelte';
    import { t, locale } from '$lib/translations';
    import YearSelector from '$routes/events/components/YearSelector.svelte';
    import CategorySelector from '$routes/events/components/CategorySelector.svelte';
    import MonthSelector from '$routes/events/components/MonthSelector.svelte';
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import Tabs from '$components/Tabs.svelte';
    import EventsDefault from '$routes/events/components/templates/EventsDefault.svelte';
    import { GroupByValues } from '$utils/constants';
    import { debounce } from '$utils/ops';
    export let template: typeof EventsDefault = EventsDefault;
    export let itemsPerPage: string = PUBLIC_PAGE_LIMIT;
    export let years: string[] = [];
    export let months: string[] = [];
    export let categories: string[] = [];
    export let restrictions: string[] = [];
    export let selectorCategories: string[] = categories;
    export let selectedCategories: string[] = categories;
    export let tags: string[] = [];
    export let timeline: string = '';
    export let notFound: string = $t('events.noItemsFound');
    export let paginatorType: string | boolean = PaginatorType.Pagination;
    export let groupBy: string | null = null;
    export let activeYear: string | null = null;
    export let archive: boolean = false;
    export let isLandingPage: boolean = false;
    export let showSearch: boolean = false;
    export let categorySelector: string | null = null;
    export let yearSelector: string | null = null;
    export let monthSelector: string | null = null;
    export let noOfYears: number | null = null;
    export let showAllCategory: boolean = false;
    export let showAllYears: boolean = false;
    export let showAllMonths: boolean = false;
    export let archiveTill: string = '';
    export let fiscalYearBeginMD: string | null = null;
    export let fiscalYearEndMD: string | null = null;
    export let startOrder: string | null = 'DESC';
    export let sortOrder: string | null = null;
    export let dateOrder: string | null = null;
    export let timeOrder: string | null = null;
    export let resetPageOnFilterChange = true;
    let search: string | null = null;
    let listLoader: { [key: string]: boolean } = {};
    let categoriesData: { name: string; value: string }[] = [];
    let listNotFound: { [key: string]: boolean } = {};
    let listNotFoundMessage: string = '';
    let loader = true;
    let selectedYear: string = '';
    let selectedMonth: string = '';
    let selectedCategory: string = '';
    let currentPage: number = 1;
    let groupByTabData: OptionType[] = [];

    /* Storage functions */
    import { createSnapshot } from '$utils/component-states/snapshot';
    import { getDomPathOfElement } from '$utils/ops';
    const { getCurrentValue, saveSnapshot, setSnapshotKey } = createSnapshot();
    let compRootHtmlEl: HTMLElement;
    const updateValuesFromSnapshot = () => {
        selectedCategory = getCurrentValue('selectedCategory') || selectedCategory;
        years = getCurrentValue('years') || years;
        selectedYear = getCurrentValue('selectedYear') || selectedYear;
        search = getCurrentValue('search') || search;
        timeline = getCurrentValue('timeline') || timeline;
    };
    onMount(() => {
        // compRootHtmlEl is only available once component is mounted
        setSnapshotKey(`eventslist-${getDomPathOfElement(compRootHtmlEl)}`);
        updateValuesFromSnapshot();
    });
    onDestroy(() => {
        saveSnapshot({
            selectedCategory,
            selectedYear: selectedYear,
            years,
            search,
            timeline
        });
    });
    /* Storage functions */

    if (groupBy == GroupByValues.Timeline) {
        timeline = 'upcoming';
        groupByTabData = [
            { name: $t('events.upcoming'), value: 'upcoming' },
            { name: $t('events.past'), value: 'past' }
        ];
    }
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
            categoriesData = await getEventsCategories(categories);
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

    $: $locale &&
        groupBy &&
        groupBy.includes(GroupByValues.Category) &&
        getCategoryNames(categories);
    $: if ($locale && Object.values(listLoader).every((value) => value === false)) {
        loader = false;
    }

    $: if (categorySelector) {
        if (selectedCategory !== '') {
            selectedCategories = selectedCategory.split(';');
            years = [''];
        } else {
            selectedCategories = [];
            years = [''];
        }
    }
</script>

{#if groupBy == GroupByValues.Timeline}
    <Tabs options={groupByTabData} bind:value={timeline} />
{/if}
<div class="wrapper" bind:this={compRootHtmlEl}>
    <Loader {loader}>
        {#if groupBy === null || !groupBy.includes(GroupByValues.Year)}
            {#if categorySelector}
                <CategorySelector
                    {selectorCategories}
                    bind:selectedCategory
                    {showAllCategory}
                    {categorySelector}
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
                    {timeline}
                    {groupBy}
                />
            {/if}
            {#if monthSelector}
                <!-- if monthSelector prop is set -->
                <MonthSelector {showAllMonths} bind:selectedMonth {monthSelector} />
            {/if}
        {/if}
        {#if showSearch}
            <input
                type="text"
                placeholder={$t('common.searchPlaceholder')}
                bind:value={search}
                class="events__search"
            />
        {/if}
        {#if groupBy}
            <!-- if GroupBy -->
            {#if categoriesData.length > 0 && groupBy === GroupByValues.Category}
                <!-- if GroupBy category -->
                {#each categoriesData as category}
                    <div>
                        <h4 class="news__category-name">
                            {category.name}
                        </h4>
                        <Events
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
                            {search}
                            {timeline}
                            {startOrder}
                            {sortOrder}
                            {dateOrder}
                            {timeOrder}
                            {restrictions}
                            {resetPageOnFilterChange}
                        />
                    </div>
                {/each}
            {:else if groupBy.includes(GroupByValues.Year)}
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
                        {timeline}
                        {groupBy}
                    />
                {/if}
                {#if categorySelector}
                    <CategorySelector
                        {selectorCategories}
                        bind:selectedCategory
                        {showAllCategory}
                        {categorySelector}
                    />
                {/if}
                <Events
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
                    {search}
                    {timeline}
                    {startOrder}
                    {sortOrder}
                    {dateOrder}
                    {timeOrder}
                    {restrictions}
                    {resetPageOnFilterChange}
                />
            {:else if groupBy.includes(GroupByValues.Timeline)}
                <Events
                    {paginatorType}
                    {years}
                    {groupBy}
                    {categories}
                    {tags}
                    {itemsPerPage}
                    {notFound}
                    {currentPage}
                    {template}
                    {isLandingPage}
                    {search}
                    {timeline}
                    {startOrder}
                    {sortOrder}
                    {dateOrder}
                    {timeOrder}
                    {restrictions}
                    {resetPageOnFilterChange}
                />
            {:else}
                {notFound}
            {/if}
        {:else}
            <!--  no GroupBy, Show events from given category or tags -->
            <Events
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
                {search}
                {timeline}
                {startOrder}
                {sortOrder}
                {dateOrder}
                {timeOrder}
                months={selectedMonth ? [selectedMonth] : months}
                {restrictions}
                {resetPageOnFilterChange}
            />
        {/if}
        {#if listNotFoundMessage}
            <p>{listNotFoundMessage}</p>
        {/if}
    </Loader>
</div>
