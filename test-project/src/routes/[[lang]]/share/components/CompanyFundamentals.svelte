<script lang="ts">
    import { getCompanyFundamentals } from '$utils/share/ops';
    import type { TableData } from '$utils/share/types';
    import { t, locale } from '$lib/translations';
    import Table from '$components/Table.svelte';
    import Loader from '$components/Loader.svelte';
    import { debounce } from '$utils/ops';
    let tableData: TableData = [];
    let loader: boolean = true;
    const getData = debounce(async () => {
        loader = true;
        try {
            tableData = await getCompanyFundamentals();
        } catch (error) {
            console.error('Error fetching Company Fundamentals:', error);
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
