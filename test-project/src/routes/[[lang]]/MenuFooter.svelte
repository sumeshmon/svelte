<script lang="ts">
    import { t, locale } from '$lib/translations';
    import { page } from '$app/stores';
    import { getLocalizedPathname } from '$utils/ops';
    import { getMenuItemsFooter, type MenuItem } from '$utils/menu';
    import { phases } from '$utils/constants';
    import { PUBLIC_CURRENT_PHASE } from '$env/static/public';
    import MenuLevel1 from '$routes/MenuLevel1.svelte';
    let menuItems: MenuItem[] = [];

    $: menuItems = getMenuItemsFooter($locale);
</script>

<ul class="menu">
    {#each menuItems as item}
        {#if !item?.hideOnLang?.includes($locale)}
            {#if phases[item.phase] <= phases[PUBLIC_CURRENT_PHASE]}
                {#if item.submenu?.length}
                    <li
                        class="menu__item menu__item--parent menu__item--0 {item.submenu.some(
                            (sub) =>
                                $page.url.pathname.includes(getLocalizedPathname(sub.link, $locale))
                        )
                            ? 'menu__item--parent-active'
                            : ''}"
                    >
                        <a
                            class="menu__link"
                            href={getLocalizedPathname(item.link, $locale)}
                            class:selected={$page.url.pathname.startsWith(
                                getLocalizedPathname(item.link, $locale)
                            ) ||
                                item.submenu.some((sub) =>
                                    $page.url.pathname.startsWith(
                                        getLocalizedPathname(sub.link, $locale)
                                    )
                                )}
                        >
                            {$t(item.title)}
                        </a>
                        <span
                            class="menu__item-arrow menu__item-arrow--0 icon-master-arrow-down-2"
                        />
                        <MenuLevel1 submenu={item.submenu} />
                    </li>
                {:else}
                    <li class="menu__item menu__item--0">
                        <a
                            class="menu__link"
                            href={getLocalizedPathname(item.link, $locale)}
                            class:selected={$page.url.pathname.startsWith(
                                getLocalizedPathname(item.link, $locale)
                            ) ||
                                $page.url.pathname + $locale ===
                                    getLocalizedPathname(item.link, $locale)}
                        >
                            {$t(item.title)}
                        </a>
                    </li>
                {/if}
            {/if}
        {/if}
    {/each}
</ul>
