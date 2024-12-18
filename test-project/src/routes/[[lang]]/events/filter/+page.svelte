<script lang="ts">
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import { t } from '$lib/translations';
    import EventsList from '$routes/events/components/EventsList.svelte';
    import { SelectorValues } from '$utils/constants';
</script>

<svelte:head>
    <title>{$t('head.eventFilter.title')}</title>
    <meta name="description" content={$t('head.eventFilter.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>
<div class="page documents">
    <Banner title={$t('head.eventFilter.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <h1>Event Filter</h1>
            <section class="container">
                <section>
                    <EventsList
                        itemsPerPage="50"
                        paginatorType={false}
                        categorySelector={SelectorValues.Selectric}
                        yearSelector={SelectorValues.Selectric}
                        monthSelector={SelectorValues.Selectric}
                        showAllCategory={true}
                        showAllYears={true}
                        showAllMonths={true}
                    />
                </section>
            </section>
        </div>
    </div>
</div>
