<script>
    import { goto } from '$app/navigation';
    import { t } from '$lib/translations';
    import { onMount } from 'svelte';
    import Loader from '$components/Loader.svelte';

    export let data;

    onMount(async () => {
        if (data.redirectUrl) {
            goto(data.redirectUrl);
        }
    });
</script>

<svelte:head>
    <title>{$t('common.loading')}</title>
    <meta name="robots" content="index, follow" />
</svelte:head>

<div class="page">
    <div class="page__content">
        <div class="container">
            <Loader loader={true} animation={true} />
        </div>
    </div>
</div>
