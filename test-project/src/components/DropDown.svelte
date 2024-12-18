<script lang="ts">
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import { t } from '$lib/translations';
    export let options: OptionType[] = [];
    export let value: string = '';
    let isOpen: boolean = false;
    let optionName: string = '';
    $: if (options.length > 0) {
        const item = options.find((element) => element.value === value);
        optionName = item ? $t(item.name) || item.name : $t(options[0]?.name) || options[0]?.name;
    }
</script>

<div class="dropdown">
    <button
        type="button"
        class="dropdown__selected"
        on:click={() => {
            isOpen = !isOpen;
        }}
    >
        {optionName}
        <svg
            class="dropdown__icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    </button>

    <!-- Dropdown options -->
    {#if isOpen}
        <div class="dropdown__options">
            {#each options as option}
                <button
                    type="button"
                    class="dropdown__option"
                    on:click={() => {
                        value = option.value;
                        isOpen = false;
                    }}>{$t(option.name) || option.name}</button
                >
            {/each}
        </div>
    {/if}
</div>
