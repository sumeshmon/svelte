<script lang="ts">
    import Table from '$components/Table.svelte';
    import type { Document } from '$utils/documents/types';
    import {
        documentHasFile,
        getDocumentFileSize,
        getDocumentFormattedDate,
        getDocumentUrl
    } from '$utils/documents/helper';
    import { t } from '$lib/translations';
    import { handleClick } from '$components/disclaimer/handleClick';
    import { getDocumentTitle } from '$utils/documents/helper';
    export let documentList: Document[] = [];
</script>

<Table>
    <thead slot="thead">
        <tr>
            <th class="w-25">Date</th>
            <th class="w-50">Title</th>
            <th class="w-25">Download</th>
        </tr>
    </thead>
    <tbody>
        {#each documentList as document}
            <tr>
                <td>{getDocumentFormattedDate(document)}</td>
                <td>{@html getDocumentTitle(document)}</td>
                <td>
                    {#if documentHasFile(document)}
                        <a
                            class="document__download"
                            href={getDocumentUrl(document)}
                            target="_blank"
                            on:click={(event) => handleClick(event, document)}
                            data-disclaimer={document.disclaimer}
                            data-uuid={document.id}
                            ><span class="icon-master-download" />
                            {$t('documents.download_link')} ({getDocumentFileSize(document)})</a
                        >
                    {:else if document.link}
                        {#each document.link as link}
                            <a
                                class="document__download"
                                href={link.url}
                                target="_blank"
                                on:click={(event) => handleClick(event, document)}
                                data-disclaimer={document.disclaimer}
                                data-uuid={document.id}
                                ><span class="icon-master-link" /> {link.title}</a
                            >
                        {/each}
                    {:else}
                        {$t('documents.download_na')}
                    {/if}
                </td>
            </tr>
        {/each}
    </tbody>
</Table>
