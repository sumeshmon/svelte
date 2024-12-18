<script lang="ts">
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import Accordion, { createAccordionContext } from '$components/Accordion.svelte';
    createAccordionContext();
    import DocumentsList from '$routes/documents/components/DocumentsList.svelte';
    import TeaserTemplate from '$routes/documents/components/templates/DocumentsTeaser.svelte';
    import VideoTeaserTemplate from '$routes/documents/components/templates/DocumentsVideoTeaser.svelte';
    import YearsAsAccordionTemplate from '$routes/documents/components/templates/DocumentsYearsAsAccordion.svelte';
</script>

<svelte:head>
    <title>Documents</title>
    <meta content="Examples Documents" name="description" />
    <meta content="index, follow" name="robots" />
</svelte:head>
<div class="page">
    <Banner />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <section>
                <h2>Year As Accordion title</h2>
                <DocumentsList
                    itemsPerPage="100"
                    paginatorType={false}
                    template={YearsAsAccordionTemplate}
                />
            </section>
            <section>
                <h2>Accordions for TITLE, TEXT and dynamic document list</h2>
                <Accordion>
                    <span slot="title">Test 1</span>
                    <div slot="content">
                        <strong>Lorem Ipsum</strong> is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the industry's standard dummy
                        text ever since the 1500s, when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book.
                        <br />
                        <DocumentsList
                            itemsPerPage="1"
                            categories={['annual_reports']}
                            years={['2021']}
                            paginatorType={false}
                            template={TeaserTemplate}
                        />
                        <br />
                    </div>
                </Accordion>
                <Accordion>
                    <span slot="title">Test 2</span>
                    <div slot="content">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the
                        1500s, when an unknown printer took a galley of type and scrambled it to
                        make a type specimen book.
                        <br />
                        <DocumentsList
                            itemsPerPage="1"
                            years={['2021']}
                            paginatorType={false}
                            template={TeaserTemplate}
                        />
                        <br />
                    </div>
                </Accordion>
                <Accordion>
                    <span slot="title">Test 3</span>
                    <div slot="content">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the
                        1500s, when an unknown printer took a galley of type and scrambled it to
                        make a type specimen book.
                    </div>
                </Accordion>
                <Accordion>
                    <span slot="title">Test 4</span>
                    <div slot="content">
                        <DocumentsList
                            itemsPerPage="1"
                            categories={['annual_reports']}
                            paginatorType={false}
                            template={TeaserTemplate}
                        />
                        <br />
                    </div>
                </Accordion>
            </section>

            <section>
                <h2>Embedded video listing</h2>
                <DocumentsList
                    itemsPerPage="2"
                    categories={['video_embed']}
                    paginatorType={false}
                    template={VideoTeaserTemplate}
                />
                <DocumentsList
                    itemsPerPage="1"
                    categories={['video_embed']}
                    paginatorType={false}
                    yearSelector="tabs"
                    archive={true}
                    template={VideoTeaserTemplate}
                />
            </section>
        </div>
    </div>
</div>
