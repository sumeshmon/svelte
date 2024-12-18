<script>
    import { t } from '$lib/translations';
    import { page } from '$app/stores';

    export let status = $page.status;
</script>

<svelte:head>
    <title>{$t(`error.${status}.head_title`)}</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="row">
    <div class="alert">
        <div class="page-header">
            <h1>{$t(`error.${status}.page_title`)}</h1>
        </div>

        {@html $t(`error.${status}.page_description`)}
    </div>
</div>
