<script>
    import WebsiteContent from '$components/WebsiteContent.svelte';
</script>

<svelte:head>
    <title>Content Page</title>
    <meta content="Content Page" name="description" />
    <meta content="index, follow" name="robots" />
</svelte:head>

<div class="container">
    <div class="page content_wrapper">
        <h1>Test</h1>
        <WebsiteContent slug="csteam_test" />
    </div>
</div>
