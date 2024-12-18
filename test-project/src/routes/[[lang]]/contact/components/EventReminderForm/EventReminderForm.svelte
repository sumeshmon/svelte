<script lang="ts">
    import { type EmailAlertApiPostData, createSubscription } from '$utils/email-alert/api';
    import type { PersonInfoType } from '$utils/email-alert/types';
    import {
        EVENT_REMINDER_DISTRIBUTION_LIST,
        googleRecaptchaConfig
    } from '$utils/email-alert/constants';
    import { t } from '$lib/translations';
    import { PUBLIC_RECAPTCHA_TARGET_HTML_ID } from '$env/static/public';
    import {
        combineValidates,
        email as emailValidator,
        required
    } from '@eqs/cms-svelte-irtools/form/validation';
    import TextInput from '$components/form/components/TextInput.svelte';
    import { onMount } from 'svelte';
    import RecaptchaForm from '$components/Recaptcha/RecaptchaForm.svelte';
    import Loader from '$components/Loader.svelte';
    import { initializeRecaptcha } from '$utils/forms/utils';
    import type { ValidateFunction } from '@eqs/cms-svelte-irtools';
    import CheckboxInput from '$components/form/components/CheckboxInput.svelte';

    type EmailAlertFormType = {
        distributionList: string[];
        personalInfo: PersonInfoType;
        supportedDist: string[];
    };

    let error = '',
        success = '',
        scrollToTop: HTMLDivElement,
        loader = false;

    const formObject: EmailAlertFormType = {
        distributionList: [EVENT_REMINDER_DISTRIBUTION_LIST],
        personalInfo: {
            email: ''
        },
        supportedDist: [EVENT_REMINDER_DISTRIBUTION_LIST]
    };

    const formatFormData = (
        data: EmailAlertFormType & { subscribeRecaptchaToken: string }
    ): EmailAlertApiPostData => {
        return {
            ...data,
            ...data.personalInfo,
            email: data.personalInfo.email || '',
            meta: [],
            distributionList: data.distributionList,
            supportedDist: formObject.supportedDist
        };
    };

    const validates: { [key: string]: ValidateFunction } = {};
    export const validate: ValidateFunction = async () => {
        await combineValidates(...Object.values(validates))();
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await validate();
            loader = true;
            try {
                error = ''; // reset the error
                const googleRecaptcha = window.grecaptcha;
                const responseToken = await googleRecaptcha.execute(subscribeRecaptcha, {
                    action: 'subscribeForm'
                });
                if (responseToken.length === 0) {
                    return;
                }
                const formattedData = formatFormData({
                    ...formObject,
                    subscribeRecaptchaToken: responseToken
                });
                await createSubscription(formattedData);
                loader = false;
                success = $t('forms.email_alert_form.successfully_subscribed');
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
    let subscribeRecaptcha: any;

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (!token) {
            subscribeRecaptcha = await initializeRecaptcha(PUBLIC_RECAPTCHA_TARGET_HTML_ID);
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
    <form on:submit|preventDefault={onSubmit} id="subscribeForm" class:success>
        <div class="row">
            <div class="col-sm-12">
                <h1 class="form__head">{$t('forms.email_alert_form.heading')}</h1>
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
                        cssClass="form-control"
                        containerCssClass="form-group"
                        validators={[
                            required($t('forms.generic.validation.required', { default: 'email' })),
                            emailValidator(
                                $t('forms.generic.validation.email', { default: 'email' })
                            )
                        ]}
                        bind:validate={validates.personalInfo}
                    />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-2" />
            <div class="col-sm-10">
                <RecaptchaForm
                    {googleRecaptchaConfig}
                    recaptchaSelectorId={PUBLIC_RECAPTCHA_TARGET_HTML_ID}
                />
            </div>
        </div>
        <div class="form__form-group">
            <CheckboxInput
                containerCssClass="privacy_checkbox"
                type="checkbox"
                label="{$t('forms.generic.privacy_text')} *"
                validators={[
                    required(
                        $t('forms.generic.validation.required', {
                            default: 'privacy'
                        })
                    )
                ]}
                bind:validate={validates.privacy}
            />
        </div>
        <div class="row">
            <div class="col-sm-12">
                <button class="btn" type="submit" on:click={onSubmit}
                    >{$t('forms.email_alert_form.buttons.submit')}</button
                >
            </div>
        </div>
    </form>
</div>

<style lang="scss">
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
