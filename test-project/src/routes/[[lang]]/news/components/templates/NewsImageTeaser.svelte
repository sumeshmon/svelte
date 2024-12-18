<script lang="ts">
    import type { NewsType } from '$utils/news/types';
    import {
        getNewsFormattedDate,
        getNewsDetailPageLink,
        getNewsImageUrl,
        getNewsSummary,
        getNewsCategoryName
    } from '$utils/news/ops';
    import { handleImageError } from '$utils/ops';
    import { locale } from '$lib/translations';
    export let newsList: NewsType[] = [];
    export let showSummary: boolean = false;
    let excludedTypes: string[] = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg'];
    export const handleDetailViewClick = async (event: MouseEvent, item: NewsType) => {};
</script>

<div class="news__wrapper">
    <div class="row">
        {#each newsList as news}
            <div class="col-md-4 mb-4">
                <div class="news__image-teaser">
                    <a href={getNewsDetailPageLink(news, $locale)} class="news__link">
                        <img
                            decoding="async"
                            src={getNewsImageUrl(news)}
                            class="news__image news__image-teaser--img"
                            alt=""
                            on:error={(event) => handleImageError(event)}
                        />
                    </a>

                    <div class="news__date d-block">{getNewsFormattedDate(news.newsDateLocal)}</div>
                    {#if news?.category.length > 0}
                        <span>{getNewsCategoryName(news)} |</span>
                    {/if}
                    <a href={getNewsDetailPageLink(news, $locale)} class="news__link">
                        <strong class="news__title">
                            {@html news.headline}
                        </strong>
                    </a>
                    {#if showSummary}
                        <div class="news__summary mb-2">
                            {getNewsSummary(news)}
                        </div>
                    {/if}
                    {#if news.urls[$locale]}
                        {#each news.urls[$locale] as localeUrls}
                            {#if localeUrls.linkType && !excludedTypes.includes(localeUrls.linkType.toLowerCase())}
                                <p>
                                    <a
                                        download
                                        data-link-type={localeUrls.linkType}
                                        href={localeUrls.linkUrl}
                                    >
                                        {#if localeUrls.linkType.toLowerCase() === 'pdf'}
                                            <i class="icon-master-file-pdf" />
                                        {/if}
                                        {#if localeUrls.linkType.toLowerCase() === 'link'}
                                            <i class="icon-master-link" />
                                        {/if}
                                        {#if localeUrls.linkType.toLowerCase() === 'jpg'}
                                            <i class="icon-master-link" />
                                        {/if}
                                        {localeUrls.linkTitle ? localeUrls.linkTitle : 'Download'}
                                    </a>
                                </p>
                            {/if}
                        {/each}
                    {/if}
                    {#if news.attachments}
                        {#each news.attachments as attachment}
                            <p>
                                <a download href={attachment.url}>
                                    {#if attachment.fileType === 'application/pdf'}
                                        <i class="icon-master-file-pdf" />
                                        <span>Download PDF</span>
                                    {/if}
                                </a>
                            </p>
                        {/each}
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>
