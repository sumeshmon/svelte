<script lang="ts">
    import { t } from '$lib/translations';

    export let loader: boolean = true;
    export let align: string = 'left';
    export let animation: boolean = false;
    export let compRootHtmlEl: HTMLElement | null = null;

    const isWithoutWrapperUsed = 'withoutWrapper' in $$slots;
</script>

{#if loader}
    <div class="loader__wrapper" bind:this={compRootHtmlEl}>
        <div class="loader__content loader--{align}">
            {#if animation}
                <div class="loader">
                    <div class="loader__spinner" />
                </div>
            {:else}
                <p class="loader__text">{$t('common.loading')}</p>
            {/if}
        </div>
    </div>
{/if}

{#if !isWithoutWrapperUsed}
    <div class="loader__slot" class:loader__slot--hide={loader} bind:this={compRootHtmlEl}>
        <slot />
    </div>
{/if}

{#if isWithoutWrapperUsed}
    <slot name="withoutWrapper" />
{/if}
