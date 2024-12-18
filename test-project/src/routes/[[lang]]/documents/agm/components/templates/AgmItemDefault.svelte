<script lang="ts">
    import type { Document } from '$utils/documents/types';
    import { DocumentType } from '$utils/constants';
    import {
        documentHasFile,
        getDocumentUrl,
        getDocumentFileInfo,
        getDocumentTitle
    } from '$utils/documents/helper';
    import { handleClick } from '$components/disclaimer/handleClick';
    export let document: Document;
    let heading = getDocumentTitle(document);
</script>

<div class="agm__item agm__item--{document.documentType.toLowerCase()}">
    {#if document.documentType == DocumentType.Pdf}
        <div class="agm__item-content">
            <span class="agm__item-title">{@html heading}</span>
            {#if document.filePath && documentHasFile(document)}
                {#if document.fileType === 'text/html'}
                    <a
                        class="agm__item-link"
                        href={getDocumentUrl(document, 'disposition=inline')}
                        on:click={(event) => handleClick(event, document)}
                        target="_blank">{@html heading}</a
                    >
                {:else}
                    <a
                        href={getDocumentUrl(document, 'disposition=inline')}
                        on:click={(event) => handleClick(event, document)}
                        target="_blank"
                        class="agm__item-download-link"
                    >
                        <span class="icon-master-file-pdf" />
                        {getDocumentFileInfo(document).toUpperCase()}
                    </a>
                {/if}
            {/if}
        </div>
    {/if}

    {#if document.documentType == DocumentType.Title}
        <h3 class="agm__item-content">
            {@html heading}
        </h3>
    {/if}
    {#if document.documentType == DocumentType.HvTitle}
        <h3 class="agm__item-content">
            {@html heading}
        </h3>
    {/if}
    {#if document.documentType == DocumentType.Subtitle}
        <div class="agm__item-content">
            {@html heading}
        </div>
    {/if}
    {#if document.documentType == DocumentType.Text}
        <div class="agm__item-content">
            {@html heading}
        </div>
    {/if}
    {#if document.documentType == DocumentType.Word}
        <div class="agm__item-content">
            {@html heading}
        </div>
    {/if}
    {#if document.documentType == DocumentType.Button}
        <div class="agm__item-content">
            {#if documentHasFile(document)}
                <a
                    class="btn btn-primary"
                    on:click={(event) => handleClick(event, document)}
                    href={getDocumentUrl(document)}
                    target="_blank"
                >
                    {@html heading}
                </a>
            {:else if document.link}
                {#each document.link as link}
                    <a class="btn btn-primary" href={link.url} target="_blank">{link.title}</a>
                {/each}
            {/if}
        </div>
    {/if}
    {#if document.documentType == DocumentType.Link}
        <div class="agm__item-content">
            <a href={document.link[0].url} class="agm__item-link" target="_blank">{@html heading}</a
            >
        </div>
    {/if}
    {#if document.documentType == DocumentType.Video}
        {#each document.link as link}
            <div class="agm__item-content agm__item-iframe-wrapper ratio ratio-16x9">
                <iframe title={heading} class="agm__item-iframe" src={link.url} />
            </div>
        {/each}
        <div class="agm__item-title">
            <strong>{@html heading}</strong>
        </div>
    {/if}
</div>
