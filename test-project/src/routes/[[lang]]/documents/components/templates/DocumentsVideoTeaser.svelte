<script lang="ts">
    import type { Document } from '$utils/documents/types';
    import { DocumentType } from '$utils/constants';
    import { getDocumentTitle } from '$utils/documents/helper';
    export let documentList: Document[] = [];
</script>

<div class="document__wrapper">
    <div class="row">
        {#each documentList as document}
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="document__video-teaser">
                        {#if document.documentType == DocumentType.Video}
                            {#each document.link as link}
                                <div class="ratio ratio-16x9">
                                    <iframe
                                        title={getDocumentTitle(document)}
                                        class="document__video-iframe"
                                        src={link.url}
                                    />
                                </div>
                            {/each}
                            <div class="document__video-title">
                                <strong>{@html getDocumentTitle(document)}</strong>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>
