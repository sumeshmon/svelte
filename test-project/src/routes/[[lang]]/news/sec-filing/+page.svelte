<script lang="ts">
    import { t } from '$lib/translations';
    import SecFilingList from './components/SecFilingList.svelte';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import { DateSortOrderType } from '$utils/constants';
</script>

<svelte:head>
    <title>{$t('head.secFiling.title')}</title>
    <meta name="description" content={$t('head.secFiling.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>
<div class="page news">
    <Banner title={$t('head.secFiling.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <div class="sec-filing-wrapper">
                <h1>{$t('secFiling.title')}</h1>
                <SecFilingList
                    numberOfPaginationLinks="5"
                    sortOrder={DateSortOrderType.DESC}
                    itemsPerPage="5"
                    notFound={$t('secFiling.no_item_found')}
                    tickers=""
                />
            </div>
        </div>
    </div>
</div>
