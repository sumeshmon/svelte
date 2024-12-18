<script lang="ts">
    import LocationValidation from '../components/LocationValidation.svelte';
    import DisclaimerConsent from '../components/DisclaimerConsent.svelte';
    import NoAccess from '../components/NoAccess.svelte';
    import { DISCLAIMERS } from '../constants';
    import { createEventDispatcher } from 'svelte';
    import { isDisclaimerPersistNoAccess } from '$utils/disclaimer';

    enum DISCLAIMER_PHASES {
        location_validation = 'location_validation_phase',
        disclaimer_consent = 'disclaimer_consent_phase',
        no_access = 'no_access_phase'
    }
    const disclaimer = DISCLAIMERS.GENERAL;

    const dispatch = createEventDispatcher();
    export let persistNoAccess: boolean = false;
    let currentPhase = DISCLAIMER_PHASES.location_validation;
    let selectedCountry = '';
    const countriesWithPostalCodeAndCity = ['DE', 'AT'];
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
            bind:selectedCountry
            {disclaimer}
            {countriesWithPostalCodeAndCity}
            on:allowedlocation={() => {
                setNextPhase(DISCLAIMER_PHASES.disclaimer_consent);
            }}
            on:notallowedlocation={() => {
                setNextPhase(DISCLAIMER_PHASES.no_access);
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
