<script lang="ts">
    import { getCombinedCompanyData } from '$utils/share/ops';
    import type { TableData } from '$utils/share/types';
    import { t, locale } from '$lib/translations';
    import { tick } from 'svelte';
    import Table from '$components/Table.svelte';
    import Loader from '$components/Loader.svelte';
    import { debounce } from '$utils/ops';
    let tableData: TableData = [];
    let loader: boolean = true;
    const getData = debounce(async () => {
        loader = true;
        await tick();
        try {
            tableData = await getCombinedCompanyData();
        } catch (error) {
            console.error('Error fetching Combined Company Data:', error);
        } finally {
            loader = false;
        }
    });
    $: $locale && getData();
</script>

<Loader {loader}>
    {#if tableData.length > 0}
        <div class="company-fundamentals">
            <Table className="table-hover table-cell-separated">
                <tbody>
                    {#each tableData as items, itemsIndex}
                        <tr>
                            {#each items as item, itemIndex}
                                {#if itemIndex == 0}
                                    <th class="w-50">{item}</th>
                                {:else}
                                    <td class="w-50">{@html item}</td>
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
