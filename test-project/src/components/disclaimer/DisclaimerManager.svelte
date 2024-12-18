<script lang="ts">
    import {
        DISCLAIMER_STORAGE_KEY,
        disclaimerStore,
        isDisclaimerAgreed,
        setDisclaimerToAgreed,
        setDisclaimerToDisagreed,
        tokenGenerater,
        type DisclaimerState
    } from '$utils/disclaimer';
    import { onDestroy, onMount } from 'svelte';
    import { DISCLAIMER_TO_COMPONENT_MAP, type DISCLAIMERS } from './constants';
    import { saveDisclaimerToStorage } from '$utils/disclaimer-storage';

    export let disclaimer: DISCLAIMERS;
    export let persistNoAccess: boolean = false;
    export let persistApproval: boolean = true;
    const DisclaimerComponent = DISCLAIMER_TO_COMPONENT_MAP[disclaimer];

    let disclaimerState: DisclaimerState | null = null;
    let loading: boolean = true;

    const unSubscribeDisclaimerStore = disclaimerStore.subscribe((v) => {
        saveDisclaimerToStorage(DISCLAIMER_STORAGE_KEY, v);
        disclaimerState = v;
    });

    const applyPersistApproval = () => {
        if (persistApproval === false && isDisclaimerAgreed({ disclaimer })) {
            setDisclaimerToDisagreed({ disclaimer, persistNoAccess: false });
        }
    };

    onMount(() => {
        applyPersistApproval();
        loading = false;
    });

    onDestroy(() => {
        applyPersistApproval();
        unSubscribeDisclaimerStore();
    });
    $: isAgree = !!disclaimerState && disclaimer && isDisclaimerAgreed({ disclaimer });
</script>

{#if loading}
    loading...
{:else if !isAgree}
    <DisclaimerComponent
        {persistNoAccess}
        on:agree={() =>
            setDisclaimerToAgreed({
                disclaimer,
                persistApproval
            })}
    />
{:else}
    <slot />
{/if}
