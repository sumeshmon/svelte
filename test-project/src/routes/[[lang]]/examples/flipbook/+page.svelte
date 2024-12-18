<script lang="ts">
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import { t, locale } from '$lib/translations';
    import DocumentsFlipBook from '$routes/documents/components/DocumentsFlipBook.svelte';
</script>

<svelte:head>
    <title>{$t('head.flipBook.title')}</title>
    <meta name="description" content={$t('head.flipBook.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>
<div class="page documents">
    <Banner title={$t('head.flipBook.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <section>
                <h1>{$t('head.flipBook.title')} Dynamic URL from Documents ({$locale})</h1>
                <DocumentsFlipBook category={['annual_reports']} tag={['flipbook']} />
            </section>
        </div>
    </div>
</div>
