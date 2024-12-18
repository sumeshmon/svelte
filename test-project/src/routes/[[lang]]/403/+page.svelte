<script>
    import Error from '../../+error.svelte';
    import Banner from '$components/Header/Banner.svelte';
    export let data;
</script>

<div class="page page-403">
    <Banner title="403" />
    <div class="page__content">
        <div class="container"><Error status={data.status} /></div>
    </div>
</div>
