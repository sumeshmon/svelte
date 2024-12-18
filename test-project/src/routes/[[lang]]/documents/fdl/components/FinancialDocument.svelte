<script lang="ts">
    import Table from '$components/Table.svelte';
    import { fetchYears, getFDList } from '$utils/documents/helper';
    import type { Document } from '$utils/documents/types';
    import { PUBLIC_PAGE_LIMIT } from '$env/static/public';
    import { locale, t } from '$lib/translations';
    import Loader from '$components/Loader.svelte';
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import { handleClick } from '$components/disclaimer/handleClick';
    import { debounce } from '$utils/ops';
    let loader: boolean = true;
    export let itemsPerYear: string = PUBLIC_PAGE_LIMIT;
    export let categories: Array<string> | null = null;
    export let tags: Array<string> | null = null;
    export let featureDocument: string | null = null;
    export let notFound: string = $t('documents.no_item_found');
    export let currentPage: number = 1;
    export let noOfYears: number | null = null;
    export let archive: boolean = false;

    let uniqueYears: OptionType[] = [];
    export let sortOrder: string | null = null;
    export let dateOrder: string = 'DESC';
    export let yearOrder: string = 'DESC';
    export let timeOrder: string | null = null;
    export let fiscalYearBeginMD: string | null = null;
    export let fiscalYearEndMD: string | null = null;
    const documentListByYear: { [year: string]: Document[] } = {};
    let items: { [category: string]: { [year: string]: Document[] } } = {};
    let quarterTags: Array<string> = ['q1', 'q2', 'q3', 'q4'];
    let displayYears: Array<string> = [];
    const params = new URLSearchParams();
    featureDocument && params.append('isFeatureDocument', featureDocument);
    categories && categories.forEach((category) => params.append('category.slug[]', category));
    tags && tags.forEach((tag) => params.append('tags.slug[]', tag));
    sortOrder && params.append('sortOrder', sortOrder);
    timeOrder && params.append('timeOrder', timeOrder);
    dateOrder && params.append('dateOrder', dateOrder);

    const setItems = (years: OptionType[], docListByYear: { [key: string]: Document[] }) => {
        displayYears = [];
        items = {};
        for (const year of years) {
            let displayYear = year.value;
            if (displayYear.includes('_')) {
                displayYear = (parseInt(displayYear) - 1).toString();
            }
            displayYears.push(displayYear);
            for (const document of docListByYear[year.value]) {
                if (categories) {
                    for (const category of categories) {
                        items[category] = items[category] ?? {};
                        items[category][displayYear] = items[category][displayYear] ?? [];
                        if (document?.category?.find((cat) => cat.slug === category)) {
                            items[category][displayYear].push(document);
                        }
                    }
                }
            }
        }

        if (yearOrder === 'DESC') {
            displayYears.sort((a, b) => parseInt(b) - parseInt(a));
        } else {
            displayYears.sort((a, b) => parseInt(a) - parseInt(b));
        }
    };

    const getData = debounce(async () => {
        try {
            loader = true;
            uniqueYears = await fetchYears({
                params: params,
                noOfYears: noOfYears,
                archive: archive,
                fiscalYearBeginMD: fiscalYearBeginMD,
                fiscalYearEndMD: fiscalYearEndMD
            });

            await Promise.all(
                uniqueYears.map(async (year) => {
                    const response = await getFDList({
                        lang: $locale,
                        itemsPerPage: itemsPerYear,
                        years: year.value,
                        featureDocument,
                        categories,
                        tags,
                        page: currentPage,
                        sortOrder,
                        dateOrder,
                        timeOrder
                    });
                    documentListByYear[year.value] = response.documents;
                })
            );
        } catch (error) {
            console.error('Error fetching Documents:', error);
        } finally {
            setItems(uniqueYears, documentListByYear);
            loader = false;
        }
    });

    $: if ($locale) getData();
</script>

<Loader align="center" animation={true} {loader}>
    {#if !Object.values(documentListByYear).every((arr) => arr.length === 0) && displayYears.length > 0}
        <div style="overflow-x: auto;">
            <Table>
                <thead slot="thead">
                    <tr>
                        <th>Category</th>
                        {#each displayYears as year}
                            <th>{year}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#if categories}
                        {#each categories as orderCategory}
                            {#if items[orderCategory]}
                                <tr>
                                    <td>{$t('documents.' + orderCategory)}</td>
                                    {#each displayYears as year}
                                        <td>
                                            {#if items[orderCategory][year]}
                                                {#each items[orderCategory][year] as document}
                                                    {#if (orderCategory === 'annual_report' || orderCategory === 'proxy') && document.tags && document.tags.length > 0}
                                                        <a
                                                            class="mr-2"
                                                            target="_blank"
                                                            on:click={(event) =>
                                                                handleClick(event, document)}
                                                            data-disclaimer={document.disclaimer}
                                                            data-uuid={document.id}
                                                            href="{document.filePath}?disposition=inline"
                                                            >{document.tags[0].name}</a
                                                        >
                                                    {/if}
                                                {/each}
                                            {/if}
                                            {#if (orderCategory === 'annual_report' || orderCategory === 'proxy') && items[orderCategory][year] && items[orderCategory][year].length === 0}
                                                {$t('documents.slug_' + orderCategory)}
                                            {/if}
                                            {#if orderCategory !== 'annual_report' && orderCategory !== 'proxy'}
                                                {#each quarterTags as quarter}
                                                    {#if items[orderCategory][year]}
                                                        {#if items[orderCategory][year].some((document) => document.tags && document.tags.length > 0 && document.tags[0].slug === quarter)}
                                                            {#each items[orderCategory][year] as document}
                                                                {#if document.tags && document.tags.length > 0 && document.tags[0].slug === quarter}
                                                                    <a
                                                                        class="mr-2"
                                                                        target="_blank"
                                                                        on:click={(event) =>
                                                                            handleClick(
                                                                                event,
                                                                                document
                                                                            )}
                                                                        data-disclaimer={document.disclaimer}
                                                                        data-uuid={document.id}
                                                                        href="{document.filePath}?disposition=inline"
                                                                        >{document.tags[0].name}</a
                                                                    >
                                                                {/if}
                                                            {/each}
                                                        {:else}
                                                            <span class="mr-2"
                                                                >{$t('documents.' + quarter)}</span
                                                            >
                                                        {/if}
                                                    {/if}
                                                {/each}
                                            {/if}
                                        </td>
                                    {/each}
                                </tr>
                            {/if}
                        {/each}
                    {/if}
                </tbody>
            </Table>
        </div>
    {:else}
        <p>{notFound}</p>
    {/if}
</Loader>
