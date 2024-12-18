<script lang="ts">
    import { t } from '$lib/translations';
    import DocumentsFlipBook from '$routes/documents/components/DocumentsFlipBook.svelte';
</script>

<svelte:head>
    <title>{$t('head.e-paper.title')} - {$t('common.companyName')}</title>
    <meta name="description" content={$t('head.e-paper.meta.description')} />
    <meta content="index, follow" name="robots" />
</svelte:head>

<div class="full-screen-wrapper">
    <div class="full-screen-wrapper__page">
        <DocumentsFlipBook category={['annual_reports']} tag={['flipbook']} />
    </div>
</div>

<style lang="scss">
    .full-screen-wrapper {
        position: fixed;
        top: 0;
        z-index: 999;
        right: 0;
        bottom: 0;
        left: 0;
        &__page {
            justify-content: center; /* Center content horizontally */
            align-items: center; /* Center content vertically */
            height: 100vh; /* Full viewport height */
            width: 100vw; /* Full viewport width */
            background: rgb(119, 119, 119); /* Background gradient */
            color: #fff;
            text-align: center;
            flex-direction: column;
        }
    }
</style>
