<script lang="ts">
    let counter = 0;
    import { combineValidators } from '../validation';
    import FieldTemplate from './FieldTemplate.svelte';

    export let options: any;
    export let name: string = `inputselect_${counter++}`;
    export let label: string = `Select an option`;
    export let placeholder: string | null = null;
    export let value: string = '';
    export let inputStyle: string = '';
    export let cssClass: string = '';
    export let containerCssClass: string = '';
    export let error: string | null = null;
    export let isDirty: boolean = false;
    export let validateOnDirty: boolean = false;
    export let id = `dropdown_${name}`;
    export let validators: any = [];
    export const validate = async () => {
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
    $: {
        value; // whenever value will be changed this will run
        if (validateOnDirty === true && isDirty === true) {
            validate().catch(() => undefined);
        }
    }
</script>

<FieldTemplate {id} {label} {error} cssClass={containerCssClass}>
    <select
        {name}
        bind:value
        {id}
        slot="field"
        class={cssClass}
        class:validation_error={error}
        style={inputStyle}
        on:change={() => {
            isDirty = true;
            validate();
        }}
    >
        {#if placeholder}
            <option value="">{placeholder}</option>
        {/if}
        {#each options as option}
            <option value={option.value}>{option.name}</option>
        {/each}
    </select>
</FieldTemplate>

<style></style>
