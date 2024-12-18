<script lang="ts">
    import Table from '$components/Table.svelte';
    import type { NewsType } from '$utils/news/types';
    import {
        getNewsFormattedDate,
        getNewsDetailPageLink,
        getNewsSummary,
        getNewsCategoryName
    } from '$utils/news/ops';
    import { t } from '$lib/translations';
    import PdfGenerator from '$components/PdfGenerator.svelte';
    import Modal from '$components/Modal.svelte';
    import { fetchNewsDetail } from '$utils/news/api';
    import { locale } from '$lib/translations/index.js';
    import { goto } from '$app/navigation';

    export let newsList: NewsType[] = [];
    export let showSummary: boolean = false;
    export let showDetailViewModal: boolean = false;
    export let showPdf: boolean = false;
    let linkClicked: boolean = false;
    let showModal: boolean = false;
    let newsDetail: any;

    export const handleDetailViewClick = async (event: MouseEvent, item: NewsType) => {
        if (item.typeKey === 'hk_news') {
            return;
        }
        event.preventDefault();
        const target = event.target as HTMLAnchorElement;
        let link: string | null = target.href;
        if (target.tagName !== 'A' && target?.parentElement?.tagName === 'A') {
            const anchor = target.parentElement as HTMLAnchorElement;
            link = anchor.href;
        }
        if (link) {
            linkClicked = true;
        }
        if (showDetailViewModal) {
            newsDetail = await fetchNewsDetail(item.id);
        }
        if (!showDetailViewModal) {
            goto(link);
        }
    };

    $: if (!showModal) {
        showModal = showDetailViewModal;
        linkClicked = false;
    }
</script>

<Table>
    <thead slot="thead">
        <tr>
            <th class="w-25">{$t('news.date')}</th>
            <th class="w-75">{$t('news.title')}</th>
        </tr>
    </thead>
    <tbody>
        {#each newsList as news}
            <tr>
                <td>{getNewsFormattedDate(news.newsDateLocal)}</td>
                <td>
                    {#if news?.category.length > 0}
                        {getNewsCategoryName(news)} |
                    {/if}
                    <a
                        href={getNewsDetailPageLink(news, news.language)}
                        class="news-detail-link"
                        target={news.typeKey === 'hk_news' ? '_blank' : '_self'}
                        data-news-id={news.id}
                        on:click={(event) => handleDetailViewClick(event, news)}>{news.headline}</a
                    >
                    {#if showSummary}
                        <div class="news__summary">
                            {@html getNewsSummary(news, 100)}
                        </div>
                    {/if}
                    {#if showPdf}
                        <PdfGenerator
                            id="detail-to-pdf-{news.id}"
                            item={news.id}
                            disposition="inline"
                        />
                    {/if}
                </td>
            </tr>
        {/each}
    </tbody>
</Table>

{#if showModal && linkClicked}
    <Modal bind:showModal cssClass="news-detail-modal">
        <div slot="closeButton" class="news-detail-modal__close">
            <button
                class={`news-detail-modal--btn btn btn-outline-secondary`}
                on:click={() => (showModal = false)}
            >
                <i class="icon-master-close" />
            </button>
        </div>
        {#if newsDetail}
            {#if newsDetail.id}
                <PdfGenerator
                    id="detail-to-pdf-{newsDetail.id}"
                    item={newsDetail.id}
                    disposition={null}
                />
            {/if}
            {#if newsDetail.headline}
                <h1 class="news-detail__headline">{newsDetail.headline[$locale]}</h1>
            {/if}
            {#if newsDetail.newsDateLocal}
                <p class="news-detail__date">
                    <strong>{getNewsFormattedDate(newsDetail.newsDateLocal)}</strong>
                </p>
            {/if}
            {#if newsDetail.content[$locale]}
                <div class="news-detail__content mb-3">
                    {@html newsDetail.content[$locale]}
                </div>
            {/if}
        {/if}
    </Modal>
{/if}
