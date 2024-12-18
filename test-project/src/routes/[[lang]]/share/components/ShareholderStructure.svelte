<script lang="ts">
    import { getShareholderStructure } from '$utils/share/ops';
    import type { ShareholderStructure } from '$utils/share/types';
    import { t, locale } from '$lib/translations';
    import Highcharts from './Highcharts.svelte';
    import Table from '$components/Table.svelte';
    import Loader from '$components/Loader.svelte';
    import { debounce } from '$utils/ops';
    export let category: string = 'Shareholders';
    export let type: string = 'chart';
    export let footnote: boolean = true;
    export let lastUpdatedDate: boolean = true;
    let shareholderData: ShareholderStructure;
    let loader: boolean = true;
    const getData = debounce(async () => {
        loader = true;
        try {
            shareholderData = await getShareholderStructure(category);
        } catch (error) {
            console.error('Error fetching shareholder structure data:', error);
        } finally {
            loader = false;
        }
    });

    $: $locale && getData();
</script>

<Loader {loader} animation={true} align="center">
    {#if shareholderData}
        <div class="shareholder-structure">
            {#if type.includes('chart')}
                <div class="shareholder-structure__highcharts">
                    <Highcharts
                        seriesName={shareholderData.seriesName}
                        data={shareholderData.highchartsData}
                    />
                </div>
            {/if}
            {#if type.includes('table')}
                <div class="shareholder-structure__table">
                    <Table className="table-bordered table-striped">
                        <tbody>
                            {#each shareholderData.tableData as items, itemsIndex}
                                <tr>
                                    {#each items as item, itemIndex}
                                        {#if itemIndex == 0}
                                            <th class="w-50">{item}</th>
                                        {:else}
                                            <td class="w-50">{item}</td>
                                        {/if}
                                    {/each}
                                </tr>
                            {/each}
                        </tbody>
                    </Table>
                </div>
            {/if}
            {#if footnote}
                <div class="shareholder-structure__footnote">
                    {@html shareholderData.footNote}
                </div>
            {/if}
            {#if lastUpdatedDate && shareholderData.lastUpdatedDate !== ''}
                <div class="shareholder-structure__date">
                    {$t('share.lastUpdated')}: {shareholderData.lastUpdatedDate}
                </div>
            {/if}
        </div>
    {/if}
</Loader>
