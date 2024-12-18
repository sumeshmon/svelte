<script lang="ts">
    import ConfirmSubscription from '../components/ConfirmSubscription/ConfirmSubscription.svelte';
    import EventReminderForm from '../components/EventReminderForm/EventReminderForm.svelte';
    import { onMount } from 'svelte';
    import { alertConfirmUrlPrefix } from '$utils/email-alert/constants';
    import { locale, t } from '$lib/translations';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    let token: string | null = null;
    let confirmSubscriptionEmail: string | null = null;
    let confirmUrlPrefix = alertConfirmUrlPrefix;

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token');
        confirmSubscriptionEmail = urlParams.get('confirmSubscriptionEmail');
    });

    $: if ($locale) {
        token = null;
        confirmSubscriptionEmail = null;
    }
</script>

<svelte:head>
    <title>{$t('head.eventReminder.title')}</title>
    <meta name="description" content={$t('head.eventReminder.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>
<div class="text-column">
    <h1>Email Reminder</h1>
</div>
<div class="page">
    <Banner title={$t('head.eventReminder.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            {#if token && confirmSubscriptionEmail}
                <ConfirmSubscription {token} {confirmSubscriptionEmail} {confirmUrlPrefix} />
            {:else}
                <EventReminderForm />
            {/if}
        </div>
    </div>
</div>
