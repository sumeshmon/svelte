<script lang="ts">
    import { googleRecaptchaConfig } from '$utils/email-alert/constants';
    import { t } from '$lib/translations';
    import type { PersonInfoType, UpdatePersonInfoType } from '$utils/email-alert/types';
    import PersonInfoFormComponent from '../components/PersonInfoForm.svelte';
    import DistributionListGroup from '../components/DistributionListGroup.svelte';
    import { onMount } from 'svelte';
    import type { OptionType, ValidateFunction } from '@eqs/cms-svelte-irtools';
    import { combineValidates, required } from '@eqs/cms-svelte-irtools/form/validation';
    import { PUBLIC_RECAPTCHA_UPDATE_PERSON_TARGET_HTML_ID } from '$env/static/public';
    import { type EmailAlertApiPostData } from '$utils/email-alert/api';
    import { updateSubscription } from '$utils/updateSubscription/api';
    import { getMetaInfo, prepareKeyValuePairs } from '$utils/email-alert/ops';
    import RecaptchaForm from '$components/Recaptcha/RecaptchaForm.svelte';
    import Loader from '$components/Loader.svelte';
    import { initializeRecaptcha } from '$utils/forms/utils.js';
    import CheckboxGroupInput from '$components/form/components/CheckboxGroupInput.svelte';
    import CheckboxInput from '$components/form/components/CheckboxInput.svelte';

    export let updatePreferenceData: UpdatePersonInfoType;
    export let updatePreferenceActive: string;

    let languageOptions: OptionType[] = [
        { name: $t('forms.generic.languages.en'), value: 'en' },
        { name: $t('forms.generic.languages.de'), value: 'de' }
    ];

    let error = '',
        success = '',
        scrollToTop: HTMLDivElement,
        loader = false;

    type EmailAlertFormType = {
        distributionList: string[];
        personalInfo: PersonInfoType;
        supportedDist: string[];
        otherLocales: string[];
    };

    const formObject: EmailAlertFormType = {
        distributionList: updatePreferenceData.distributionList,
        personalInfo: {
            firstName: updatePreferenceData.firstName,
            middleName: updatePreferenceData.middleName,
            lastName: updatePreferenceData.middleName,
            company: updatePreferenceData.company,
            gender: updatePreferenceData.gender?.toLowerCase(),
            academicTitle: updatePreferenceData.academicTitle,
            salutation: updatePreferenceData.salutation,
            countryCode: updatePreferenceData.countryCode,
            description: updatePreferenceData.description,
            occupation: getMetaInfo(updatePreferenceData.meta || [], 'Occupation')
        },
        supportedDist: [],
        otherLocales: updatePreferenceData.otherLocales || []
    };

    const validates: { [key: string]: ValidateFunction } = {};
    export const validate: ValidateFunction = async () => {
        await combineValidates(...Object.values(validates))();
    };

    const formatFormData = (
        data: EmailAlertFormType & { subscribeRecaptchaToken: string }
    ): EmailAlertApiPostData => {
        const metaFieldsMap = {
            occupation: 'Occupation'
        };
        return {
            ...data,
            ...data.personalInfo,
            email: data.personalInfo.email || '',
            meta: prepareKeyValuePairs(data.personalInfo, metaFieldsMap, 'name'),
            distributionList: data.distributionList
        };
    };

    const onUpdateSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await validate();
            loader = true;
            try {
                error = ''; // reset the error
                const googleRecaptcha = window.grecaptcha;
                const token = await googleRecaptcha.execute(recaptchaConfig, {
                    action: 'updateSubscribeForm'
                });
                if (token.length === 0) {
                    return;
                }
                const formattedData = formatFormData({
                    ...formObject,
                    subscribeRecaptchaToken: token
                });
                const urlParams = new URLSearchParams(window.location.search);
                const submittedToken = urlParams.get('token') || '';
                await updateSubscription(formattedData, submittedToken);
                loader = false;
                success = $t('forms.email_alert_form.successfully_subscriber_updated');
            } catch (e: unknown) {
                const errorObject = e as Error;
                success = '';
                loader = false;
                error = `${errorObject.message || $t('forms.generic.errors.unknown')}`;
            }
        } catch (e) {
            /* empty */
        }
    };

    const goBackUrl = () => {
        const currentUrl = window.location.href;
        window.location.href = currentUrl.split('?')[0];
    };

    /**
     * Render Subscribe form Captcha
     *
     */
    let recaptchaConfig: any;

    onMount(async () => {
        recaptchaConfig = await initializeRecaptcha(PUBLIC_RECAPTCHA_UPDATE_PERSON_TARGET_HTML_ID);
    });
</script>

<div class="update-form" bind:this={scrollToTop}>
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
    <form on:submit|preventDefault={onUpdateSubmit} id="updateForm" class:success>
        <div class="row">
            <div class="col-sm-12">
                <h1 class="form__head">
                    {$t('forms.email_alert_form.update_heading')}
                </h1>
            </div>
        </div>
        <DistributionListGroup
            bind:checkboxGroup={formObject.distributionList}
            bind:validate={validates.distributionList}
            validators={[required($t('forms.generic.validation_errors.category_select_one'))]}
            bind:supportedDist={formObject.supportedDist}
        />
        <PersonInfoFormComponent
            bind:data={formObject.personalInfo}
            bind:validate={validates.personalInfo}
            {updatePreferenceActive}
        />
        <div class="row form__form-group">
            <div class="col-sm-12">
                <p>{$t('forms.generic.preferred_language_choose')}</p>
                <CheckboxGroupInput
                    options={languageOptions}
                    bind:bindGroup={formObject.otherLocales}
                    bind:validate={validates.otherLocales}
                />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-2" />
            <div class="col-sm-10">
                <RecaptchaForm
                    {googleRecaptchaConfig}
                    recaptchaSelectorId={PUBLIC_RECAPTCHA_UPDATE_PERSON_TARGET_HTML_ID}
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
                <button class="btn" type="submit"
                    >{$t('forms.email_alert_form.buttons.submit')}</button
                >
            </div>
        </div>
    </form>
</div>
