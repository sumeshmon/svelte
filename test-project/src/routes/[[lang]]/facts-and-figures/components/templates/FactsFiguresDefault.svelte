<script lang="ts">
    import type { TableData } from '$utils/facts-figures/types';
    import { extractAndRemoveFootnotes } from '$utils/facts-figures/ops';
    import Table from '$components/Table.svelte';
    export let tableData: TableData;
    const extractedData = extractAndRemoveFootnotes(tableData);
    tableData = extractedData.tableData;
    const footNotes: string[] = extractedData.footNotes;
</script>

<Table>
    <thead slot="thead">
        {#each tableData as items, itemsIndex}
            {#if itemsIndex == 0}
                <tr>
                    {#each items as item}
                        <th colspan={item.attribute.colspan}>{@html item.html}</th>
                    {/each}
                </tr>
            {/if}
        {/each}
    </thead>
    <tbody>
        {#each tableData as items, itemsIndex}
            {#if itemsIndex !== 0}
                <tr>
                    {#each items as item}
                        <td colspan={item.attribute.colspan}>{@html item.html}</td>
                    {/each}
                </tr>
            {/if}
        {/each}
    </tbody>
</Table>
{@html footNotes.join('')}
