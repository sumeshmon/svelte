<script lang="ts">
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>Banner</title>
    <meta content="Examples Banner" name="description" />
    <meta content="index, follow" name="robots" />
</svelte:head>
<div class="page">
    <Banner page="slider-demo" />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <section>
                <h2>
                    Banner with static slide, Video with Dynamic document, Youtube, Dynamic news
                </h2>
            </section>
        </div>
    </div>
</div>
