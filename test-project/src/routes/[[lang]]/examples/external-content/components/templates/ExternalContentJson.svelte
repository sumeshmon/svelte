<script lang="ts">
    import { t } from '$lib/translations';
    import type { ExternalContent } from '$utils/external-content/types';
    export let data: ExternalContent | null = null;
</script>

{#if data && data.content}
    <table>
        <tr>
            <td>Name:</td>
            <td>{data.content?.default?.name}</td>
        </tr>
        <tr>
            <td>Price: </td>
            <td>{data.content?.default?.closePrice}</td>
        </tr>
    </table>
{:else}
    {$t('common.noItemsFound')}
{/if}
