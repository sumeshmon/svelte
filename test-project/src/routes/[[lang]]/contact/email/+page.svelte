<script lang="ts">
    import { t } from '$lib/translations';
    import ContactForm from '../components/ContactForm/ContactForm.svelte';
    import ConfirmSubscription from '../components/ConfirmSubscription/ConfirmSubscription.svelte';
    import { onMount } from 'svelte';
    import { contactFormUrlConfirmPrefix } from '$utils/contact-form/constants';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    let confirmSubscriptionEmail: string | null = null;
    let token: string | null = null;
    let confirmUrlPrefix = contactFormUrlConfirmPrefix;

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token');
        confirmSubscriptionEmail = urlParams.get('confirmSubscriptionEmail');
    });
</script>

<svelte:head>
    <title>{$t('head.sendMail.title')}</title>
    <meta name="description" content={$t('head.sendMail.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>

<div class="page">
    <Banner title={$t('head.sendMail.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <h1>Contact</h1>
            {#if token && confirmSubscriptionEmail}
                <ConfirmSubscription {token} {confirmSubscriptionEmail} {confirmUrlPrefix} />
            {:else}
                <ContactForm directSendMail={true} />
            {/if}
        </div>
    </div>
</div>
