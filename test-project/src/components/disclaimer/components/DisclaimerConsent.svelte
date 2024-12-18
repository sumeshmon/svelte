<script lang="ts">
    import type { DISCLAIMERS } from '$components/disclaimer/constants';
    import { t } from '$lib/translations';
    import { createEventDispatcher, onDestroy } from 'svelte';
    export let selectedCountry: string;
    export let disclaimer: DISCLAIMERS;
    const dispatch = createEventDispatcher();
    onDestroy(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
</script>

<h2>
    {$t(`disclaimers.${disclaimer}.${selectedCountry}.disclaimer_consent_phase.heading`) ||
        $t(`disclaimers.${disclaimer}.default.disclaimer_consent_phase.heading`)}
</h2>
<div>
    {@html $t(`disclaimers.${disclaimer}.${selectedCountry}.disclaimer_consent_phase.content`) ||
        $t(`disclaimers.${disclaimer}.default.disclaimer_consent_phase.content`)}
</div>
<div>
    <button class="btn btn-outline-primary" on:click={() => dispatch('agree')}
        >{$t('common.agreeButton')}</button
    >
    <button class="btn btn-outline-secondary" on:click={() => dispatch('disagree')}
        >{$t('common.notAgreeButton')}</button
    >
</div>
