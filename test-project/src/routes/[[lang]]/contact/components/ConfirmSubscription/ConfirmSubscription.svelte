<script lang="ts">
    import { onMount } from 'svelte';
    import { t } from '$lib/translations';
    import { validateSubscriptionToken } from '$utils/confirm-subscription/api';
    import { type FormStatus } from '$utils/forms/types';

    export let token: string;
    export let confirmSubscriptionEmail: string;

    export let confirmUrlPrefix: string;
    export let status: FormStatus = 'initial';
    const unknownErrorMessage = `${$t('forms.generic.errors.unknown')}. ${$t(
        'forms.generic.prompts.try_again'
    )}`;

    export let message = '';
    onMount(() => {
        if (!token && !confirmSubscriptionEmail) {
            return;
        }
        message = '';
        status = 'initial';
        validateSubscriptionToken(token, confirmUrlPrefix)
            .then((success) => {
                if (success !== true) {
                    throw new Error(unknownErrorMessage);
                }
                status = 'success';
                message = $t('forms.confirm_subscription.successfully_subscribed');
            })
            .catch((e: unknown) => {
                const error = e as Error;
                status = 'failed';
                message = error.message || unknownErrorMessage;
            });
    });
</script>

<div>
    {#if status == 'inprogress'}
        <h4>
            {$t('forms.confirm_subscription.statuses.confirmation_inprogress')} ...
        </h4>
        <p>{message}</p>
    {/if}
    {#if status == 'success'}
        <h4>{$t('forms.confirm_subscription.statuses.confirmation_successful')}</h4>
        <p>{message}</p>
    {/if}
    {#if status == 'failed'}
        <h4>{$t('forms.confirm_subscription.statuses.confirmation_failed')}</h4>
        <p>{message}</p>
    {/if}
</div>

<style>
</style>
