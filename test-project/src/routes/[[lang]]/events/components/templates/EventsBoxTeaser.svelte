<script lang="ts">
    import { getEventTitle, getEventFormattedDate } from '$utils/events/ops';
    import { getNewsDetailPageLink, getPdfNewsLink } from '$utils/news/ops';
    import { getDocumentUrl } from '$utils/documents/helper';
    import { handleClick } from '$components/disclaimer/handleClick';
    import { createURLFriendlySlug, getIconClass } from '$utils/ops';
    import { base } from '$app/paths';
    import { locale } from '$lib/translations';
    export let events: any = [];
</script>

{#if events && events.length > 0}
    <div class="events__wrapper">
        <div class="row">
            {#each events as event}
                {#if event.boxItems.length > 0}
                    <div class="col-md-4 mb-4">
                        <div class="events__image-teaser">
                            <div class="events__date d-block">
                                {getEventFormattedDate(event)}
                            </div>

                            <strong class="news__title">
                                {@html getEventTitle(event)}
                            </strong>

                            {#each event.boxItems as boxItem}
                                {#if boxItem.documentType}
                                    {@const ext = boxItem.documentType.toLowerCase()}
                                    {#if getDocumentUrl(boxItem)}
                                        <p>
                                            <a
                                                data-link-type={boxItem.documentType}
                                                href={getDocumentUrl(boxItem)}
                                                on:click={(event) => handleClick(event, boxItem)}
                                                data-disclaimer={boxItem.disclaimer}
                                                data-uuid={boxItem.id}
                                            >
                                                {#if ext === 'img'}
                                                    <img
                                                        src={getDocumentUrl(boxItem)}
                                                        width="100"
                                                        alt={boxItem.title}
                                                        class=""
                                                    />
                                                {:else}
                                                    {#if getIconClass(ext)}
                                                        <i class={getIconClass(ext)} />
                                                    {/if}
                                                    {boxItem.title ? boxItem.title : 'Download'}
                                                {/if}
                                            </a>
                                        </p>
                                    {/if}
                                    {#if boxItem.link}
                                        {#each boxItem.link as link}
                                            <p>
                                                <a
                                                    target="_blank"
                                                    href={link.url}
                                                    title={link.title}
                                                >
                                                    {#if getIconClass(ext)}
                                                        <i class={getIconClass(ext)} />
                                                    {/if}
                                                    <span
                                                        >{boxItem.title
                                                            ? boxItem.title
                                                            : 'Download'}</span
                                                    >
                                                </a>
                                            </p>
                                        {/each}
                                    {/if}
                                {:else if boxItem.typeName === 'GeneralizedNews'}
                                    {#if getPdfNewsLink(boxItem, $locale)}
                                        <p>
                                            <a
                                                title={boxItem.headline?.[locale.get()]}
                                                class="d-block events__box-link"
                                                target="_blank"
                                                href={getPdfNewsLink(boxItem, locale.get())}
                                                ><i class={getIconClass('link')} />
                                                <span>{boxItem.headline[locale.get()]}</span></a
                                            >
                                        </p>
                                    {:else}
                                        <p>
                                            <a
                                                title={boxItem.headline[locale.get()]}
                                                class="d-block events__box-link"
                                                target="_blank"
                                                href={getNewsDetailPageLink(boxItem, locale.get())}
                                                ><i class={getIconClass('link')} />
                                                <span>{boxItem.headline[locale.get()]}</span></a
                                            >
                                        </p>
                                    {/if}
                                {/if}
                            {/each}
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
{/if}
