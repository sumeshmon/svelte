<script lang="ts">
    import Maintenance from '$components/Maintenance.svelte';
    import { browser } from '$app/environment';
    export let data;
    import { onMount, onDestroy } from 'svelte';
    import { isPreviewMode } from '$utils/website-content/constants';
    import { goto } from '$app/navigation';
    import { postMessageToParentWindow } from '$utils/ops.js';
    import { page } from '$app/stores';
    import { afterUpdate } from 'svelte';

    onMount(() => {

        // custom menu
        const customMenuItems = document.querySelectorAll('.custom-menu > li'); // NodeList of menu items
        customMenuItems.forEach((menuItem) => {
            console.log(menuItem);
            
            const submenu = menuItem.querySelector('.customSubmenu') as HTMLElement | null;

            menuItem.querySelector('a')?.addEventListener('click', (event) => {
                event.preventDefault();

                // Close all other submenus
                customMenuItems.forEach((otherMenuItem) => {
                    if (otherMenuItem !== menuItem) {
                        otherMenuItem.classList.remove('custom-open');
                        const otherSubmenu = otherMenuItem.querySelector('.customSubmenu') as HTMLElement | null;
                        if (otherSubmenu) {
                            otherSubmenu.style.display = 'none';
                        }
                    }
                });

                // Handle menu item toggle
                if (submenu) {
                    // Toggle submenu for items with a submenu
                    menuItem.classList.toggle('custom-open');
                    submenu.style.display = menuItem.classList.contains('custom-open') ? 'block' : 'none';
                } else {
                    // Simply toggle the class for items without a submenu
                    menuItem.classList.toggle('custom-open');
                }
            });
        });


        if (browser) {
            document.documentElement.lang = data.lang;
        }
        if (data.pageNotFound) {
            goto('/404');
        }
        if (isPreviewMode()) {
            postMessageToParentWindow('isReady=1&url=' + $page.url);
        }
    });
    onDestroy(() => {
        if (isPreviewMode()) {
            postMessageToParentWindow('isReady=1&url=' + $page.url);
        }
    });

    afterUpdate(() => {
        if (isPreviewMode()) {
            postMessageToParentWindow(`isReady=1&url=${$page.url}`);
        }
    });

    $: if (browser) {
        document.documentElement.lang = data.lang;
    }
</script>

{#if data.maintenance}
    <Maintenance />
{:else}
    <slot />
{/if}
