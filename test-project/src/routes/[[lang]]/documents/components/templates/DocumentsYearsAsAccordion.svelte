<script lang="ts">
    import Accordion, { createAccordionContext } from '$components/Accordion.svelte';
    createAccordionContext();
    import { documentHasFile, getDocumentTitle, getDocumentUrl } from '$utils/documents/helper';
    import { handleClick } from '$components/disclaimer/handleClick';
    import type { Document } from '$utils/documents/types';
    import { t } from '$lib/translations';
    export let documentList: Document[] = [];
    let documentListContent: { [year: string]: Document[] } = {};
    documentList.forEach((document) => {
        const date = document.date.replace('T', ' ').split('+')[0];
        const year = new Date(date).getFullYear().toString();
        if (!documentListContent[year]) {
            documentListContent[year] = [];
        }
        documentListContent[year].push(document);
    });
    let sortedDocumentListContent = Object.entries(documentListContent).sort(
        ([yearA], [yearB]) => Number(yearB) - Number(yearA)
    );
</script>

{#each sortedDocumentListContent as [year, documents]}
    <Accordion>
        <span slot="title">{year}</span>
        <div slot="content">
            <ul class="list-group">
                {#each documents as document}
                    {#if documentHasFile(document)}
                        <li class="list-group-item list-group-item-action mb-0">
                            <a
                                class="document__download"
                                href={getDocumentUrl(document)}
                                target="_blank"
                                on:click={(event) => handleClick(event, document)}
                                data-disclaimer={document.disclaimer}
                                data-uuid={document.id}
                            >
                                {@html getDocumentTitle(document)}</a
                            >
                        </li>
                    {:else if document.link}
                        {#each document.link as link}
                            <li class="list-group-item list-group-item-action mb-0">
                                <a
                                    class="document__download"
                                    href={link.url}
                                    target="_blank"
                                    on:click={(event) => handleClick(event, document)}
                                    data-disclaimer={document.disclaimer}
                                    data-uuid={document.id}
                                    ><span class="icon-master-link" /> {link.title}</a
                                >
                            </li>
                        {/each}
                    {:else}
                        {$t('documents.download_na')}
                    {/if}
                {/each}
            </ul>
        </div>
    </Accordion>
{/each}
