<script lang="ts">
    import { t, locale } from '$lib/translations';
    import FlipBook from '$components/FlipBook.svelte';
    import { getDocumentList } from '$utils/documents/helper';
    import { tick } from 'svelte';
    import Loader from '$components/Loader.svelte';
    import { debounce } from '$utils/ops';

    /*
    The dearflip documentation
        https://jquery.dearflip.com/docs/examples/
        based on documentation can handle controls position and all
        example: df-controls-top
    */

    export let category: string[] = [];
    export let tag: string[] = [];
    export let options: { [key: string]: any } = {
        webgl: false
    };

    let pdfUrl: string = '';
    let itemsPerPage: string = '1';
    let orderDate: string = 'DESC';
    let loader = true;
    let compRootHtmlEl: HTMLElement;

    const getData = debounce(async () => {
        await tick();

        try {
            const response = await getDocumentList({
                lang: $locale,
                itemsPerPage: itemsPerPage,
                categories: category,
                tags: tag,
                orderDate: orderDate
            });

            pdfUrl = response.documents[0]?.filePath;
        } catch (error) {
            console.error('Error fetching Documents:', error);
        } finally {
            loader = false;
        }
    });

    $: if ($locale) {
        loader = true;
        getData();
    }
</script>

<Loader {loader} bind:compRootHtmlEl>
    {#if !loader}
        <FlipBook {options} {pdfUrl} />
    {/if}
</Loader>
