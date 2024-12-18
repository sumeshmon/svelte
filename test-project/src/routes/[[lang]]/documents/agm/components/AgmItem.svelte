<script lang="ts">
    import AgmItemDefault from './templates/AgmItemDefault.svelte';
    export let template: typeof AgmItemDefault = AgmItemDefault;
    import type { Document } from '$utils/documents/types';
    export let document: Document;
</script>

{#if document}
    {#if template}
        <svelte:component this={template} {document} />
    {/if}
{/if}
