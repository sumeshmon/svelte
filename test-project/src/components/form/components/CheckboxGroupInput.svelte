<script lang="ts">
    'use strict';
    import CheckboxInput from '$components/form/components/CheckboxInput.svelte';
    import { combineValidators } from '../validation';
    import { onMount } from 'svelte';
    let counter = 0;

    export let bindGroup: string[] = [];
    export let error: string | null = null;
    export let label: string = '';
    export let cssClass: string = '';
    export let containerCssClass: string = '';
    export let options: any = [];
    export let id: string = `checkbox-${counter++}`;
    export let validators: any = [];
    export let defaultOption: string | null = '';

    export const validate: any = async () => {
        try {
            await combineValidators(...validators)(label, bindGroup);
            error = null;
        } catch (e) {
            if (e instanceof Error) {
                error = e.message || 'Unknown error';
                throw e;
            } else {
                error = 'Unknown error';
            }
        }
    };

    const generateUniqueId = () => {
        counter++;
        return `${counter}`;
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
        {#each options as option, index}
            <CheckboxInput
                bind:bindGroup
                name={`checkbox-${index}`}
                id={`checkbox-${generateUniqueId()}`}
                label={option.name}
                value={option.value}
                {cssClass}
                bind:error
                on:change={() => validate()}
            />
        {/each}
    </ul>
    {#if error}
        <span class="error">{error}</span>
    {/if}
</div>
