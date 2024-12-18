<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import { t } from '$lib/translations';
    export let showModal: boolean; // boolean
    export let cssClass: string;
    export let showConfirm: boolean = false;
    export let confirmLabel: string = ''; //Translated label

    let dialog: HTMLDialogElement; // HTMLDialogElement

    const onConfirm = () => {
        dispatch('onConfirmSave');
        dialog.close();
    };

    $: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
    bind:this={dialog}
    on:close={() => (showModal = false)}
    on:click|self={() => dialog.close()}
    class={`${cssClass} dialog`}
>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click|stopPropagation class={`${cssClass}--content dialog__content`}>
        <slot name="closeButton" />
        <slot name="header" />
        <slot />
        <!-- svelte-ignore a11y-autofocus -->
        <div class={`${cssClass}--footer dialog__footer`}>
            {#if showConfirm}
                <button
                    autofocus
                    class={`${cssClass}--btn btn btn-outline-secondary`}
                    on:click={() => dialog.close()}>{$t('common.cancel')}</button
                >
                <button
                    on:click={() => onConfirm()}
                    class={`${cssClass}--btn btn btn-outline-primary mx-2`}
                >
                    {#if confirmLabel}
                        {confirmLabel}
                    {:else}
                        {$t('common.confirm')}
                    {/if}
                </button>
            {:else}
                <button
                    autofocus
                    class={`${cssClass}--btn btn btn-outline-secondary`}
                    on:click={() => dialog.close()}>{$t('common.close')}</button
                >
            {/if}
        </div>
    </div>
</dialog>
