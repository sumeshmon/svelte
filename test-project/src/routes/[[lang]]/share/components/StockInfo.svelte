<script lang="ts">
    import { getStockInfo } from '$utils/share/ops';
    import type { TableData } from '$utils/share/types';
    import { t, locale } from '$lib/translations';
    import Table from '$components/Table.svelte';
    import Loader from '$components/Loader.svelte';
    import { debounce } from '$utils/ops';
    let tableData: TableData = [];
    export let stockType: string = 'Ordinary';
    let loader: boolean = true;
    const getData = debounce(async () => {
        loader = true;
        try {
            tableData = await getStockInfo(stockType);
        } catch (error) {
            console.error('Error fetching stock data:', error);
        } finally {
            loader = false;
        }
    });

    $: $locale && getData();
</script>

<Loader {loader}>
    {#if tableData && tableData.length > 0}
        <div class="stock-info">
            <Table className="table-hover table-cell-separated">
                <tbody>
                    {#each tableData as items, itemsIndex}
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
    {:else}
        <p>{$t('share.notFound')}</p>
    {/if}
</Loader>
