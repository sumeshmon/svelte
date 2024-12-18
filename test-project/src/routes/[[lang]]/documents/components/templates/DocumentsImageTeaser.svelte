<script lang="ts">
    import type { Document } from '$utils/documents/types';
    import {
        documentHasThumb,
        getDocumentThumbnailUrl,
        getDocumentFormattedDate,
        getDocumentUrl
    } from '$utils/documents/helper';
    import { handleImageError } from '$utils/ops';
    import { handleClick } from '$components/disclaimer/handleClick';
    import { getDocumentTitle } from '$utils/documents/helper';
    export let documentList: Document[] = [];
</script>

<div class="document__wrapper">
    <div class="row">
        {#each documentList as document}
            <div class="col-md-4 mb-4">
                <div class="document__image-teaser">
                    {#if documentHasThumb(document)}
                        <a
                            href={getDocumentUrl(document)}
                            target="_blank"
                            on:click={(event) => handleClick(event, document)}
                            data-disclaimer={document.disclaimer}
                            data-uuid={document.id}
                            class="document__link"
                        >
                            <img
                                decoding="async"
                                src={getDocumentThumbnailUrl(document)}
                                alt={document.title}
                                class="document__image document__image-teaser-img"
                                on:error={(event) => handleImageError(event)}
                            />
                        </a>
                    {:else}
                        <img
                            decoding="async"
                            src="/images/placeholder.png"
                            alt={document.title}
                            class="document__image document__image-teaser-img"
                        />
                    {/if}
                    <span class="document__date">{getDocumentFormattedDate(document)}</span>
                    <a
                        href={getDocumentUrl(document)}
                        target="_blank"
                        on:click={(event) => handleClick(event, document)}
                        data-disclaimer={document.disclaimer}
                        data-uuid={document.id}
                        class="document__link"
                    >
                        <h3 class="document__title">
                            {@html getDocumentTitle(document)}
                        </h3>
                    </a>
                </div>
            </div>
        {/each}
    </div>
</div>
