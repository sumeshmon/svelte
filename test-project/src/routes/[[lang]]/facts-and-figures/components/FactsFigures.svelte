<script lang="ts">
    import { getFactsFigures } from '$utils/facts-figures/ops';
    import { t, locale } from '$lib/translations';
    import Loader from '$components/Loader.svelte';
    import FactsFiguresDefault from '$routes/facts-and-figures/components/templates/FactsFiguresDefault.svelte';
    import type { TableData, DateFormat } from '$utils/facts-figures/types';
    import { debounce } from '$utils/ops';
    export let template: typeof FactsFiguresDefault = FactsFiguresDefault;
    export let slug: string = '';
    export let notFound: string = $t('facts.noFactsFigures');
    export let filterColumn: string = '';
    export let dateFormat: DateFormat = {
        en: {
            month: '2-digit/',
            day: '2-digit/',
            year: 'numeric'
        },
        de: {
            day: '2-digit.',
            month: '2-digit.',
            year: 'numeric'
        }
    };
    let loader = true;
    let tableData: TableData;

    const getData = debounce(async () => {
        loader = true;
        try {
            tableData = await getFactsFigures(slug, dateFormat);
        } catch (error) {
            console.error('Error fetching Figures (' + slug + '):', error);
        } finally {
            loader = false;
        }
    });

    $: if ($locale) {
        getData();
    }
</script>

<Loader {loader} animation={true}>
    {#if tableData && tableData.length > 0}
        {#if template}
            <svelte:component
                this={template}
                {tableData}
                {...filterColumn ? { filterColumn } : {}}
            />
        {/if}
    {:else}
        <p>{notFound}</p>
    {/if}
</Loader>
