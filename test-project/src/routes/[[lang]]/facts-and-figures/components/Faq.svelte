<script lang="ts">
    import { getFactsFigures } from '$utils/facts-figures/ops';
    import type { TableData } from '$utils/facts-figures/types';
    import { t, locale } from '$lib/translations';
    import Accordion, { createAccordionContext } from '$components/Accordion.svelte';
    import Loader from '$components/Loader.svelte';
    import { debounce } from '$utils/ops';
    createAccordionContext();
    let tableData: TableData;
    export let slug: string = 'faq';
    export let notFound: string = $t('facts.noFaq');
    let loader = true;
    const getData = debounce(async () => {
        loader = true;
        try {
            tableData = await getFactsFigures(slug);
        } catch (error) {
            console.error('Error fetching FAQ:', error);
        } finally {
            loader = false;
        }
    });

    $: if ($locale) {
        getData();
    }
</script>

<Loader {loader} animation={true}>
    {#if tableData && tableData.length > 0}
        {#each tableData as items, itemsIndex}
            <!-- The 'defaultOpen' prop is optional. If set to true for an accordion item, that accordion will be open by default on page load. -->
            <!-- The 'independent' prop is optional. If set to true, accordions will work independently -->
            <Accordion defaultOpen={itemsIndex == 0} independent={true}>
                <span slot="title">
                    {#each items as item, itemIndex}
                        {#if itemIndex == 0}
                            {@html item.html}
                        {/if}
                    {/each}
                </span>
                <div slot="content">
                    {#each items as item, itemIndex}
                        {#if itemIndex !== 0}
                            {@html item.html}
                        {/if}
                    {/each}
                </div>
            </Accordion>
        {/each}
    {:else}
        <p>{notFound}</p>
    {/if}
</Loader>
