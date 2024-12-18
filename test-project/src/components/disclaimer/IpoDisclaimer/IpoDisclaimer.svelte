<script lang="ts">
    import LocationValidation from '../components/LocationValidation.svelte';
    import DisclaimerConsent from '../components/DisclaimerConsent.svelte';
    import DisclaimerUsConsent from '../components/DisclaimerUSConsent.svelte';
    import NoAccess from '../components/NoAccess.svelte';
    import { DISCLAIMERS } from '../constants';
    import { createEventDispatcher } from 'svelte';
    import { isDisclaimerPersistNoAccess } from '$utils/disclaimer';

    enum DISCLAIMER_PHASES {
        location_validation = 'location_validation_phase',
        disclaimer_us_consent = 'disclaimer_us_consent_phase',
        disclaimer_consent = 'disclaimer_consent_phase',
        no_access = 'no_access_phase'
    }

    const disclaimer = DISCLAIMERS.IPO;

    const dispatch = createEventDispatcher();
    export let persistNoAccess: boolean = false;
    let currentPhase = DISCLAIMER_PHASES.location_validation;
    let selectedCountry = '';
    const countriesWithPostalCodeAndCity = [
        'BE',
        'BG',
        'DK',
        'DE',
        'EE',
        'FI',
        'FR',
        'GR',
        'IE',
        'IT',
        'HR',
        'LV',
        'LT',
        'LU',
        'MT',
        'NL',
        'AT',
        'PL',
        'PT',
        'RO',
        'SE',
        'SK',
        'SI',
        'ES',
        'CZ',
        'HU',
        'CY',
        'IS',
        'LI',
        'NO',
        'GB',
        'CH'
    ];
    if (
        persistNoAccess &&
        isDisclaimerPersistNoAccess({
            disclaimer
        })
    ) {
        currentPhase = DISCLAIMER_PHASES.no_access;
    }
    const setNextPhase = (nextPhase: DISCLAIMER_PHASES) => {
        currentPhase = nextPhase;
    };
</script>

<div class="disclaimer__content">
    {#if currentPhase === DISCLAIMER_PHASES.location_validation}
        <LocationValidation
            alwaysShowCityZip={true}
            bind:selectedCountry
            {disclaimer}
            {countriesWithPostalCodeAndCity}
            on:allowedlocation={() => {
                if (['US'].includes(selectedCountry)) {
                    return setNextPhase(DISCLAIMER_PHASES.disclaimer_us_consent);
                }
                setNextPhase(DISCLAIMER_PHASES.disclaimer_consent);
            }}
            on:notallowedlocation={() => {
                setNextPhase(DISCLAIMER_PHASES.no_access);
            }}
        />
    {/if}
    {#if currentPhase === DISCLAIMER_PHASES.disclaimer_us_consent}
        <DisclaimerUsConsent
            {selectedCountry}
            {disclaimer}
            on:agree={() => {
                dispatch('us_agree');
                setNextPhase(DISCLAIMER_PHASES.disclaimer_consent);
            }}
            on:disagree={() => {
                setNextPhase(DISCLAIMER_PHASES.no_access);
                dispatch('disagree');
            }}
        />
    {/if}
    {#if currentPhase === DISCLAIMER_PHASES.disclaimer_consent}
        <DisclaimerConsent
            {selectedCountry}
            {disclaimer}
            on:agree={() => {
                dispatch('agree');
            }}
            on:disagree={() => {
                setNextPhase(DISCLAIMER_PHASES.no_access);
                dispatch('disagree');
            }}
        />
    {/if}
    {#if currentPhase === DISCLAIMER_PHASES.no_access}
        <NoAccess {selectedCountry} {disclaimer} />
    {/if}
</div>
