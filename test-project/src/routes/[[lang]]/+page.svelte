<script lang="ts">
    import { t } from '$lib/translations';
    import WebsiteContent from '$components/WebsiteContent.svelte';
    import Banner from '$components/Header/Banner.svelte';
    import Header from './Header.svelte';
</script>

<svelte:head>
    <title>{$t('head.home.title')}</title>
    <meta content={$t('head.home.meta.description')} name="description" />
    <meta content="index, follow" name="robots" />
</svelte:head>

<div class="page home">
    <Banner page="home" />
    <div class="page__content">
        <div class="container pb-1"><p>some static test content</p></div>
        <div class="container pb-1">
            <WebsiteContent slug="home_page" />
            <WebsiteContent slug="home_content_2" />
        </div>
    </div>
</div>
