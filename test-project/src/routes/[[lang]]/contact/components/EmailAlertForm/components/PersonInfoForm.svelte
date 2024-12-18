<script lang="ts">
    import { t, locale } from '$lib/translations';

    import TextInput from '$components/form/components/TextInput.svelte';
    import TextArea from '$components/form/components/TextArea.svelte';
    import SelectInput from '$components/form/components/SelectInput.svelte';
    import { type OptionType } from '@eqs/cms-svelte-irtools';

    import type { PersonInfoType } from '$utils/email-alert/types';
    import type { ValidateFunction } from '@eqs/cms-svelte-irtools';

    import {
        combineValidates,
        email as emailValidator,
        required
    } from '@eqs/cms-svelte-irtools/form/validation';
    import { COUNTRIES } from '$utils/constants';

    export let data: PersonInfoType;
    export let updatePreferenceActive: string | null = null;

    let genderOptions: OptionType[] = [];
    let salutationOptions: OptionType[] = [];
    let countryOptions: OptionType[];

    const validates: { [key: string]: ValidateFunction } = {};
    export const validate: ValidateFunction = async () => {
        await combineValidates(...Object.values(validates))();
    };

    let setOptions = () => {
        salutationOptions = [
            { name: $t('forms.dropdown_options.salutation.formal'), value: 'formal' },
            { name: $t('forms.dropdown_options.salutation.informal'), value: 'informal' }
        ];
        genderOptions = [
            { name: $t('forms.dropdown_options.gender.male'), value: 'male' },
            { name: $t('forms.dropdown_options.gender.female'), value: 'female' },
            { name: $t('forms.dropdown_options.gender.unknown'), value: 'unknown' },
            { name: $t('forms.dropdown_options.gender.neutral'), value: 'neutral' }
        ];
    };
    $: if ($locale) {
        setOptions();
        countryOptions = Object.keys(COUNTRIES).map((countryCode) => {
            return { name: $t(`countries.${countryCode}`), value: countryCode };
        });
    }
</script>

{#if !updatePreferenceActive}
    <div class="form__form-group">
        <div class="row">
            <div class="col-sm-12">
                <label for="email"> {$t('forms.email_alert_form.labels.email')} *</label>
            </div>
            <div class="col-sm-12">
                <TextInput
                    bind:value={data.email}
                    type="email"
                    id="email"
                    cssClass="form-control"
                    containerCssClass="form-group"
                    validators={[
                        required($t('forms.generic.validation.required', { default: 'email' })),
                        emailValidator(
                            $t('forms.generic.validation.email_required', { default: 'email' })
                        )
                    ]}
                    bind:validate={validates.email}
                />
            </div>
        </div>
    </div>
{/if}
<div class="form__form-group">
    <div class="row">
        <div class="col-sm-12">
            <label for="firstname"> {$t('forms.email_alert_form.labels.first_name')}:</label>
        </div>
        <div class="col-sm-12">
            <TextInput
                bind:value={data.firstName}
                id="firstname"
                cssClass="form-control"
                containerCssClass="form-group"
            />
        </div>
    </div>
</div>
<div class="form__form-group">
    <div class="row">
        <div class="col-sm-12">
            <label for="middle_name"> {$t('forms.email_alert_form.labels.middle_name')}:</label>
        </div>
        <div class="col-sm-12">
            <TextInput
                bind:value={data.middleName}
                id="middle_name"
                cssClass="form-control"
                containerCssClass="form-group"
            />
        </div>
    </div>
</div>
<div class="form__form-group">
    <div class="row">
        <div class="col-sm-12">
            <label for="last_name"> {$t('forms.email_alert_form.labels.last_name')}:</label>
        </div>
        <div class="col-sm-12">
            <TextInput
                bind:value={data.lastName}
                id="last_name"
                cssClass="form-control"
                containerCssClass="form-group"
            />
        </div>
    </div>
</div>
<div class="form__form-group">
    <div class="row">
        <div class="col-sm-12">
            <label for="company"> {$t('forms.email_alert_form.labels.company')}:</label>
        </div>
        <div class="col-sm-12">
            <TextInput
                bind:value={data.company}
                id="company"
                cssClass="form-control"
                containerCssClass="form-group"
            />
        </div>
    </div>
</div>
<div class="form__form-group">
    <div class="row">
        <div class="col-sm-12">
            <label for="gender"> {$t('forms.email_alert_form.labels.gender')}:</label>
        </div>
        <div class="col-sm-12">
            <SelectInput
                bind:value={data.gender}
                placeholder={$t('forms.generic.prompts.please_choose')}
                label=""
                options={genderOptions}
                id="gender"
                cssClass="form-control"
                containerCssClass="form-group"
            />
        </div>
    </div>
</div>
<div class="form__form-group">
    <div class="row">
        <div class="col-sm-12">
            <label for="academic_title">
                {$t('forms.email_alert_form.labels.academic_title')}:</label
            >
        </div>
        <div class="col-sm-12">
            <TextInput
                bind:value={data.academicTitle}
                id="academic_title"
                cssClass="form-control"
                containerCssClass="form-group"
            />
        </div>
    </div>
</div>
<div class="form__form-group">
    <div class="row">
        <div class="col-sm-12">
            <label for="salutation"> {$t('forms.email_alert_form.labels.salutation')}:</label>
        </div>
        <div class="col-sm-12">
            <SelectInput
                bind:value={data.salutation}
                placeholder={$t('forms.generic.prompts.please_choose')}
                options={salutationOptions}
                label=""
                id="salutation"
                cssClass="form-control"
                containerCssClass="form-group"
            />
        </div>
    </div>
</div>
<div class="form__form-group">
    <div class="row">
        <div class="col-sm-12">
            <label for="country"> {$t('forms.email_alert_form.labels.country')}:</label>
        </div>
        <div class="col-sm-12">
            <SelectInput
                bind:value={data.countryCode}
                placeholder={$t('forms.generic.prompts.please_choose')}
                options={countryOptions}
                label=""
                id="country"
                cssClass="form-control"
                containerCssClass="form-group"
            />
        </div>
    </div>
</div>
<div class="form__form-group">
    <div class="row">
        <div class="col-sm-12">
            <label for="description"> {$t('forms.email_alert_form.labels.description')}:</label>
        </div>
        <div class="col-sm-12">
            <TextArea
                bind:value={data.description}
                id="description"
                cssClass="form-control"
                containerCssClass="form-group"
                rows={8}
            />
        </div>
    </div>
</div>
<div class="form__form-group">
    <div class="row">
        <div class="col-sm-12">
            <label for="occupation"> {$t('forms.email_alert_form.labels.occupation')}:</label>
        </div>
        <div class="col-sm-12">
            <TextInput
                bind:value={data.occupation}
                id="occupation"
                cssClass="form-control"
                containerCssClass="form-group"
            />
        </div>
    </div>
</div>
