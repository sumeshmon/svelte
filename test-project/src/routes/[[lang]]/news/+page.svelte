<script>
    import { t } from '$lib/translations';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import NewsList from './components/NewsList.svelte';
    import ImageTeaserTemplate from '$routes/news/components/templates/NewsImageTeaser.svelte';
    import PdfNewsTemplate from '$routes/news/components/templates/NewsPdfNews.svelte';
    import PvrDdTableTemplate from '$routes/news/components/templates/NewsPvrDdTable.svelte';
</script>

<svelte:head>
    <title>{$t('head.news.title')}</title>
    <meta name="description" content={$t('head.news.meta.description')} />
    <meta content="index, follow" name="robots" />
</svelte:head>

<div class="page news">
    <Banner page="news" title={$t('head.news.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <section>
                <h2>Standard Listing; All Category</h2>
                <NewsList itemsPerPage="3" isLandingPage={true} />
            </section>
            <hr />
            <section>
                <h2>Standard Listing; All Category (Cockpit News only)</h2>
                <NewsList
                    itemsPerPage="3"
                    isLandingPage={true}
                    newsTypes={['cockpit_news']}
                    showPdf={true}
                />
            </section>
            <hr />
            <section>
                <h2>Standard Listing; with Summary</h2>
                <NewsList showSummary={true} itemsPerPage="3" />
            </section>
            <hr />
            <section>
                <h2>
                    Standard Listing; PDF News template
                    <small
                        >If there is a PDF (sent via Cockpit), it links to the PDF. If there is no
                        PDF, then it links to the news detail.</small
                    >
                </h2>
                <NewsList itemsPerPage="5" template={PdfNewsTemplate} />
            </section>
            <hr />
            <section>
                <h2>
                    Standard Listing; Given Categories
                    <small>Given Categories: AFR, PVR</small>
                </h2>

                <NewsList categories={['AFR', 'PVR']} itemsPerPage="3" />
            </section>
            <hr />
            <section>
                <h2>
                    News List group by Given categories as subtitle
                    <small>Given Categories: AFR, PVR</small>
                </h2>
                <NewsList itemsPerPage="5" groupBy="category" categories={['AFR', 'PVR']} />
            </section>
            <hr />
            <section>
                <h2>Teaser</h2>
                <NewsList showSummary={true} template={ImageTeaserTemplate} itemsPerPage="3" />
            </section>
            <hr />
            <section>
                <h2>News Year Tab Listing</h2>
                <NewsList itemsPerPage="5" yearSelector="tabs" />
            </section>
            <hr />
            <section>
                <h2>
                    News Year Tab Listing; Show archive after 3 tabs (Current year as active tab)
                </h2>
                <!-- The 'activeYear' prop is optional; it is useful for displaying the current year as active, especially when there are future year tabs. -->
                <NewsList
                    activeYear="currentYear"
                    itemsPerPage="5"
                    yearSelector="tabs"
                    archive={true}
                    noOfYears={3}
                />
            </section>
            <hr />
            <section>
                <h2>News Category tab Listing</h2>
                <NewsList categorySelector="tabs" itemsPerPage="5" />
            </section>
            <hr />
            <section>
                <h2>News List By Categories and sub group by years</h2>
                <NewsList categorySelector="tabs" itemsPerPage="5" yearSelector="tabs" />
            </section>
            <hr />
            <section>
                <h2>News List By Years and sub group by given categories</h2>
                <NewsList
                    itemsPerPage="5"
                    categorySelector="tabs"
                    yearSelector="tabs"
                    groupBy="year"
                    categories={['AFR', 'PVR']}
                />
            </section>
            <hr />
            <section>
                <h2>News List With Search</h2>
                <NewsList
                    itemsPerPage="5"
                    categorySelector="dropDown"
                    yearSelector="dropDown"
                    showDateSelector={true}
                    showLimitSelector={true}
                    showAllCategory={true}
                    showAllYears={true}
                    showSearch={true}
                />
            </section>
            <hr />
            <section>
                <h2>
                    Mixed News
                    <small
                        >If the client is publishing news in only one language, then the news will
                        be shown regardless of the current website language.</small
                    >
                </h2>
                <NewsList itemsPerPage="5" yearSelector="tabs" mixedLanguage={true} />
            </section>
            <hr />
            <section>
                <h2>News List With Voting Rights and DD Table</h2>
                <NewsList
                    itemsPerPage="5"
                    template={PvrDdTableTemplate}
                    yearSelector="tabs"
                    categories={['DD', 'PVR']}
                />
            </section>
            <hr />
            <section>
                <h2>Standard Listing; with detail view popup</h2>
                <NewsList
                    itemsPerPage="3"
                    isLandingPage={true}
                    showDetailViewModal={true}
                    newsTypes={['cockpit_news']}
                />
            </section>
        </div>
    </div>
</div>
