<script lang="ts">
    import { t } from '$lib/translations';
    import DocumentsList from '$routes/documents/components/DocumentsList.svelte';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import ImageTeaserTemplate from '$routes/documents/components/templates/DocumentsImageTeaser.svelte';
    import TeaserTemplate from '$routes/documents/components/templates/DocumentsTeaser.svelte';
</script>

<svelte:head>
    <title>{$t('head.documents.title')}</title>
    <meta name="description" content={$t('head.documents.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>

<div class="page documents">
    <Banner page="documents" title={$t('head.documents.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <section>
                <h2>{$t('documents.simple_teaser')}</h2>
                <DocumentsList
                    itemsPerPage="1"
                    categories={['corporate_governance', 'annual_reports', 'presentations']}
                    years={['2021']}
                    notFound={$t('documents.no_item_found')}
                    paginatorType={false}
                    template={TeaserTemplate}
                />
            </section>

            <section>
                <h2>{$t('documents.teaser_listing_thumbnail')}</h2>
                <DocumentsList
                    itemsPerPage="3"
                    categories={['corporate_governance', 'annual_reports', 'presentations']}
                    notFound={$t('documents.no_item_found')}
                    paginatorType={false}
                    template={ImageTeaserTemplate}
                />
            </section>

            <section>
                <h2>Standard Listing; Multiple Category</h2>
                <DocumentsList
                    itemsPerPage="3"
                    categories={[
                        'presentations',
                        'test_document_list_presentations',
                        'test_document_list'
                    ]}
                    notFound={$t('documents.no_item_found')}
                />
            </section>

            <section>
                <h2>{$t('documents.documentListingByCategory')}</h2>
                <DocumentsList
                    itemsPerPage="3"
                    categories={[
                        'presentations',
                        'test_document_list_presentations',
                        'test_document_list'
                    ]}
                    groupBy="category"
                    notFound={$t('documents.no_item_found')}
                />
            </section>

            <section>
                <h2>{$t('documents.documentListingByCategoryTag')}</h2>

                <DocumentsList
                    itemsPerPage="3"
                    categories={[
                        'presentations',
                        'test_document_list_presentations',
                        'test_document_list'
                    ]}
                    tags={['tag5', 'tag2', 'tag1']}
                    groupBy="category&tags"
                    notFound={$t('documents.no_item_found')}
                />
            </section>

            <section>
                <h2>Document Year Tab Listing; Group by Category</h2>
                <!-- The 'activeYear' prop is optional; it is useful for displaying the current year as active, especially when there are future year tabs. -->
                <DocumentsList
                    itemsPerPage="5"
                    activeYear="currentYear"
                    notFound={$t('documents.no_item_found')}
                    yearSelector="tabs"
                    categories={[
                        'presentations',
                        'test_document_list_presentations',
                        'test_document_list'
                    ]}
                    groupBy="category"
                />
            </section>

            <section>
                <h2>
                    Document Year Tab Listing; Group by category and Tags as sub headline; with
                    Archive
                </h2>
                <DocumentsList
                    itemsPerPage="5"
                    noOfYears={2}
                    archive={true}
                    notFound={$t('documents.no_item_found')}
                    yearSelector="tabs"
                    groupBy="category&tags"
                    categories={[
                        'presentations',
                        'test_document_list_presentations',
                        'test_document_list'
                    ]}
                    tags={['tag5', 'tag2', 'tag1']}
                />
            </section>

            <section>
                <h2>Document Year dropdown Listing</h2>

                <DocumentsList
                    itemsPerPage="1"
                    notFound={$t('documents.no_item_found')}
                    yearSelector="dropDown"
                />
            </section>

            <section>
                <h2>Document tab With fiscal year settings</h2>
                <!-- Fiscal year format mm-dd -->
                <DocumentsList
                    itemsPerPage="5"
                    notFound={$t('documents.no_item_found')}
                    noOfYears={3}
                    archive={true}
                    fiscalYearBeginMD="04-01"
                    fiscalYearEndMD="03-31"
                    yearSelector="tabs"
                />
            </section>

            <section>
                <h2>Document list with Categories and Years</h2>
                <DocumentsList
                    itemsPerPage="5"
                    notFound={$t('documents.no_item_found')}
                    noOfYears={5}
                    archive={false}
                    yearSelector="tabs"
                    categorySelector="tabs"
                    showAllCategory={true}
                />
            </section>
        </div>
    </div>
</div>
