<script lang="ts">
    import AgmItem from '../AgmItem.svelte';
    import Accordion, { createAccordionContext } from '$components/Accordion.svelte';
    createAccordionContext();
    import type { Agm } from '$utils/documents/types';
    export let agm: Agm[];
</script>

{#if agm && agm.length > 0}
    {#each agm as document}
        {#if document.item}
            <AgmItem document={document.item} />
        {:else if document.popup}
            <Accordion>
                <span slot="title">{document.popup[0].item?.title}</span>
                <div slot="content">
                    {#each document.popup as popup, index}
                        {#if index !== 0 && popup.item}
                            <AgmItem document={popup.item} />
                        {/if}
                    {/each}
                </div>
            </Accordion>
        {:else if document.titlePopup}
            <Accordion>
                <span slot="title">{document.titlePopup[0].item?.title}</span>
                <div slot="content">
                    {#each document.titlePopup as titlePopup, index}
                        {#if index !== 0}
                            {#if titlePopup.item}
                                <AgmItem document={titlePopup.item} />
                            {/if}
                            {#if titlePopup.popup}
                                <Accordion>
                                    <span slot="title">{titlePopup.popup[0].item?.title} </span>
                                    <div slot="content">
                                        {#each titlePopup.popup as popup, index}
                                            {#if index !== 0 && popup.item}
                                                <AgmItem document={popup.item} />
                                            {/if}
                                        {/each}
                                    </div>
                                </Accordion>
                            {/if}
                        {/if}
                    {/each}
                </div>
            </Accordion>
        {/if}
    {/each}
{/if}
