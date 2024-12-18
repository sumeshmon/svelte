<script lang="ts">
    import AgmListDefault from './templates/AgmListDefault.svelte';
    export let template: typeof AgmListDefault = AgmListDefault;
    import Loader from '$components/Loader.svelte';
    import { getDocumentList, prepareAgmData } from '$utils/documents/helper';
    import type { Document, Agm } from '$utils/documents/types';
    import { t, locale } from '$lib/translations';
    import { debounce } from '$utils/ops';
    export let itemsPerPage: string;
    export let years: string[] = [];
    export let categories: string[] = [];
    export let restrictions: string[] = [];
    export let featureDocument: string | null = null;
    export let notFound: string = $t('documents.no_item_found');
    export let sortOrder: string | null = null;
    export let dateOrder: string | null = null;
    export let timeOrder: string | null = null;
    export let orderDate: string | null = 'DESC';
    let documents: Document[] = [];
    let documentList: Document[] = [];
    let totalItems: number = 0;
    let loader = true;
    let agm: Agm[];
    const getData = debounce(async () => {
        try {
            loader = true;
            agm = [];
            const response = await getDocumentList({
                lang: $locale,
                itemsPerPage: itemsPerPage,
                years: years,
                featureDocument: featureDocument,
                categories: categories,
                tags: null,
                page: 1,
                sortOrder: sortOrder,
                dateOrder: dateOrder,
                timeOrder: timeOrder,
                orderDate: orderDate,
                restrictions: restrictions
            });

            documents = response.documents;
            totalItems = response.totalItems;

            agm = prepareAgmData(documents);
        } catch (error) {
            console.error('Error fetching Documents:', error);
        } finally {
            loader = false;
        }
    });

    $: ($locale || years) && getData();
</script>

<Loader {loader}>
    {#if agm && totalItems > 0}
        <div class="agm">
            {#if template}
                <svelte:component this={template} {agm} />
            {/if}
        </div>
    {:else if documentList && totalItems === 0}
        <p>{notFound}</p>
    {/if}
</Loader>
