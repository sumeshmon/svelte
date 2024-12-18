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
        <WebsiteContent slug="content_page_headline" />
        <WebsiteContent slug="content_page_1" />
        <WebsiteContent slug="content_page_2" />
    </div>
</div>
