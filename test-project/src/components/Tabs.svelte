<script lang="ts">
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import { createEventDispatcher } from 'svelte';
    import { t } from '$lib/translations';
    export let options: OptionType[] = [];
    export let value = '';
    const dispatch = createEventDispatcher();
    $: {
        dispatch('change', value);
    }
</script>

<ul class="nav nav-tabs border-0">
    {#each options as tab}
        <li class="nav-item">
            <button
                type="button"
                class="nav-link"
                class:active={tab.value === value}
                aria-current="page"
                on:click={() => {
                    value = tab.value;
                }}>{$t(tab.name) || tab.name}</button
            >
        </li>
    {/each}
</ul>
