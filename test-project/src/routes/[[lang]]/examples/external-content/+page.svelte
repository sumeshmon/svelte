<script lang="ts">
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import ExternalContent from './components/ExternalContent.svelte';
</script>

<svelte:head>
    <title>External Content</title>
    <meta content="Examples External Content" name="description" />
    <meta content="index, follow" name="robots" />
</svelte:head>
<div class="page">
    <Banner />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <div class="row">
                <div class="col col-sm-12">
                    <section>
                        <h2 class="mb-5">
                            External Content (HTML)
                            <small
                                >Show data from external HTML (Add feed url in CMS-> Website
                                Content-> External Content)
                            </small>
                        </h2>
                        <ExternalContent slug="investora_feed" />
                    </section>
                </div>
                <div class="col col-sm-6">
                    <section>
                        <h2 class="mb-5">
                            External Content (JSON)
                            <small
                                >Show data from external feed (Add feed url in CMS-> Website
                                Content-> External Content)
                            </small>
                        </h2>
                        <ExternalContent slug="chartjson" />
                    </section>
                </div>
                <div class="col col-sm-6">
                    <section>
                        <h2 class="mb-5">
                            External Content (XML)
                            <small
                                >Show data from external feed (Add feed url in CMS-> Website
                                Content-> External Content)
                            </small>
                        </h2>
                        <ExternalContent slug="test_xml_news" targetNode="news" />
                    </section>
                </div>
            </div>
        </div>
    </div>
</div>
