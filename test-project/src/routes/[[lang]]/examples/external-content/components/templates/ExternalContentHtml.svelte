<script lang="ts">
    import { t } from '$lib/translations';
    import type { ExternalContent } from '$utils/external-content/types';
    import { sanitizeContent } from '$utils/ops';
    export let data: ExternalContent | null = null;
</script>

{#if data}
    {@html sanitizeContent(data.content)}
{:else}
    {$t('common.noItemsFound')}
{/if}
