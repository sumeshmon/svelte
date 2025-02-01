<script lang="ts">
    import { locale, t } from '$lib/translations';
    import CustomCompanyProfile from '$routes/custom-components/CustomCompanyProfile.svelte';
    
</script>

<svelte:head>
    <title>{$t('head.contact.title')}</title>
    <meta name="description" content={$t('head.contact.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>

<div class="container">
    <div class="row">
        <h2>Playing with company profile</h2>
        <CustomCompanyProfile/>
    </div>
</div>

<style>
    .container{
        margin-top: 200px;
    }
</style>