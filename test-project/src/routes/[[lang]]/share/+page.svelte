<script>
    import { t } from '$lib/translations';
    import CompanyProfile from '$routes/share/components/CompanyProfile.svelte';
    import ShareholderStructure from './components/ShareholderStructure.svelte';
    import StockInfo from '$routes/share/components/StockInfo.svelte';
    import CompanyFundamentals from '$routes/share/components/CompanyFundamentals.svelte';
    import IpoData from '$routes/share/components/IpoData.svelte';
    import CombinedCompanyData from '$routes/share/components/CombinedCompanyData.svelte';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>{$t('head.share.title')}</title>
    <meta name="description" content={$t('head.share.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>

<div class="page share">
    <Banner title={$t('head.share.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <section>
                <h2>{$t('share.companyProfileTitle')}</h2>
                <CompanyProfile />
            </section>

            <section>
                <h2>{$t('share.shareholderStructureTitle')}</h2>
                <ShareholderStructure type="chart" category="Category2" />
            </section>

            <section>
                <h2>{$t('share.shareholderStructureWithTable')}</h2>
                <ShareholderStructure type="chart&table" category="Shareholders" />
            </section>

            <section>
                <h2>{$t('share.shareholderStructureAsTable')}</h2>
                <ShareholderStructure
                    type="table"
                    footnote={false}
                    lastUpdatedDate={false}
                    category="custom_category1"
                />
            </section>

            <section>
                <h2>{$t('share.stockInfoTitle')}</h2>
                <StockInfo />
            </section>

            <section>
                <h2>{$t('share.companyFundamentalsTitle')}</h2>
                <CompanyFundamentals />
            </section>

            <section>
                <h2>{$t('share.ipoDataTitle')}</h2>
                <IpoData />
            </section>
            <section>
                <h2>{$t('share.combinedCompanyData.title')}</h2>
                <CombinedCompanyData />
            </section>
        </div>
    </div>
</div>
