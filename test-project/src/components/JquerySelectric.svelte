<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import jQuery from 'jquery';
    import { t } from '$lib/translations';
    export let options: Array<{ name: string; value: string }>;
    export let name: string | null = null;
    export let value: string = '';
    export let placeholder: string | boolean = false;
    export let cssClass: string | null = null;
    export let id: string | null = null;
    export let multiple: boolean = false;
    let selectElement: HTMLSelectElement;
    onMount(async () => {
        if (typeof window !== 'undefined') {
            try {
                const selectricModule = await import('selectric');
                // Manually attach Selectric to jQuery if necessary
                if (selectricModule.default) {
                    selectricModule.default(jQuery);
                }
                let values: string[] = [];
                (jQuery(selectElement) as any).selectric({
                    multiple: {
                        keepMenuOpen: false
                    },
                    onInit: function (element: HTMLSelectElement) {
                        const options = jQuery(element).find('option');

                        options.each(function () {
                            let val: string | undefined = jQuery(this).val();
                            if (val) {
                                values.push(val);
                            }
                        });
                    }
                });
                jQuery(selectElement).on('change', function () {
                    let selected: string = jQuery(this).val() as string;
                    if (Array.isArray(selected)) {
                        if (
                            selected.length === 0 ||
                            selected.some((item) => item.includes(';')) ||
                            selected.includes('')
                        ) {
                            value = values.join(';');
                            (jQuery(selectElement) as any).val(value).selectric('refresh');
                        } else {
                            value = selected;
                        }
                    } else {
                        value = selected;
                    }
                });
            } catch (error) {
                console.error('Error initializing Selectric:', error);
            }
        }
    });
    afterUpdate(async () => {
        if (
            typeof window !== 'undefined' &&
            typeof (jQuery(selectElement) as any).selectric === 'function'
        ) {
            (jQuery(selectElement) as any).selectric('refresh');
            (jQuery(selectElement) as any).val(value).selectric('refresh');
        }
    });
</script>

<select {name} bind:this={selectElement} {id} class={cssClass} {multiple}>
    {#if placeholder}
        <option value="">{placeholder}</option>
    {/if}
    {#each options as option}
        <option value={option.value}>{$t(option.name) || option.name}</option>
    {/each}
</select>
