<script lang="ts">
    import { base } from '$app/paths';
    import { t } from '$lib/translations';
    import { onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    export let openBurgerMenu = false;

    const closeMenu = () => {
        openBurgerMenu = false;
    };
    onDestroy(() => {
        if (browser) {
            const links = document.querySelectorAll('.nav-bar__nav a');
            if (links) {
                links.forEach((link) => {
                    link.removeEventListener('click', closeMenu);
                });
            }
        }
    });

    $: if (openBurgerMenu) {
        const links = document.querySelectorAll('.nav-bar__nav a');
        links.forEach((link) => {
            link.addEventListener('click', closeMenu);
        });
    }
</script>

<div class="nav-bar">
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="nav-bar__wrapper">
                    <div class="nav-bar__logo">
                        <a
                            href="{base}/"
                            class="nav-bar__logo-link"
                            title={$t('common.companyName')}
                        >
                            <img
                                src="{base}/images/master-template.png"
                                alt={$t('common.companyName')}
                            />
                        </a>
                    </div>
                    <div class="nav-bar__burger-menu">
                        <button
                            class="nav-bar__burger-menu-button"
                            on:click={() => {
                                openBurgerMenu = true;
                            }}
                        >
                            <span class="icon-master-menu-4" />
                        </button>
                    </div>
                    <div class="nav-bar__nav-wrapper">
                        <nav class="nav-bar__nav" class:active={openBurgerMenu}>
                            <a href="{base}/" class="nav-bar__burger-menu-home">
                                <span class="icon-master-home" />
                            </a>
                            <button
                                class="nav-bar__burger-menu-close"
                                on:click={() => {
                                    openBurgerMenu = false;
                                }}
                            >
                                <span class="icon-master-close-2" />
                            </button>
                            <div class="nav-bar__nav-container">
                                <slot />
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
