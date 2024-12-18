<script lang="ts">
    let counter = 0;
    import { combineValidators } from '../validation';
    import FieldTemplate from './FieldTemplate.svelte';

    export let type: string = 'text';
    export let name: string = `input${type}_${counter++}`;
    export let label: string = '';
    export let inputStyle: string = '';
    export let cssClass: string = '';
    export let containerCssClass: string = '';
    export let placeholder: string | null = null;
    export let value: number | string | null = null;
    export let error: string | null = null;
    export let isDirty: boolean = false;
    export let validateOnDirty: boolean = false;
    export let id: string = `input_${type}_${name}`;
    const typeAction: any = (node: any) => {
        node.type = type;
    };
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
    export const handleInputChange = async () => {
        isDirty = true;
        await validate();
    };
    $: {
        value; // whenever value will be changed this will run
        if (validateOnDirty === true && isDirty === true) {
            validate().catch(() => undefined);
        }
    }
</script>

<FieldTemplate {id} {label} {error} cssClass={containerCssClass}>
    <input
        style={inputStyle}
        use:typeAction
        slot="field"
        bind:value
        {id}
        {name}
        {placeholder}
        class={cssClass}
        class:validation_error={error}
        on:input={handleInputChange}
        on:blur={() => validate()}
    />
</FieldTemplate>

<style>
</style>
