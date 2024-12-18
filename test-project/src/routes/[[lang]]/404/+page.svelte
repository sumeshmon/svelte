<script>
    import Error from '../../+error.svelte';
    import Banner from '$components/Header/Banner.svelte';
    export let data;
</script>

<div class="page page-404">
    <Banner title="404" />
    <div class="page__content">
        <div class="container"><Error status={data.status} /></div>
    </div>
</div>
