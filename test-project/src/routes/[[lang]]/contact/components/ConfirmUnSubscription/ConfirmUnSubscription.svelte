<script lang="ts">
    import { onMount } from 'svelte';
    import { t } from '$lib/translations';
    import { validateUnSubscriptionToken } from '$utils/confirm-unsubscription/api';
    import { type FormStatus } from '$utils/forms/types';

    export let token: string;
    export let confirmUnSubscriptionEmail: string;
    export let status: FormStatus = 'initial';
    const unknownErrorMessage = `${$t('forms.generic.errors.unknown')}. ${$t(
        'generic.prompts.try_again'
    )}`;

    export let message = '';
    onMount(() => {
        if (!token && !confirmUnSubscriptionEmail) {
            return;
        }
        message = '';
        status = 'initial';
        validateUnSubscriptionToken(token)
            .then((success) => {
                if (success !== true) {
                    throw new Error(unknownErrorMessage);
                }
                status = 'success';
                message = $t('forms.confirm_unsubscription.successfully_unsubscribed');
            })
            .catch((e: unknown) => {
                const error = e as Error;
                status = 'failed';
                message = error.message || unknownErrorMessage;
            });
    });
    const goBackUrl = () => {
        window.location.reload();
    };
</script>

<div class="container">
    <div class="row">
        <div class="col-sm-12">
            {#if status === 'inprogress'}
                <p class="progress_message">{message}</p>
                <button class="btn" on:click={goBackUrl}
                    >{$t('forms.email_alert_form.buttons.back_button')}</button
                >
            {/if}
            {#if status === 'success'}
                <p class="success_message">{message}</p>
                <button class="btn" on:click={goBackUrl}
                    >{$t('forms.email_alert_form.buttons.back_button')}</button
                >
            {/if}
            {#if status === 'failed'}
                <p class="failed_message">{message}</p>
                <button class="btn" on:click={goBackUrl}
                    >{$t('forms.email_alert_form.buttons.back_button')}</button
                >
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    .progress_message,
    .failed_message,
    .success_message {
        margin: 0;
        padding: 0;
        width: 100%;
        font-weight: 100;
        color: #666;
    }
</style>
