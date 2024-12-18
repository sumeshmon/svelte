<script lang="ts">
    import { t, locale } from '$lib/translations';
    import { page } from '$app/stores';
    import { getLocalizedPathname } from '$utils/ops';
    import { type MenuItem } from '$utils/menu';
    import { phases } from '$utils/constants';
    import { PUBLIC_CURRENT_PHASE } from '$env/static/public';
    export let submenu: MenuItem[];
</script>

<ul class="menu__submenu menu__submenu--2">
    {#each submenu as item}
        {#if !item?.hideOnLang?.includes($locale)}
            {#if phases[item.phase] <= phases[PUBLIC_CURRENT_PHASE]}
                <li class="menu__item menu__submenu--item menu__item--2">
                    <a
                        class="menu__link menu__submenu--link"
                        href={getLocalizedPathname(item.link, $locale)}
                        class:selected={$page.url.pathname.startsWith(
                            getLocalizedPathname(item.link, $locale)
                        )}
                    >
                        {$t(item.title)}
                    </a>
                </li>
            {/if}
        {/if}
    {/each}
</ul>
