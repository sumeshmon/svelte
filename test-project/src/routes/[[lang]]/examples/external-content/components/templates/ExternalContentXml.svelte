<script lang="ts">
    import { t } from '$lib/translations';
    import type { ExternalContent } from '$utils/external-content/types';
    import { sanitizeContent } from '$utils/ops';
    export let data: ExternalContent | null = null;
</script>

{#if data && data.content && data.content.length > 0}
    {#each data.content as item}
        <div class="mb-5">
            <h2>{item.querySelector('headline')?.textContent}</h2>
            <strong>{item.querySelector('dateTime')?.textContent}</strong>
            <p class="mt-3">{@html sanitizeContent(item.querySelector('content').textContent)}</p>
        </div>
    {/each}
{:else}
    {$t('common.noItemsFound')}
{/if}
