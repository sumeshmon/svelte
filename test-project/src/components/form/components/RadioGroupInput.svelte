<script lang="ts">
    'use strict';
    let counter = 0;
    import { writable } from 'svelte/store';
    let radioCounter = writable(0);
    import { combineValidators } from '../validation';
    import RadioInput from './RadioInput.svelte';
    export let group: string = '';
    export let error: string | null = null;
    export let label: string = '';
    export let cssClass: string = '';
    export let containerCssClass: string = '';
    export let options: any = [];
    export let id: string = `radio_group_${counter++}`;
    export let validators: any = [];
    export let defaultOption: string | null = '';
    import { onMount } from 'svelte';

    export const validate: any = async () => {
        try {
            await combineValidators(...validators)(label, group);
            error = null;
        } catch (e) {
            if (e instanceof Error) {
                const errorObject = e;
                error = errorObject.message || 'Unknown error';
                throw e;
            } else {
                error = 'Unknown error';
            }
        }
    };

    onMount(() => {
        let radioButtons = document.getElementsByName(id);

        for (let i = 0; i < radioButtons.length; i++) {
            let radioButton = radioButtons[i] as HTMLInputElement;
            if (radioButton.value === defaultOption) {
                radioButton.checked = true;
                break;
            }
        }
    });
</script>

<div {id} class={containerCssClass}>
    <ul>
        {#each options as option}
            <RadioInput
                bind:group
                name={id}
                label={option.name}
                value={option.value}
                {cssClass}
                bind:error
                {radioCounter}
            />
        {/each}
    </ul>
    {#if error}
        <span class="error">{error}</span>
    {/if}
</div>
