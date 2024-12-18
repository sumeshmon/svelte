<script context="module">
    import { setContext, getContext } from 'svelte';
    import { writable } from 'svelte/store';

    const key = {};

    export const getAccordionContext = () => getContext(key);
    export const createAccordionContext = () => {
        const current = writable(null);
        const context = { current };
        setContext(key, context);

        return context;
    };
</script>

<script>
    import { slide } from 'svelte/transition';
    export let defaultOpen = false;
    export let independent = false;
    export let className = 'accordion';
    let active = false;
    const { current } = getAccordionContext();
    const currentKey = {};

    createAccordionContext(); // Context for children

    function handleClick() {
        active = !active;
        if (active) {
            $current = currentKey;
        }
    }

    $: if ($current !== currentKey) {
        if (!independent) {
            active = defaultOpen ? ((defaultOpen = false), true) : false;
        } else {
            active = defaultOpen ? ((defaultOpen = false), true) : active;
        }
    }
</script>

<div class={className}>
    <div class="{className}__item">
        <div class="{className}__heading">
            <button
                type="button"
                class="{className}__title"
                on:click={handleClick}
                aria-expanded={active}
            >
                <slot name="title" />
            </button>
        </div>
        {#if active}
            <div transition:slide>
                <div class="{className}__body">
                    <slot name="content" />
                </div>
            </div>
        {/if}
    </div>
</div>
