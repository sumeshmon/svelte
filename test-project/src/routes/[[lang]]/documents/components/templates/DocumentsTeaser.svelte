<script lang="ts">
    import type { Document } from '$utils/documents/types';
    import {
        documentHasFile,
        getDocumentFormattedDate,
        getDocumentUrl,
        getDocumentFileSize
    } from '$utils/documents/helper';
    import { handleClick } from '$components/disclaimer/handleClick';
    import { getDocumentTitle } from '$utils/documents/helper';
    import { t } from '$lib/translations';
    export let documentList: Document[] = [];
</script>

{#each documentList as document}
    <div class="document__wrapper mb-3">
        <div class="document__date d-none">{getDocumentFormattedDate(document)}</div>
        <h3 class="document__title">{@html getDocumentTitle(document)}</h3>
        {#if documentHasFile(document)}
            <a
                class="document__download"
                href={getDocumentUrl(document)}
                on:click={(event) => handleClick(event, document)}
                data-disclaimer={document.disclaimer}
                data-uuid={document.id}
                target="_blank"
                ><span class="icon-master-download" />
                {$t('documents.download_link')} ({getDocumentFileSize(document)})</a
            >
        {:else}
            {$t('documents.download_na')}
        {/if}
        <div class="document__description d-none">
            {@html document.description}
        </div>
    </div>
{/each}
