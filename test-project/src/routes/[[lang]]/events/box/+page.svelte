<script lang="ts">
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import EventBox from '../components/EventBox.svelte';
    import { t } from '$lib/translations';
</script>

<svelte:head>
    <title>{$t('head.eventBox.title')}</title>
    <meta name="description" content={$t('head.eventBox.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>
<div class="page event-box">
    <Banner title={$t('head.eventBox.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <h1>{$t('head.eventBox.title')}</h1>
            <EventBox
                noOfYears={3}
                archive={true}
                archiveTill="2023"
                itemsPerPage="100"
                yearSelector="tabs"
                showAllYears={true}
                boxCategories={[
                    ['annual_reports', 'quarterly_reports'],
                    'presentations',
                    'factsheets',
                    'consensus',
                    'webcasts',
                    'GeneralizedNews'
                ]}
                paginatorType={false}
            />
        </div>
    </div>
</div>
