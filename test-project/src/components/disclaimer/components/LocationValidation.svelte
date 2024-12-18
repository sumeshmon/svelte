<script lang="ts">
    import JquerySelectric from '$components/JquerySelectric.svelte';
    import { createEventDispatcher } from 'svelte';
    import { t, locale } from '$lib/translations';
    import { type OptionType, TextInputSvelte } from '@eqs/cms-svelte-irtools';
    import { COUNTRIES } from '$utils/constants';
    import { lookupPostalCode } from '$api/postalcode_lookup';
    import { DISCLAIMERS, DISCLAIMER_ALLOWED_COUNTRIES } from '$components/disclaimer/constants';

    const dispatch = createEventDispatcher();

    export let selectedCountry: string;
    export let disclaimer: DISCLAIMERS;
    export let countriesWithPostalCodeAndCity: string[] = [];
    export let alwaysShowCityZip: boolean = false;

    let countryOptions: OptionType[];
    let city = '';
    let postalCode = '';
    let isFormValid = false;

    $: {
        // reactive block for valid flag only
        if (countriesWithPostalCodeAndCity.includes(selectedCountry)) {
            isFormValid = !!(postalCode && city);
        } else {
            isFormValid = !!selectedCountry;
        }
    }
    $: if ($locale) {
        countryOptions = Object.keys(COUNTRIES).map((countryCode) => {
            return { name: $t(`countries.${countryCode}`), value: countryCode };
        });
    }
    const validateLocation = () => {
        if (!DISCLAIMER_ALLOWED_COUNTRIES[disclaimer].includes(selectedCountry)) {
            return dispatch('notallowedlocation');
        }
        if (countriesWithPostalCodeAndCity.includes(selectedCountry)) {
            city = city.trim();
            lookupPostalCode({ country: selectedCountry, city, postalCode })
                .then((validPostalCodes) => {
                    if (validPostalCodes.length <= 0) {
                        return dispatch('notallowedlocation');
                    }
                    dispatch('allowedlocation');
                })
                .catch(() => {
                    //
                });
        } else {
            dispatch('allowedlocation');
        }
    };
</script>

<div class="disclaimer__validation">
    <h2 class="disclaimer__validation-heading">
        {@html $t(
            `disclaimers.${disclaimer}.${selectedCountry}.location_validation_phase.heading`
        ) || $t(`disclaimers.${disclaimer}.default.location_validation_phase.heading`)}
    </h2>
    <p class="disclaimer__validation-text">
        {@html $t(
            `disclaimers.${disclaimer}.${selectedCountry}.location_validation_phase.content`
        ) || $t(`disclaimers.${disclaimer}.default.location_validation_phase.content`)}
    </p>
    <div class="disclaimer__validation-country">
        <label for="country">{$t('common.selectCountry')}</label>
        <JquerySelectric
            id="country"
            options={countryOptions}
            bind:value={selectedCountry}
            placeholder={$t('common.pleaseChoose')}
        />
    </div>

    {#if countriesWithPostalCodeAndCity.includes(selectedCountry) || (selectedCountry && alwaysShowCityZip)}
        <div class="disclaimer__validation-city-zip">
            <TextInputSvelte
                cssClass="disclaimer__validation-city"
                bind:value={city}
                label={$t('common.enterCity')}
            />
            <TextInputSvelte
                cssClass="disclaimer__validation-zip"
                bind:value={postalCode}
                label={$t('common.enterZip')}
            />
        </div>
    {/if}
    <div class="disclaimer__validation-button-wrapper">
        <button
            class="btn btn-primary"
            disabled={!isFormValid}
            on:click={() => {
                validateLocation();
            }}>{$t('common.goButton')}</button
        >
    </div>
</div>
