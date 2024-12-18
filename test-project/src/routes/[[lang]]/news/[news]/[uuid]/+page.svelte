<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { getNewsDetailPageLink, getNewsFormattedDate, getNewsImageUrl } from '$utils/news/ops';
    import { locale, supportedLocales } from '$lib/translations/index.js';
    import Banner from '$components/Header/Banner.svelte';
    import GoBackButton from '$components/GoBackButton.svelte';
    import PdfGenerator from '$components/PdfGenerator.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    export let data: any;
    let image = getNewsImageUrl(data).trim();
    let excludedTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg'];
    const hideMissingLangButtons = () => {
        const newsLangKeys = Object.keys(data.headline);
        const langMenus = supportedLocales;
        const missingLanguages = langMenus.filter((lang) => !newsLangKeys.includes(lang));

        // Hide the missing items
        missingLanguages.forEach((lang) => {
            const item = document.querySelector(`.language-selector__item[data-lang="${lang}"]`);
            if (item) {
                item.classList.add('language-selector__item--hide');
            }
        });
    };

    const showAllLangButtons = () => {
        const langItems = document.querySelectorAll('.language-selector__item');
        langItems.forEach((item) => {
            item.classList.remove('language-selector__item--hide');
        });
    };

    onMount(() => {
        hideMissingLangButtons();
    });

    onDestroy(() => {
        showAllLangButtons();
    });

    $: {
        // force the correct translation of url
        const localizedPath = getNewsDetailPageLink(data, $locale);
        if (localizedPath !== $page.url.pathname) {
            goto(localizedPath);
        }
    }
</script>

<svelte:head>
    {#if data['headline'][$locale]}
        <title>{data['headline'][$locale]}</title>
        <meta name="description" content={data['summary'][$locale]} />
    {/if}
    <meta name="robots" content="index, follow" />
</svelte:head>

<div class="page news-detail">
    <Banner {image} />
    <Breadcrumb path={'/' + $locale + '/' + 'news'} />
    <div class="page__content">
        <div class="container">
            {#await data}
                <p>Loading...</p>
            {:then data}
                <PdfGenerator
                    id="detail-to-pdf-{data['id']}"
                    item={data['id']}
                    disposition={null}
                />
                {#if data['headline'][$locale]}
                    <h1 class="news-detail__headline">{data['headline'][$locale]}</h1>
                {/if}
                <p class="news-detail__date">
                    <strong>{getNewsFormattedDate(data.newsDateLocal)}</strong>
                </p>
                {#if data['content']?.[$locale]}
                    <div class="news-detail__content mb-3">
                        {@html data['content'][$locale]}
                    </div>
                {/if}
                {#if data.urls[$locale]}
                    {#each data.urls[$locale] as localeUrls}
                        {#if localeUrls.linkType && !excludedTypes.includes(localeUrls.linkType.toLowerCase())}
                            <p class="news-detail__download">
                                <a
                                    download
                                    target="_blank"
                                    data-link-type={localeUrls?.linkType}
                                    href={localeUrls.linkUrl}
                                >
                                    {#if localeUrls.linkType?.toLowerCase() === 'pdf'}
                                        <i class="icon-master-file-pdf" />
                                    {/if}
                                    {#if localeUrls.linkType?.toLowerCase() === 'link'}
                                        <i class="icon-master-link" />
                                    {/if}
                                    {#if localeUrls.linkType?.toLowerCase() === 'jpg'}
                                        <i class="icon-master-link" />
                                    {/if}
                                    {localeUrls.linkTitle ? localeUrls.linkTitle : 'Download'}
                                </a>
                            </p>
                        {/if}
                    {/each}
                {/if}
                {#if data.attachments}
                    {#each data.attachments as attachment}
                        <p class="news-detail__download">
                            <a download href={attachment.url}>
                                {#if attachment.fileType === 'application/pdf'}
                                    <i class="icon-master-file-pdf" />
                                    <span>Download PDF</span>
                                {/if}
                            </a>
                        </p>
                    {/each}
                {/if}
            {/await}
            <GoBackButton />
        </div>
    </div>
</div>
{#if data?.css}
    {@html `<style>${data.css}</style>`}
{/if}
