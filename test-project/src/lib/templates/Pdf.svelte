<script lang="ts">
    import { locale } from '$lib/translations';
    import { getNewsFormattedDate, getNewsSummary, getNewsCategoryName } from '$utils/news/ops';
    import { base } from '$app/paths';

    export let itemData: any;
</script>

<div class="show-element-for-pdf container generated-pdf__container">
    <div class="generated-pdf__header">
        <div class="nav-bar__logo">
            <img src="{base}/images/master-template.png" alt="Company Name" />
        </div>
    </div>
    <div class="generated-pdf__body">
        {#if itemData.newsDateLocal}
            <div class="news-detail__date">
                {getNewsFormattedDate(itemData.newsDateLocal) || ''}
            </div>
        {/if}

        {#if itemData.category}
            <div class="news-detail__category">{getNewsCategoryName(itemData) || ''}</div>
        {/if}

        {#if itemData.headline[$locale]}
            <h1 class="news-detail__headline">
                {@html itemData.headline && $locale ? itemData.headline[$locale] : ''}
            </h1>
        {/if}

        {#if itemData.summary[$locale]}
            <div class="news-detail__summary">{@html getNewsSummary(itemData, 100) || ''}</div>
        {/if}

        {#if itemData.content[$locale]}
            <div class="news-detail__content">
                {@html itemData.content && $locale ? itemData.content[$locale] : ''}
            </div>
        {/if}
    </div>
    <div class="generated-pdf__footer" />
</div>
