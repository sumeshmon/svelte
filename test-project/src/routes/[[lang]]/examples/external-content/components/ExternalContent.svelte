<script lang="ts">
    import { onMount } from 'svelte';
    import XmlTemplate from './templates/ExternalContentXml.svelte';
    import JsonTemplate from './templates/ExternalContentJson.svelte';
    import HtmlTemplate from './templates/ExternalContentHtml.svelte';
    import { getExternalContent } from '$utils/external-content/ops';
    import Loader from '$components/Loader.svelte';
    import type { ExternalContent } from '$utils/external-content/types';
    import { t } from '$lib/translations';
    export let slug: string | null = null;
    export let targetNode: string | undefined = 'item';
    let loader: boolean = true;
    let data: ExternalContent | null = null;
    let contentType: string = '';

    onMount(async () => {
        if (slug) {
            try {
                data = await getExternalContent(slug, targetNode);
                data && (contentType = data.contentType);
            } catch (error) {
                console.error('Error fetching external data:', error);
            } finally {
                loader = false;
            }
        } else {
            loader = false;
            console.error('Slug is null');
        }
    });
</script>

<Loader {loader}>
    {#if data && data.content}
        {#if contentType.includes('xml')}
            <XmlTemplate {data} />
        {:else if contentType.includes('json')}
            <JsonTemplate {data} />
        {:else if contentType.includes('html')}
            <HtmlTemplate {data} />
        {/if}
    {:else}
        {$t('common.noItemsFound')}
    {/if}
</Loader>
