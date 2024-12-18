<script lang="ts">
    import { t } from '$lib/translations';
    import TextInput from '$components/form/components/TextInput.svelte';
    import { type ValidateFunction } from '@eqs/cms-svelte-irtools';
    import {
        combineValidates,
        email as emailValidator,
        required
    } from '@eqs/cms-svelte-irtools/form/validation';

    import { googleRecaptchaConfig } from '$utils/email-alert/constants';
    import { PUBLIC_RECAPTCHA_UNSUB_TARGET_HTML_ID } from '$env/static/public';
    import { sendUnSubscriptionRequest } from '$utils/email-alert/api';
    import { type PersonInfoType } from '$utils/email-alert/types';
    import { onMount } from 'svelte';
    import RecaptchaForm from '$components/Recaptcha/RecaptchaForm.svelte';
    import Loader from '$components/Loader.svelte';
    import { initializeRecaptcha } from '$utils/forms/utils.js';

    let error = '',
        success = '',
        scrollToTop: HTMLDivElement,
        loader = false;

    type EmailAlertUnsubscribeFormType = {
        personalInfo: PersonInfoType;
    };

    const formObject: EmailAlertUnsubscribeFormType = {
        personalInfo: {
            email: ''
        }
    };

    const validates: { [key: string]: ValidateFunction } = {};
    export const validate: ValidateFunction = async () => {
        await combineValidates(...Object.values(validates))();
    };

    const formatFormData = (
        data: EmailAlertUnsubscribeFormType & {
            subscribeRecaptchaToken: string;
        }
    ) => {
        return {
            ...data,
            ...data.personalInfo,
            email: data.personalInfo.email || ''
        };
    };

    const onUnSubscribeSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await validate();
            loader = true;
            try {
                error = ''; // reset the error
                const googleRecaptcha = window.grecaptcha;
                const responseToken = await googleRecaptcha.execute(unSubscribeRecaptcha, {
                    action: 'unSubscribeForm'
                });
                if (responseToken.length === 0) {
                    return;
                }
                const formattedData = formatFormData({
                    ...formObject,
                    subscribeRecaptchaToken: responseToken
                });
                await sendUnSubscriptionRequest(formattedData);
                loader = false;
                success = $t('forms.email_alert_form.successfully_unsubscribed');
            } catch (e: unknown) {
                const errorObject = e as Error;
                success = '';
                loader = false;
                error = `${errorObject.message || $t('forms.generic.errors.unknown')}`;
            }
            scrollToTop.scrollIntoView();
        } catch (e) {
            /* empty */
        }
    };

    const goBackUrl = () => {
        window.location.reload();
    };

    /**
     * Render Subscribe form Captcha
     *
     */
    let unSubscribeRecaptcha: any;

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (!token) {
            unSubscribeRecaptcha = await initializeRecaptcha(PUBLIC_RECAPTCHA_UNSUB_TARGET_HTML_ID);
        }
    });
</script>

<div class="container" bind:this={scrollToTop}>
    {#if success}
        <span class="success">{success}</span>
        <br />
        <button class="btn" on:click={goBackUrl}
            >{$t('forms.email_alert_form.buttons.back_button')}</button
        >
    {/if}
    {#if error}
        <p class="error">{error}</p>
    {/if}
    <Loader bind:loader animation={true} align="center" />
    <form on:submit|preventDefault={onUnSubscribeSubmit} id="unSubscribeForm" class:success>
        <div class="row">
            <div class="col-sm-12">
                <h1 class="form__head">{$t('forms.email_alert_form.heading_unsub')}</h1>
            </div>
        </div>
        <div class="form__form-group">
            <div class="row">
                <div class="col-sm-12">
                    <label for="email"> {$t('forms.email_alert_form.labels.email')} *</label>
                </div>
                <div class="col-sm-12">
                    <TextInput
                        bind:value={formObject.personalInfo.email}
                        type="email"
                        id="email"
                        cssClass="form__input-field"
                        validators={[
                            required($t('forms.generic.validation_errors.email_required')),
                            emailValidator($t('forms.generic.validation_errors.email'))
                        ]}
                        bind:validate={validates.email}
                    />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-2" />
            <div class="col-sm-10">
                <RecaptchaForm
                    {googleRecaptchaConfig}
                    recaptchaSelectorId={PUBLIC_RECAPTCHA_UNSUB_TARGET_HTML_ID}
                />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <button class="btn" type="submit" on:click={onUnSubscribeSubmit}
                    >{$t('forms.email_alert_form.buttons.submit')}</button
                >
            </div>
        </div>
    </form>
</div>

<style lang="scss">
    .container {
        .form__form-group {
            :global(input[type='email']) {
                display: block;
                padding: 8px 12px;
                font-size: 14px;
                width: 100%;
                background-image: none;
                line-height: 1.42857143;
            }
        }
    }
    :global(.error) {
        color: red;
    }

    :global(span) {
        .error {
            color: red;
        }
    }

    .success {
        color: green;
    }
    form.success {
        display: none;
    }
</style>
