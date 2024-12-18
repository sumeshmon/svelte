<script lang="ts">
    import type { DISCLAIMERS } from '$components/disclaimer/constants';
    import { t } from '$lib/translations';
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    export let selectedCountry: string;
    export let disclaimer: DISCLAIMERS;
    const dispatch = createEventDispatcher();

    let enableAgreeButton = false;
    let container: HTMLDivElement;
    let us_cert1_checked = false;
    let us_cert2_checked = false;

    onMount(() => {
        container.querySelector('input[name="us_cert1"]')?.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            us_cert1_checked = target?.checked;
        });
        container.querySelector('input[name="us_cert2"]')?.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            us_cert2_checked = target?.checked;
        });
    });

    onDestroy(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    $: enableAgreeButton = us_cert1_checked && us_cert2_checked; // enable or disable agree button
</script>

<h2>
    {$t(`disclaimers.${disclaimer}.${selectedCountry}.disclaimer_us_consent_phase.heading`) ||
        $t(`disclaimers.${disclaimer}.default.disclaimer_us_consent_phase.heading`)}
</h2>
<div bind:this={container}>
    {@html $t(`disclaimers.${disclaimer}.${selectedCountry}.disclaimer_us_consent_phase.content`) ||
        $t(`disclaimers.${disclaimer}.default.disclaimer_us_consent_phase.content`)}
</div>
<div>
    <button
        class="btn"
        class:btn-outline-primary={enableAgreeButton}
        disabled={!enableAgreeButton}
        on:click={() => dispatch('agree')}>{$t('common.agreeButton')}</button
    >
    <button class="btn btn-outline-secondary" on:click={() => dispatch('disagree')}
        >{$t('common.notAgreeButton')}</button
    >
</div>
