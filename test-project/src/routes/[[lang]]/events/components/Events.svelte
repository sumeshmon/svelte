<script lang="ts">
    import { tick, onMount, onDestroy } from 'svelte';
    import Loader from '$components/Loader.svelte';
    import { getEventsList, prepareEventsList } from '$utils/events/ops';
    import type { Event } from '$utils/events/types';
    import { PUBLIC_PAGE_LIMIT } from '$env/static/public';
    import { PaginatorType } from '$utils/constants';
    import { t, locale } from '$lib/translations';
    import DynamicPaginator from '$components/DynamicPaginator.svelte';
    import EventsDefault from '$routes/events/components/templates/EventsDefault.svelte';
    import { GroupByValues } from '$utils/constants';
    export let template: typeof EventsDefault = EventsDefault;
    export let itemsPerPage: string = PUBLIC_PAGE_LIMIT;
    export let years: string[] = [];
    export let months: string[] = [];
    export let categories: string[] = [];
    export let restrictions: string[] = [];
    export let tags: string[] = [];
    export let timeline: string | null = null;
    export let notFound: string = $t('events.noItemsFound');
    export let itemsNotFound: boolean | null = null;
    export let paginatorType: string | boolean = PaginatorType.Pagination;
    export let currentPage: number = 1;
    export let groupBy: string | null = null;
    export let listLoader: boolean = !groupBy === null;
    export let isLandingPage: boolean = false;
    export let search: string | null = null;
    export let loader: boolean = groupBy === null;
    export let startOrder: string | null = 'DESC';
    export let sortOrder: string | null = null;
    export let dateOrder: string | null = null;
    export let timeOrder: string | null = null;
    export let resetPageOnFilterChange = true;
    let eventsList: Event[] = [];
    let totalItems: number = -1;
    let maxPages;

    const getData = debounce(async () => {
        if (timeline == 'upcoming') {
            startOrder = 'ASC';
        } else {
            startOrder = 'DESC';
        }
        if (groupBy === GroupByValues.UpcomingWithYears) {
            if (years && years.length > 0) {
                if (years[0] === 'upcoming') {
                    years = [];
                    timeline = 'upcoming';
                } else {
                    timeline = 'past';
                }
            }
        }
        if (totalItems > 0) {
            loader = true;
        }
        await tick();
        try {
            const response = await getEventsList({
                lang: $locale,
                itemsPerPage: itemsPerPage,
                timeline: timeline,
                categories: categories,
                years: years,
                months: months,
                tags: tags,
                page: currentPage,
                isLandingPage: isLandingPage,
                search: search,
                startOrder: startOrder,
                sortOrder: sortOrder,
                dateOrder: dateOrder,
                timeOrder: timeOrder,
                restrictions: restrictions
            });
            eventsList = prepareEventsList(response.events, eventsList, paginatorType);
            totalItems = response.totalItems;
            itemsNotFound = totalItems < 1;
        } catch (error) {
            console.error('Error fetching events:', error);
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
        months,
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
        months = getCurrentValue('months') || months;
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
        setSnapshotKey(`events-${getDomPathOfElement(compRootHtmlEl)}`);
        updateValuesFromSnapshot();
    });
    onDestroy(() => {
        saveSnapshot({
            currentPage,
            categories,
            years,
            months,
            tags,
            itemsPerPage,
            groupBy,
            search
        });
    });
    $: {
        noop(
            years,
            months,
            categories,
            tags,
            itemsPerPage,
            groupBy,
            search,
            $locale,
            search,
            timeline
        );
        resetCurrentPage(totalItems, resetPageOnFilterChange);
    }
    /* Storage functions */
    $: {
        noop(
            years,
            months,
            categories,
            tags,
            itemsPerPage,
            groupBy,
            search,
            $locale,
            search,
            timeline,
            currentPage
        );
        getData();
    }
</script>

<Loader {loader} bind:compRootHtmlEl>
    {#if eventsList && totalItems > 0}
        {#if template}
            <svelte:component this={template} {eventsList} {timeline} />
        {/if}
        {#if paginatorType}
            <DynamicPaginator {paginatorType} {totalItems} {itemsPerPage} bind:currentPage />
        {/if}
    {:else if eventsList && totalItems === 0}
        <p class="mt-1">{notFound}</p>
    {/if}
</Loader>
