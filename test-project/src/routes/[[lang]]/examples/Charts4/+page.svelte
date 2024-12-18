<script>
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import { locale } from '$lib/translations';
</script>

<div class="page">
    <Banner />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <script
                id="eqs-cms-irtools-stock-chart-script"
                defer
                src="https://ir-api.eqs.com/storage/ir/a7afba/tools/4a1d5dca-7881-4367-a888-c68162e0fe46/index.js"
            ></script>
            <div id="eqs-cms-irtools-stock-chart" data-chart-lang={$locale} />
        </div>
    </div>
</div>
