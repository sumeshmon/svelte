<script lang="ts">
    import { t } from '$lib/translations';
    import FinancialDocument from '$routes/documents/fdl/components/FinancialDocument.svelte';
    import FinancialDocumentSlider from '$routes/documents/fdl/components/FinancialDocumentSlider.svelte';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>{$t('head.fdl.title')}</title>
    <meta name="description" content={$t('head.fdl.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>

<div class="page agm">
    <Banner title={$t('head.fdl.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="page__content">
            <div class="container">
                <section>
                    <h2>Financial Document</h2>
                    <!-- Fiscal year format mm-dd -->
                    <!-- Change categories order for display-->
                    <FinancialDocument
                        categories={[
                            'annual_report',
                            'proxy',
                            'presentation',
                            'release',
                            'supplement',
                            'financial_filings',
                            'transcript'
                        ]}
                        dateOrder="ASC"
                        fiscalYearBeginMD=""
                        fiscalYearEndMD=""
                        itemsPerYear="20"
                        noOfYears={10}
                        notFound={$t('documents.no_item_found')}
                        tags={['AR', 'PS', 'Q1', 'Q2', 'Q3', 'Q4']}
                    />
                </section>

                <section>
                    <h2>Financial Document Library Slider</h2>
                    <!-- Fiscal year format mm-dd -->
                    <!-- Change categories order for display-->
                    <FinancialDocumentSlider
                        categories={[
                            'annual_report',
                            'proxy',
                            'presentation',
                            'release',
                            'supplement',
                            'financial_filings',
                            'transcript'
                        ]}
                        dateOrder="ASC"
                        fiscalYearBeginMD=""
                        fiscalYearEndMD=""
                        itemsPerYear="200"
                        noOfYears={10}
                        notFound={$t('documents.no_item_found')}
                        tags={['AR', 'PS', 'Q1', 'Q2', 'Q3', 'Q4']}
                    />
                </section>
            </div>
        </div>
    </div>
</div>
