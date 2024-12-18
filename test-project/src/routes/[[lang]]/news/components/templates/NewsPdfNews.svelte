<script lang="ts">
    import Table from '$components/Table.svelte';
    import type { NewsType } from '$utils/news/types';
    import {
        getNewsFormattedDate,
        getNewsDetailPageLink,
        getPdfNewsLink,
        getNewsCategoryName,
        getNewsSummary
    } from '$utils/news/ops';
    import { t, locale } from '$lib/translations';
    export let newsList: NewsType[] = [];
    export let showSummary: boolean = false;
    export const handleDetailViewClick = async (event: MouseEvent, item: NewsType) => {};
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
                    {#if getPdfNewsLink(news, $locale)}
                        <a target="_blank" href={getPdfNewsLink(news, $locale)}>{news.headline}</a>
                    {:else}
                        <a href={getNewsDetailPageLink(news, $locale)}>{news.headline}</a>
                    {/if}
                    {#if showSummary}
                        <div class="news__summary">
                            {@html getNewsSummary(news, 100)}
                        </div>
                    {/if}
                </td>
            </tr>
        {/each}
    </tbody>
</Table>
