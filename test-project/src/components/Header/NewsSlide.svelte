<script lang="ts">
    import { getNewsDetailPageLink, getNewsFormattedDate, getNewsList } from '$utils/news/ops';
    import type { NewsType } from '$utils/news/types';
    import { locale, t } from '$lib/translations';
    export let newsOffset: string = '0';
    export let itemsPerPage: string = '1';
    export let years: Array<string> = [];
    export let categories: Array<string> = [];
    export let newsTypes: Array<string> = [];
    export let tags: Array<string> = [];
    export let notFound: string = $t('news.noItemsFound');
    export let currentPage: number = parseInt(newsOffset) + 1;
    export let isLandingPage: boolean = false;
    export let backgroundImage: string = '';

    let news: NewsType[] = [];
    let style: string = '';
    backgroundImage && (style += 'background-image:url(' + backgroundImage + ')');

    const getData = async () => {
        try {
            const response = await getNewsList({
                lang: $locale,
                itemsPerPage: itemsPerPage,
                years: years,
                categories: categories,
                newsTypes: newsTypes,
                tags: tags,
                page: currentPage,
                isLandingPage: isLandingPage
            });
            if (response) {
                news = response.news;
            }
        } catch (error) {
            console.error('Error fetching News:', error);
        }
    };

    $: if (years || currentPage || categories || $locale) {
        getData();
    }
</script>

{#if news && news.length > 0}
    <div class="ep-slider__slide swiper-slide" {style}>
        <div class="ep-slider__news">
            <slot />
            <div class="ep-slider__news-content">
                <strong>{getNewsFormattedDate(news[0].newsDateLocal)}</strong>
                <h2>{news[0].headline}</h2>
                <a href={getNewsDetailPageLink(news[0], $locale)}>{$t('common.readMore')}</a>
            </div>
        </div>
    </div>
{:else if news && news.length === 0}
    <div class="ep-slider__slide swiper-slide">
        <p>{notFound}</p>
    </div>
{/if}
