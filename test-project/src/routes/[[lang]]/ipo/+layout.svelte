<script lang="ts">
    import DisclaimerManager from '$components/disclaimer/DisclaimerManager.svelte';
    import { DISCLAIMERS } from '$components/disclaimer/constants';
    import { t } from '$lib/translations';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>{$t('head.ipo.title')}</title>
    <meta name="description" content={$t('head.ipo.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>
<div class="page ipo">
    <Banner title={$t('head.ipo.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <DisclaimerManager disclaimer={DISCLAIMERS.IPO}>
                <slot />
            </DisclaimerManager>
        </div>
    </div>
</div>
