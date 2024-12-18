<script lang="ts">
    export let id: string;
    export let label: string | null = null;
    export let error: string | null = null;
    export let cssClass: string = '';
</script>

<div class={cssClass}>
    <slot name="label">
        {#if label}
            <label for={id}> {label} </label>
        {/if}
    </slot>
    <slot name="field" />
    <slot name="error">
        {#if error}
            <p class="error">{error}</p>
        {/if}
    </slot>
</div>

<style>
</style>
