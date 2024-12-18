<script lang="ts">
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import CompanyContactData from '$routes/examples/company-contact/components/CompanyContactData.svelte';
</script>

<svelte:head>
    <title>Company Info</title>
    <meta content="Company Contact Data" name="description" />
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
                        <h2 class="mb-5">Company Contact Data</h2>
                        <CompanyContactData />
                    </section>
                </div>
            </div>
        </div>
    </div>
</div>
