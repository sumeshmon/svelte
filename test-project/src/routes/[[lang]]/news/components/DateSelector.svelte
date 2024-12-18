<script lang="ts">
    import { t } from '$lib/translations';
    import { DateInput } from 'date-picker-svelte';
    export let from: Date | null = null;
    export let till: Date | null = null;
    let validationError: string = '';
</script>

<div class="mb-2 d-inline-block date-picker__container">
    <div class="date-picker__from d-inline-block">
        <div>
            <DateInput
                bind:value={from}
                placeholder={$t(`news.datePlaceholderFrom`)}
                format={$t(`news.dateFilterFormat`)}
            />
        </div>
    </div>
    <div class="date-picker__till d-inline-block">
        <div>
            <DateInput
                bind:value={till}
                placeholder={$t(`news.datePlaceholderTill`)}
                format={$t(`news.dateFilterFormat`)}
            />
        </div>
    </div>
    <div class="date-picker-validation-error">{validationError}</div>
</div>
