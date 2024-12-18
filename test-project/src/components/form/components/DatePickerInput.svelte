<script lang="ts">
    'use strict';
    let counter = 0;
    import { DateInput, localeFromDateFnsLocale } from 'date-picker-svelte';
    import enUS from 'date-fns/locale/en-US';
    import { combineValidators } from '../validation';
    import FieldTemplate from './FieldTemplate.svelte';
    export let value: Date | null = null;
    export let locale: any = enUS;
    export let label: string = '';
    export let cssClass: string = '';
    export let containerCssClass: string = '';
    export let name: string = 'datetime';
    export let id: string = `input_datetime_${name}_${++counter}`;
    export let placeholder: string = '';
    export let format: string = 'yyyy/MM/dd - HH:mm';
    export let validators: any = [];
    export let error: string | null = null;
    export const validate: any = async () => {
        try {
            await combineValidators(...validators)(label, value);
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
</script>

<FieldTemplate {id} {label} {error} cssClass={containerCssClass}>
    <div class={cssClass} slot="field">
        <input hidden {id} value={value?.toISOString()} {name} class:validation_error={error} />
        <DateInput bind:value {placeholder} {format} locale={localeFromDateFnsLocale(locale)} />
    </div>
</FieldTemplate>
