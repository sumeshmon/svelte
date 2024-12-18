<script lang="ts">
    import Maintenance from '$components/Maintenance.svelte';
    import { browser } from '$app/environment';
    export let data;
    import { onMount, onDestroy } from 'svelte';
    import { isPreviewMode } from '$utils/website-content/constants';
    import { goto } from '$app/navigation';
    import { postMessageToParentWindow } from '$utils/ops.js';
    import { page } from '$app/stores';
    import { afterUpdate } from 'svelte';

    onMount(() => {
        if (browser) {
            document.documentElement.lang = data.lang;
        }
        if (data.pageNotFound) {
            goto('/404');
        }
        if (isPreviewMode()) {
            postMessageToParentWindow('isReady=1&url=' + $page.url);
        }
    });
    onDestroy(() => {
        if (isPreviewMode()) {
            postMessageToParentWindow('isReady=1&url=' + $page.url);
        }
    });

    afterUpdate(() => {
        if (isPreviewMode()) {
            postMessageToParentWindow(`isReady=1&url=${$page.url}`);
        }
    });

    $: if (browser) {
        document.documentElement.lang = data.lang;
    }
</script>

{#if data.maintenance}
    <Maintenance />
{:else}
    <slot />
{/if}
