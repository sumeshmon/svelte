<script lang="ts">
    import PersonInfoFormComponent from './components/PersonInfoForm.svelte';
    import type { PersonInfoType } from '$utils/contact-form/types';
    import { googleRecaptchaConfig } from '$utils/contact-form/constants';
    import { prepareKeyValuePairs } from '$utils/contact-form/ops';
    import type { ValidateFunction } from '@eqs/cms-svelte-irtools/form';
    import { combineValidates, required } from '@eqs/cms-svelte-irtools/form';
    import { type ContactApiPostData, createSubscription } from '$utils/contact-form/api';
    import { PUBLIC_RECAPTCHA_TARGET_HTML_ID } from '$env/static/public';
    import { locale, t } from '$lib/translations';
    import { onMount } from 'svelte';
    import RecaptchaForm from '$components/Recaptcha/RecaptchaForm.svelte';
    import Loader from '$components/Loader.svelte';
    import { initializeRecaptcha } from '$utils/forms/utils';
    import { type OptionType } from '@eqs/cms-svelte-irtools';
    import CheckboxInput from '$components/form/components/CheckboxInput.svelte';
    import RadioGroupInput from '$components/form/components/RadioGroupInput.svelte';

    export let directSendMail: boolean = false;

    let languageOptions: OptionType[] = [
        { name: $t('forms.generic.languages.en'), value: 'en' },
        { name: $t('forms.generic.languages.de'), value: 'de' }
    ];

    type ContactFormType = {
        distributionList: string[];
        supportedDist: string[];
        personalInfo: PersonInfoType;
        directSendMail: boolean;
        locale: string;
    };

    let error = '',
        success = '',
        scrollToTop: HTMLDivElement,
        loader = false;

    const formObject: ContactFormType = {
        distributionList: [],
        supportedDist: [],
        personalInfo: {
            email: ''
        },
        directSendMail: false,
        locale: ''
    };

    const formatFormData = (
        data: ContactFormType & { subscribeRecaptchaToken: string }
    ): ContactApiPostData => {
        const metaFieldsMap = {
            age: 'Age',
            ageGroup: 'Age Group'
        };
        const otherEmailsFieldsMap = {
            emailReception: 'Reception'
        };
        const otherPhonesFieldsMap = {
            mobilePhoneBusiness: 'Mobile Business',
            mobilePhonePrivate: 'Mobile Private',
            phoneReception: 'Reception'
        };
        const faxesFields = {
            faxReception: 'Reception'
        };
        return {
            ...data,
            ...data.personalInfo,
            email: data.personalInfo.email || '',
            meta: prepareKeyValuePairs(data.personalInfo, metaFieldsMap, 'name'),
            otherEmails: prepareKeyValuePairs(data.personalInfo, otherEmailsFieldsMap, 'category'),
            otherPhones: prepareKeyValuePairs(data.personalInfo, otherPhonesFieldsMap, 'category'),
            faxes: prepareKeyValuePairs(data.personalInfo, faxesFields, 'category'),
            category: data.personalInfo.affiliation ? [data.personalInfo.affiliation] : []
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
                    subscribeRecaptchaToken: responseToken,
                    directSendMail: directSendMail
                });
                await createSubscription(formattedData);
                loader = false;
                if (directSendMail) {
                    success = $t('forms.contact_form.successfully_direct_subscribed');
                } else {
                    success = $t('forms.contact_form.successfully_subscribed');
                }
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

<div class="eqs-cms-irtool" bind:this={scrollToTop}>
    {#if error}
        <span class="error">{error}</span>
    {/if}
    {#if success}
        <span class="success">{success}</span>
        <br />
        <button class="btn" on:click={goBackUrl}
            >{$t('forms.contact_form.buttons.back_button')}</button
        >
    {/if}
    <Loader bind:loader animation={true} align="center" />
    <form on:submit|preventDefault={onSubmit} id="subscribeForm" class:success>
        <section>
            <PersonInfoFormComponent
                bind:data={formObject.personalInfo}
                bind:distributionList={formObject.distributionList}
                bind:validate={validates.personalInfo}
                bind:supportedDist={formObject.supportedDist}
            />
        </section>
        <div class="form__form-group">
            <label for="">{$t('forms.generic.preferred_language_choose')}</label>
            <RadioGroupInput
                options={languageOptions}
                bind:group={formObject.locale}
                bind:validate={validates.otherLocales}
                defaultOption={$locale}
            />
        </div>
        <RecaptchaForm
            {googleRecaptchaConfig}
            recaptchaSelectorId={PUBLIC_RECAPTCHA_TARGET_HTML_ID}
        />
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
        <button class="btn btn-primary" type="submit" on:click={onSubmit}
            >{$t('forms.contact_form.buttons.submit')}</button
        >
    </form>
</div>

<style lang="scss">
    :global(.error) {
        color: red;
    }
    :global(.privacy_checkbox label) {
        display: block;
    }
    .success {
        color: green;
    }
    form.success {
        display: none;
    }
</style>
