<script lang="ts">
    import { tick } from 'svelte';
    import { fetchEventBox } from '$utils/events/api';
    import { prepareEventsList } from '$utils/events/ops';
    import { debounce } from '$utils/ops';
    import YearSelector from './YearSelector.svelte';
    import type { Event, BoxCategories } from '$utils/events/types';
    import { t, locale } from '$lib/translations';
    import Loader from '$components/Loader.svelte';
    import { PaginatorType } from '$utils/constants';
    import DynamicPaginator from '$components/DynamicPaginator.svelte';
    import EventBoxDefault from '$routes/events/components/templates/EventBoxDefault.svelte';
    export let template: typeof EventBoxDefault = EventBoxDefault;
    export let itemsPerPage: string = '10';
    export let categories: string[] = [];
    export let boxCategories: BoxCategories[] = [];
    export let tags: string[] = [];
    export let notFound: string = $t('events.noItemsFound');
    export let activeYear: string | null = null;
    export let archive: boolean = false;
    export let yearSelector: string | null = null;
    export let noOfYears: number | null = null;
    export let showAllYears: boolean = false;
    export let archiveTill: string = '';
    export let fiscalYearBeginMD: string | null = null;
    export let fiscalYearEndMD: string | null = null;
    export let startOrder: string | null = 'DESC';
    export let sortOrder: string | null = null;
    export let dateOrder: string | null = null;
    export let timeOrder: string | null = null;
    export let timeline: string | null = null;
    export let paginatorType: string | boolean = PaginatorType.Pagination;
    export let restrictions: string[] = ['hide_from_eventbox'];
    let currentPage: number = 1;
    let selectedYear: string = '';
    let events: Event[] = [];
    let eventsList: Event[] = [];
    let totalItems: number = -1;
    const params = new URLSearchParams();
    let loader: boolean = true;
    params.set('limit', itemsPerPage);
    categories && categories.forEach((category) => params.append('category.slug[]', category));
    tags && tags.forEach((tag) => params.append('tags.slug[]', tag));
    timeline && params.set('timeline', timeline);
    sortOrder && params.set('sortOrder', sortOrder);
    timeOrder && params.set('timeOrder', timeOrder);
    dateOrder && params.set('dateOrder', dateOrder);
    startOrder && params.set('order[start]', startOrder);
    restrictions.forEach((restriction) =>
        params.append('restriction_without_restriction[]', restriction)
    );
    const getData = debounce(async (selectedYear: string) => {
        loader = true;
        await tick();
        if (selectedYear === '') {
            if (yearSelector !== null && !showAllYears) {
                return;
            }
        }
        params.set('page', currentPage.toString());
        // For archive & fiscal years
        if (selectedYear.includes('_')) {
            const archiveYears = selectedYear.split(/[_]/);
            params.delete('years[]');
            params.set('start[after]', archiveYears[1] + 'T00:00:00');
            params.set('start[before]', archiveYears[0] + 'T23:59:59');
        } else if (selectedYear !== '') {
            params.delete('start[after]');
            params.delete('start[before]');
            params.set('years[]', selectedYear);
        } else {
            params.delete('start[after]');
            params.delete('start[before]');
            params.delete('years[]');
            if (archiveTill !== '') {
                params.set('start[after]', archiveTill + '-01-01T00:00:00');
            }
        }

        try {
            fetchEventBox(params).then(async (res) => {
                events = res['hydra:member'];
                totalItems = res['hydra:totalItems'];
                eventsList = prepareEventsList(events, eventsList, paginatorType);
            });
        } catch (error) {
            console.error('Error fetching EventBox:', error);
        } finally {
            loader = false;
        }
    });
    $: if ($locale || selectedYear || currentPage) {
        getData(selectedYear);
    }
    $: if (selectedYear || $locale) {
        currentPage = 1;
        eventsList = [];
    }
</script>

<Loader {loader}>
    <!-- if yearSelector prop is set -->
    {#if yearSelector}
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
            {restrictions}
        />
    {/if}
    {#if eventsList && totalItems > 0}
        {#if template}
            <svelte:component
                this={template}
                {eventsList}
                {...boxCategories.length > 0 ? { boxCategories } : {}}
            />
        {/if}
        {#if paginatorType}
            <DynamicPaginator {paginatorType} {totalItems} {itemsPerPage} bind:currentPage />
        {/if}
    {:else if eventsList && totalItems === 0}
        <p class="mt-1">{notFound}</p>
    {/if}
</Loader>
