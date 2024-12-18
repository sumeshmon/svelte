<script lang="ts">
    import { t, locale } from '$lib/translations';
    import { page } from '$app/stores';
    import { getLocalizedPathname } from '$utils/ops';
    import { type MenuItem } from '$utils/menu';
    import { phases } from '$utils/constants';
    import { PUBLIC_CURRENT_PHASE } from '$env/static/public';
    import MenuLevel2 from '$routes/MenuLevel2.svelte';
    export let submenu: MenuItem[];
</script>

<ul class="menu__submenu menu__submenu--1">
    {#each submenu as item}
        {#if !item?.hideOnLang?.includes($locale)}
            {#if phases[item.phase] <= phases[PUBLIC_CURRENT_PHASE]}
                <li class="menu__item menu__submenu--item menu__item--1">
                    <a
                        class="menu__link menu__submenu--link"
                        href={getLocalizedPathname(item.link, $locale)}
                        class:selected={$page.url.pathname.startsWith(
                            getLocalizedPathname(item.link, $locale)
                        )}
                    >
                        {$t(item.title)}
                    </a>
                    {#if item.submenu?.length}
                        <span
                            class="menu__item-arrow menu__item-arrow--1 icon-master-arrow-down-2"
                        />
                        <MenuLevel2 submenu={item.submenu} />
                    {/if}
                </li>
            {/if}
        {/if}
    {/each}
</ul>
