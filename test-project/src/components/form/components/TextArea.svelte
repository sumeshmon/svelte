<script lang="ts">
    'use strict';
    let counter = 0;
    import { combineValidators } from '../validation';
    import FieldTemplate from './FieldTemplate.svelte';

    export let name: string = `textarea_${counter++}`;
    export let label: string = '';
    export let cssClass: string = '';
    export let containerCssClass: string = '';
    export let inputStyle: string = '';
    export let rows: number | null = null;
    export let cols: number | null = null;
    export let placeholder: string | null = null;
    export let value: string | null = null;
    export let error: string | null = null;
    export let isDirty: boolean = false;
    export let validateOnDirty: boolean = false;
    export let id: string = `input_${name}`;
    export let validators: any = [];
    export const validate: any = async () => {
        try {
            await combineValidators(...validators)(label, value);
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
    export const handleInputChange = () => {
        isDirty = true;
        validate();
    };
    $: {
        value; // whenever value will be changed this will run
        if (validateOnDirty === true && isDirty === true) {
            validate().catch(() => undefined);
        }
    }
</script>

<FieldTemplate {id} {label} {error} cssClass={containerCssClass}>
    <textarea
        style={inputStyle}
        bind:value
        {name}
        {id}
        {placeholder}
        class={cssClass}
        class:validation_error={error}
        slot="field"
        {rows}
        {cols}
        on:input={() => handleInputChange()}
    />
</FieldTemplate>

<style>
</style>
