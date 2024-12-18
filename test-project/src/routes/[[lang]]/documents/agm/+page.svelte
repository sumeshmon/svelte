<script lang="ts">
    import { t } from '$lib/translations';
    import Agm from './components/Agm.svelte';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>{$t('head.agm.title')}</title>
    <meta name="description" content={$t('head.agm.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>

<div class="page agm">
    <Banner title={$t('head.agm.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="page__content">
            <div class="container">
                <section>
                    <h2>AGM</h2>
                    <Agm notFound={$t('documents.no_item_found')} />
                </section>
                <hr />
                <section>
                    <h2>Years As Accordion Title</h2>
                    <Agm
                        yearSelector="accordion"
                        archive={true}
                        noOfYears={5}
                        notFound={$t('documents.no_item_found')}
                    />
                </section>
            </div>
        </div>
    </div>
</div>
