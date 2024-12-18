<script lang="ts">
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import EventBoxWithTagAsTabs from '../components/EventBoxWithTagAsTabs.svelte';
    import { t } from '$lib/translations';
</script>

<svelte:head>
    <title>{$t('head.eventBox.title')}</title>
    <meta content={$t('head.eventBox.meta.description')} name="description" />
    <meta content="index, follow" name="robots" />
</svelte:head>
<div class="page event-box">
    <Banner title={$t('head.eventBox.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <h1>{$t('menu.event_tags_tabs')}</h1>
            <EventBoxWithTagAsTabs tags={['event2', '2025']} />
        </div>
    </div>
</div>
