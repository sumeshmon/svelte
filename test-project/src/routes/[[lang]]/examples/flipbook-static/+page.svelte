<script lang="ts">
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import { t, locale } from '$lib/translations';
    import FlipBook from '$components/FlipBook.svelte';

    /*
    The dearflip documentation
        https://jquery.dearflip.com/docs/examples/
        based on documentation can handle controls position and all
        example: df-controls-top
    */

    let pdfUrl: string = '';

    const loadStaticFlipBook = () => {
        if ($locale == 'de') {
            pdfUrl =
                '/media/document/9421d954-d450-45cc-ae62-aad424dfb4ac/assets/soon.pdf?disposition=inline';
        } else {
            pdfUrl = 'https://js.dearflip.com/wp-content/uploads/2023/07/Lifestyle-Magazine.pdf';
        }
    };

    $: if ($locale) {
        loadStaticFlipBook();
    }
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
                <h1>{$t('head.flipBook.title')} Static URL ({$locale})</h1>
                <FlipBook {pdfUrl} />
            </section>
        </div>
    </div>
</div>
