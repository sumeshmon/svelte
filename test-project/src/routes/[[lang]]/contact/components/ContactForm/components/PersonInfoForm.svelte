<script lang="ts">
    import { t, locale } from '$lib/translations';

    import { type OptionType } from '@eqs/cms-svelte-irtools';
    import SelectInput from '$components/form/components/SelectInput.svelte';
    import TextInput from '$components/form/components/TextInput.svelte';
    import {
        combineValidates,
        email as emailValidator,
        required
    } from '@eqs/cms-svelte-irtools/form';
    import type { PersonInfoType } from '$utils/contact-form/types';
    import type { ValidateFunction } from '@eqs/cms-svelte-irtools/form';
    import { COUNTRIES } from '$utils/constants';
    import RadioGroupInput from '$components/form/components/RadioGroupInput.svelte';

    export let data: PersonInfoType;
    export let distributionList: string[] = [];
    export let supportedDist: string[] = [];
    let inputError: { [key: string]: undefined | string } = {};

    let genderOptions: OptionType[] = [];
    let affiliationOptions: OptionType[] = [];
    let countryOptions: OptionType[];

    const affiliationToDLMap: { [key: string]: string } = {
        Private_Investor: 'private-investor',
        Institutional_Investor: 'institutional-investor',
        Analyst: 'analyst',
        Journalist: 'journalist',
        Other: 'other'
    };

    supportedDist = Object.values(affiliationToDLMap);

    let setOptions = () => {
        genderOptions = [
            { name: $t('forms.dropdown_options.salutation.male'), value: 'male' },
            { name: $t('forms.dropdown_options.salutation.female'), value: 'female' },
            { name: $t('forms.dropdown_options.salutation.neutral'), value: 'neutral' }
        ];
        affiliationOptions = [
            {
                name: $t('forms.dropdown_options.affiliation.private_investor'),
                value: 'Private_Investor'
            },
            {
                name: $t('forms.dropdown_options.affiliation.institutional_investor'),
                value: 'Institutional_Investor'
            },
            { name: $t('forms.dropdown_options.affiliation.analyst'), value: 'Analyst' },
            {
                name: $t('forms.dropdown_options.affiliation.journalist'),
                value: 'Journalist'
            },
            { name: $t('forms.dropdown_options.affiliation.other'), value: 'Other' }
        ];
    };

    $: {
        if (data.affiliation) {
            distributionList = [affiliationToDLMap[data.affiliation]];
        }
        if ($locale) {
            setOptions();
            countryOptions = Object.keys(COUNTRIES).map((countryCode) => {
                return { name: $t(`countries.${countryCode}`), value: countryCode };
            });
        }
    }

    const validates: { [key: string]: ValidateFunction } = {};
    export const validate: ValidateFunction = async () => {
        await combineValidates(...Object.values(validates))();
    };
</script>

<div>
    <RadioGroupInput
        bind:group={data.gender}
        options={genderOptions}
        id="gender"
        cssClass="form-control"
        containerCssClass="radio-group"
        defaultOption="female"
    />
    <TextInput
        bind:value={data.firstName}
        label={$t('forms.contact_form.labels.first_name')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.lastName}
        label={$t('forms.contact_form.labels.last_name')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.company}
        label={$t('forms.contact_form.labels.company')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.jobTitle}
        label={$t('forms.contact_form.labels.job_title')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.email}
        type="email"
        label="{$t('forms.contact_form.labels.email')} *"
        validators={[
            required($t('forms.generic.validation.required', { default: 'email' })),
            emailValidator($t('forms.generic.validation.email', { default: 'email' }))
        ]}
        bind:validate={validates.email}
        bind:error={inputError.email}
        cssClass={inputError.email ? 'error form-control' : 'form-control'}
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.emailReception}
        type="email"
        label={$t('forms.contact_form.labels.other_emails.reception')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.streetName}
        label={$t('forms.contact_form.labels.street_name')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.postalCode}
        label={$t('forms.contact_form.labels.postal_code')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.city}
        label={$t('forms.contact_form.labels.city')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <SelectInput
        bind:value={data.countryCode}
        label={$t('forms.contact_form.labels.country')}
        placeholder={$t('forms.generic.prompts.please_choose')}
        options={countryOptions}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.phone}
        label={$t('forms.contact_form.labels.phone')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.mobilePhoneBusiness}
        label={$t('forms.contact_form.labels.other_phones.mobile_business')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.mobilePhonePrivate}
        label={$t('forms.contact_form.labels.other_phones.mobile_private')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.phoneReception}
        label={$t('forms.contact_form.labels.other_phones.reception')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.faxReception}
        label={$t('forms.contact_form.labels.faxes.reception')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.age}
        type="number"
        label={$t('forms.contact_form.labels.age')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <TextInput
        bind:value={data.ageGroup}
        label={$t('forms.contact_form.labels.age_group')}
        cssClass="form-control"
        containerCssClass="form-group"
    />
    <SelectInput
        bind:value={data.affiliation}
        label={$t('forms.contact_form.labels.affiliation')}
        placeholder={$t('forms.generic.prompts.please_choose')}
        options={affiliationOptions}
        cssClass="form-control"
        containerCssClass="form-group"
        validators={[required($t('forms.generic.validation.required', { default: 'affiliation' }))]}
        bind:validate={validates.affiliation}
    />
</div>
