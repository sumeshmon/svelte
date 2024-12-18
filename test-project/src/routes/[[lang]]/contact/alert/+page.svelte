<script lang="ts">
    import ConfirmSubscription from '../components/ConfirmSubscription/ConfirmSubscription.svelte';
    import ConfirmUnSubscription from '../components/ConfirmUnSubscription/ConfirmUnSubscription.svelte';
    import EmailAlertSubscribeForm from '../components/EmailAlertForm/EmailAlertSubscribeForm.svelte';
    import EmailAlertUnSubscribeForm from '../components/EmailAlertForm/EmailAlertUnSubscribeForm.svelte';
    import EmailAlertUpdatePreferenceSubscribeForm from '../components/EmailAlertForm/EmailAlertUpdatePreferenceSubscribeForm.svelte';
    import { onMount } from 'svelte';
    import { alertConfirmUrlPrefix } from '$utils/email-alert/constants';
    import { locale, t } from '$lib/translations';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    let token: string | null = null;
    let confirmSubscriptionEmail: string | null = null;
    let confirmUnSubscriptionEmail: string | null = null;
    let updatePreferenceActive: string | null = null;
    let confirmUrlPrefix = alertConfirmUrlPrefix;

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token');
        confirmSubscriptionEmail = urlParams.get('confirmSubscriptionEmail');
        confirmUnSubscriptionEmail = urlParams.get('confirmUnSubscriptionEmail');
        updatePreferenceActive = urlParams.get('updatePreferenceActive');
    });

    $: if ($locale) {
        token = null;
        confirmSubscriptionEmail = null;
        updatePreferenceActive = null;
        confirmUnSubscriptionEmail = null;
    }
</script>

<svelte:head>
    <title>{$t('head.emailAlert.title')}</title>
    <meta name="description" content={$t('head.emailAlert.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>

<div class="page">
    <Banner title={$t('head.emailAlert.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            {#if token && confirmSubscriptionEmail}
                <ConfirmSubscription {token} {confirmSubscriptionEmail} {confirmUrlPrefix} />
            {:else if token && confirmUnSubscriptionEmail}
                <ConfirmUnSubscription {token} {confirmUnSubscriptionEmail} />
            {:else if token && updatePreferenceActive}
                <EmailAlertUpdatePreferenceSubscribeForm {token} {updatePreferenceActive} />
            {:else}
                <EmailAlertSubscribeForm />
                <div class="mb-5" />
                <EmailAlertUnSubscribeForm />
            {/if}
        </div>
    </div>
</div>
