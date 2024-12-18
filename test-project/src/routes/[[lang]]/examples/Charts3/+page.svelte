<script lang="ts">
    import { t } from '$lib/translations/index.js';
    import ShareChart3 from '$components/ShareChart3.svelte';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
</script>

<div class="page">
    <Banner />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <ShareChart3 chartId="charts3" chartLink={$t('common.shareChart3Link')} />
        </div>
    </div>
</div>
