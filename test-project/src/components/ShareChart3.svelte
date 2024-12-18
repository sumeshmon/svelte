<script lang="ts">
    import { iframeResize } from 'iframe-resizer';
    import { onMount } from 'svelte';
    export let chartLink: string = '';
    export let chartId: string = 'shareChart';

    onMount(() => {
        iframeResize({}, '#' + chartId);
    });
</script>

<iframe title="Chart" id={chartId} src={chartLink} frameborder="0" />
