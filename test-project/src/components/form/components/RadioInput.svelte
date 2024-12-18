<script lang="ts">
    'use strict';
    import { get } from 'svelte/store';
    export let radioCounter: any;
    export let group: string = '';
    export let label: string | null = null;
    export let cssClass: string = '';
    export let inputStyle: string = '';
    export let containerCssClass: string = '';
    export let error: string | null = null;
    export let name: string | null = null;
    export let value: string | null = null;
    $: id = `${name}${get(radioCounter)}`;
    radioCounter.update((n: number) => n + 1);
</script>

<li class={containerCssClass}>
    <input
        style={inputStyle}
        bind:group
        type="radio"
        {id}
        {name}
        {value}
        class={cssClass}
        class:validation_error={error}
    />
    <label for={id}>
        {label}
    </label>
</li>
