<script lang="ts">
    import { locale, t } from '$lib/translations';
    import CustomCompanyContactData from '$routes/custom-components/CustomCompanyContactData.svelte';
    
</script>

<svelte:head>
    <meta name="description" content={$t('head.contact.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>

<div class="container">
    <div class="row">
        <h2>Playing with company contact</h2>
        <CustomCompanyContactData/> 
    </div>
</div>

<style>
    .container{
        margin-top: 200px;
    }
</style>