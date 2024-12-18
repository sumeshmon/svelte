<script lang="ts">
    import YearSelector from '$routes/documents/components/YearSelector.svelte';
    import CategorySelector from '$routes/documents/components/CategorySelector.svelte';
    import { onMount, onDestroy } from 'svelte';
    import {
        getDocumentCategories,
        getDocumentTags,
        listNotFoundCheck
    } from '$utils/documents/helper';
    import Documents from './Documents.svelte';
    import { PaginatorType } from '$utils/constants';
    import Loader from '$components/Loader.svelte';
    import { PUBLIC_PAGE_LIMIT } from '$env/static/public';
    import { t, locale } from '$lib/translations';
    import DocumentsDefault from './templates/DocumentsDefault.svelte';
    export let template: typeof DocumentsDefault = DocumentsDefault;
    export let itemsPerPage: string = PUBLIC_PAGE_LIMIT;
    export let years: string[] | null = [];
    export let categories: string[] = [];
    export let restrictions: string[] = [];
    export let selectorCategories: string[] = categories;
    export let selectedCategories: string[] = categories;
    export let tags: string[] = [];
    export let featureDocument: string | null = null;
    export let notFound: string = $t('documents.no_item_found');
    export let paginatorType: string | boolean = PaginatorType.Pagination;
    export let groupBy: string | null = null;
    export let activeYear: string | null = null;
    export let archive: boolean = false;
    export let sortOrder: string | null = null;
    export let dateOrder: string | null = null;
    export let timeOrder: string | null = null;
    export let orderDate: string | null = 'DESC';
    export let categorySelector: string | null = null;
    export let yearSelector: string | null = null;
    export let noOfYears: number | null = null;
    export let showAllCategory: boolean = false;
    export let showAllYears: boolean = false;
    export let archiveTill: string = '';
    export let fiscalYearBeginMD: string | null = null;
    export let fiscalYearEndMD: string | null = null;
    export let resetPageOnFilterChange = true;
    let listLoader: { [key: string]: boolean } = {};
    let categoriesData: { name: string; value: string }[] = [];
    let tagsData: { name: string; value: string }[] = [];
    let listNotFound: { [key: string]: boolean } = {};
    let listNotFoundMessage: string = '';
    let loader = true;
    let selectedCategory: string = '';
    let currentPage: number = 1;
    let selectedYear: string = '';

    /* Storage functions */
    import { createSnapshot } from '$utils/component-states/snapshot';
    import { debounce, getDomPathOfElement } from '$utils/ops';
    const { getCurrentValue, saveSnapshot, setSnapshotKey } = createSnapshot();
    let compRootHtmlEl: HTMLElement;
    const updateValuesFromSnapshot = () => {
        selectedCategory = getCurrentValue('selectedCategory') || selectedCategory;
        selectedYear = getCurrentValue('selectedYear') || selectedYear;
    };
    onMount(() => {
        // compRootHtmlEl is only available once component is mounted
        setSnapshotKey(`documentslist-${getDomPathOfElement(compRootHtmlEl)}`);
        updateValuesFromSnapshot();
    });
    onDestroy(() => {
        saveSnapshot({
            selectedCategory: selectedCategory,
            selectedYear: selectedYear
        });
    });
    /* Storage functions */

    if (categorySelector) {
        groupBy = null;
    }
    if (yearSelector) {
        if (years && years.length === 0) {
            years = null;
        }
    }
    if (categories.length > 0) {
        listNotFound['all_categories'] = false;
        if (!tags) {
            listNotFound['all_tags'] = false;
        }
    }

    const getCategoryNames = debounce(async (categories: string[]) => {
        listLoader['categories'] = true;
        try {
            categoriesData = await getDocumentCategories(categories);
        } catch (error) {
            console.error('Error fetching Document category names:', error);
        } finally {
            listLoader['categories'] = false;
        }
    });

    const getTagNames = debounce(async (tags: string[]) => {
        listLoader['tags'] = true;
        try {
            tagsData = await getDocumentTags(tags);
        } catch (error) {
            console.error('Error fetching Document tag names:', error);
        } finally {
            listLoader['tags'] = false;
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
    $: $locale && groupBy && groupBy.includes('tag') && getTagNames(tags);
    $: if ($locale && Object.values(listLoader).every((value) => value === false)) {
        loader = false;
    } else {
        loader = true;
    }

    $: if (categorySelector) {
        if (selectedCategory !== '') {
            selectedCategories = selectedCategory.split(';');
            years = null;
        } else {
            selectedCategories = [];
            years = null;
        }
    }
    $: if (selectedYear !== '') {
        if (years === null) {
            years = [];
        }
        years[0] = selectedYear;
    }
</script>

<Loader {loader} bind:compRootHtmlEl>
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
            bind:selectedYear
            categories={selectedCategories}
            {tags}
            {noOfYears}
            {activeYear}
            {archive}
            {archiveTill}
            {yearSelector}
            {fiscalYearBeginMD}
            {fiscalYearEndMD}
        />
    {/if}

    {#if groupBy}
        <!-- if GroupBy -->
        {#if categoriesData.length > 0 && groupBy === 'category'}
            <!-- if GroupBy category -->
            {#each categoriesData as category}
                <div>
                    <h4 class="document__category-name">
                        {category.name}
                    </h4>
                    <Documents
                        {paginatorType}
                        {years}
                        {featureDocument}
                        {groupBy}
                        categories={[category.value]}
                        {tags}
                        {itemsPerPage}
                        {notFound}
                        {currentPage}
                        bind:itemsNotFound={listNotFound[category.value]}
                        {sortOrder}
                        {dateOrder}
                        {timeOrder}
                        {orderDate}
                        bind:listLoader={listLoader[category.value]}
                        {template}
                        {restrictions}
                        {resetPageOnFilterChange}
                    />
                </div>
            {/each}
        {:else if tagsData.length > 0 && groupBy === 'tag'}
            <!-- if GroupBy tag -->
            {#each tagsData as tag}
                <div>
                    {#if listNotFound[tag.value] === false}
                        <h5 class="document__tag-name">
                            {tag.name}
                        </h5>
                    {/if}
                    <Documents
                        {paginatorType}
                        {years}
                        {featureDocument}
                        {groupBy}
                        {categories}
                        tags={[tag.value]}
                        {itemsPerPage}
                        notFound=""
                        {currentPage}
                        bind:itemsNotFound={listNotFound[tag.value]}
                        {sortOrder}
                        {dateOrder}
                        {timeOrder}
                        {orderDate}
                        bind:listLoader={listLoader[tag.value]}
                        {template}
                        {restrictions}
                        {resetPageOnFilterChange}
                    />
                </div>
            {/each}
        {:else if categoriesData.length > 0 && tagsData.length > 0 && groupBy.includes('category') && groupBy.includes('tag')}
            <!-- if GroupBy category&tag -->
            {#each categoriesData as category}
                <h4 class="document__category-name">
                    {category.name}
                </h4>
                {#if listNotFoundCheck(listNotFound, category.value)}
                    {notFound}
                {/if}
                {#each tagsData as tag}
                    {#if listNotFound[category.value + tag.value] === false}
                        <h5 class="document__tag-name">
                            {tag.name}
                        </h5>
                    {/if}
                    <Documents
                        {paginatorType}
                        {years}
                        {featureDocument}
                        {groupBy}
                        categories={[category.value]}
                        tags={[tag.value]}
                        {itemsPerPage}
                        notFound=""
                        {currentPage}
                        bind:itemsNotFound={listNotFound[category.value + tag.value]}
                        {sortOrder}
                        {dateOrder}
                        {timeOrder}
                        {orderDate}
                        bind:listLoader={listLoader[category.value + tag.value]}
                        loader={false}
                        {template}
                        {restrictions}
                        {resetPageOnFilterChange}
                    />
                {/each}
            {/each}
        {:else if loader === false && Object.keys(listLoader).length > 0}
            {notFound}
        {/if}
    {:else}
        <!--  no GroupBy, Show documents from given category or tags -->
        <Documents
            {paginatorType}
            {years}
            {featureDocument}
            categories={selectedCategories}
            {tags}
            {itemsPerPage}
            {notFound}
            {currentPage}
            {sortOrder}
            {dateOrder}
            {timeOrder}
            {orderDate}
            bind:listLoader={listLoader['all']}
            {template}
            {restrictions}
            {resetPageOnFilterChange}
        />
    {/if}
    {#if listNotFoundMessage}
        <p>{listNotFoundMessage}</p>
    {/if}
</Loader>
