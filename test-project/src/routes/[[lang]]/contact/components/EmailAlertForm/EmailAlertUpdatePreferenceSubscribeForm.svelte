<script lang="ts">
    import { onMount } from 'svelte';
    import { t } from '$lib/translations';
    import { validateUpdatePreferenceSubscriptionToken } from '$utils/updateSubscription/api';
    import type { PersonInfoType } from '$utils/email-alert/types';
    import UpdatePreferenceForm from './components/UpdatePreferenceForm.svelte';
    import type { FormStatus } from '$utils/forms/types';

    export let token: string;
    export let updatePreferenceActive: string;
    export let status: FormStatus = 'initial';

    const unknownErrorMessage = `${$t('forms.generic.errors.unknown')}. ${$t(
        'generic.prompts.try_again'
    )}`;

    export let message = '';

    let responseUpdatePreferenceObject: any;

    const validateTokenUpdateForm = () => {
        if (!token && !updatePreferenceActive) {
            return;
        }
        message = '';
        status = 'initial';
        validateUpdatePreferenceSubscriptionToken(token)
            .then((response: PersonInfoType) => {
                if (Object.keys(response).length === 0) {
                    throw new Error(unknownErrorMessage);
                }
                status = 'success';
                responseUpdatePreferenceObject = response;
            })
            .catch((e: unknown) => {
                const error = e as Error;
                status = 'failed';
                message = error.message || unknownErrorMessage;
            });
    };

    const goBackUrl = () => {
        const currentUrl = window.location.href;
        window.location.href = currentUrl.split('?')[0];
    };

    onMount(() => {
        validateTokenUpdateForm();
    });
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
            {#if status === 'failed'}
                <p class="failed_message">{message}</p>
                <button class="btn" on:click={goBackUrl}
                    >{$t('forms.email_alert_form.buttons.back_button')}</button
                >
            {/if}
            {#if status === 'success'}
                <UpdatePreferenceForm
                    updatePreferenceData={responseUpdatePreferenceObject}
                    {updatePreferenceActive}
                />
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    :global(span .error) {
        color: red;
    }
    :global(.error) {
        color: red;
    }
    :global(.success) {
        color: green;
    }
    :global(form.success) {
        display: none;
    }
</style>
