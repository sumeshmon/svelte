<script lang="ts">
    import AgmList from './AgmList.svelte';
    import YearSelector from '$routes/documents/components/YearSelector.svelte';
    import AgmYearsAccordion from './AgmYearsAccordion.svelte';
    import { t } from '$lib/translations';
    export let itemsPerPage: string = '400';
    export let categories: string[] = ['agm'];
    export let restrictions: string[] = [];
    export let featureDocument: string | null = null;
    export let notFound: string = $t('documents.no_item_found');
    export let yearSelector: string | null = 'tabs';
    export let noOfYears: number | null = null;
    export let activeYear: string | null = null;
    export let fiscalYearBeginMD: string | null = null;
    export let fiscalYearEndMD: string | null = null;
    export let archiveTill: string = '';
    export let archive: boolean = false;
    let selectedYear: string = '';
</script>

{#if yearSelector !== 'accordion'}
    <YearSelector
        bind:selectedYear
        {categories}
        {noOfYears}
        {activeYear}
        {archive}
        {archiveTill}
        {yearSelector}
        {fiscalYearBeginMD}
        {fiscalYearEndMD}
    />

    {#if selectedYear}
        <AgmList
            years={[selectedYear]}
            {featureDocument}
            {categories}
            {itemsPerPage}
            {notFound}
            {restrictions}
        />
    {/if}
{:else}
    <AgmYearsAccordion
        {categories}
        {noOfYears}
        {activeYear}
        {archive}
        {archiveTill}
        {fiscalYearBeginMD}
        {fiscalYearEndMD}
        {featureDocument}
        {itemsPerPage}
        {notFound}
    />
{/if}
