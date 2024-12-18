<script lang="ts">
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { t } from '$lib/translations';
    import { page } from '$app/stores';
    import FactsFigures from '$routes/facts-and-figures/components/FactsFigures.svelte';
    import Glossary from '$routes/facts-and-figures/components/templates/FactsFiguresGlossary.svelte';
    export let template: typeof Glossary = Glossary;
</script>

<svelte:head>
    <title>{$t('head.factsFigures.title')}</title>
    <meta name="description" content={$t('head.factsFigures.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>
<div class="page">
    <Banner />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <div class="row">
                <div class="col col-sm-12">
                    <section>
                        <FactsFigures
                            {template}
                            slug="glossary"
                            notFound={$t('facts.noFactsFigures')}
                        />
                    </section>
                </div>
            </div>
        </div>
    </div>
</div>
