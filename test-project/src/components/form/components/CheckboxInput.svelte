<script lang="ts">
    'use strict';
    let counter = 0;
    import { createEventDispatcher } from 'svelte';
    import { combineValidators } from '../validation';

    export let bindGroup: any = [];
    export let type: any = 'checkbox';
    export let name: string = `input${type}_${counter}`;
    export let label: string = '';
    export let value: string = '';
    export let cssClass: string = '';
    export let containerCssClass: string = '';
    export let inputStyle: string = '';
    export let disabled: boolean = false;
    export let error: string | null = null;
    export let isDirty: boolean = false;
    export let validateOnDirty: boolean = false;
    export let id: string = `input_${type}_${name}_${counter}`;
    counter++;
    const dispatch = createEventDispatcher();
    const onChange = ({ target }: { target: any }) => {
        isDirty = true; // mark as dirty
        const { value, checked } = target;
        if (checked) {
            bindGroup = [...bindGroup, value];
        } else {
            bindGroup = bindGroup.filter((item: any) => item !== value);
        }
        dispatch('change', { value, checked });
    };
    export let validators: any = [];
    export const validate = async () => {
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
    $: {
        value; // whenever value will be changed this will run
        if (validateOnDirty === true && isDirty === true) {
            validate().catch(() => undefined);
        }
    }
</script>

<div class={containerCssClass}>
    <label for={id}>
        <input
            type="checkbox"
            checked={bindGroup.includes(value)}
            on:change={onChange}
            {id}
            {name}
            {value}
            class={cssClass}
            class:validation_error={error}
            {disabled}
            style={inputStyle}
            on:change={() => validate()}
        />
        {@html label}
    </label>
    {#if error}
        <span class="error">{error}</span>
    {/if}
</div>
