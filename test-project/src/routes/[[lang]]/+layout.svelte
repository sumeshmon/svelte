<script lang="ts">
    import Header from './Header.svelte';
    import Footer from './Footer.svelte';
    import GoogleAnalytics from '$components/analytics/GoogleAnalytics.svelte';
    import ETrackerAnalytics from '$components/analytics/ETrackerAnalytics.svelte';
</script>

<GoogleAnalytics />
<ETrackerAnalytics />

<Header />

<main>
    <slot />
</main>

<Footer />

<style lang="en">
    @import '$lib/main.scss';
</style>
