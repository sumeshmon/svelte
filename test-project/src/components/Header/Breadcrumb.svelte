<script lang="ts">
    import { t, locale, supportedLocales } from '$lib/translations';
    import { getMenuItems, type MenuItem } from '$utils/menu';
    import {
        getLocalizedPathname,
        getLangSlug,
        getPathTranslation,
        guessInternalPathname,
        langCodeFormatter,
        removeBasePath,
        prependBasePath
    } from '$utils/ops';
    import { ROUTES_STATIC_TRANSLATIONS } from '$lib/translations';

    export let path: string;
    export const title: string | null = null;
    let crumbs: ({ label: string; href: string; route: string } | undefined)[] = [];

    const flattenMenu = (items: MenuItem[]): MenuItem[] => {
        return items.reduce((flat: MenuItem[], item) => {
            const newItem: MenuItem = {
                ...item,
                submenu: undefined,
                link: removeBasePath(item.link)
            };
            flat.push(newItem);
            if (item.submenu) {
                flat.push(...flattenMenu(item.submenu));
            }
            return flat;
        }, []);
    };

    const findMenuItem = (route: string, title: string, flatMenuItems: MenuItem[]) => {
        route = removeBasePath(route);
        const localizedRoute = removeBasePath(getLocalizedRoute(route));

        const internalPath = guessInternalPathname(route, (path, locale) => {
            return getPathTranslation(path, locale) || ROUTES_STATIC_TRANSLATIONS[locale]?.[path];
        });

        const searchTitle = `menu.${title}`;

        const menuItem = flatMenuItems.find((item) => {
            const itemLink = removeBasePath(getLocalizedRoute(item.link));
            const isMatchingLink = [localizedRoute, internalPath].includes(itemLink);
            const isMatchingTitle = item.title === searchTitle;
            return isMatchingLink || isMatchingTitle;
        });

        return menuItem ? { ...menuItem, title: menuItem.title.replace('menu.', '') } : undefined;
    };

    const getLocalizedRoute = (route: string): string => {
        route = removeBasePath(route);
        const segments = route.split('/').filter((segment) => segment.length > 0);
        // If you need capital letters in the language slug, Remove this lowercase from below line
        const currentLocale = langCodeFormatter($locale);

        if (segments.length > 0 && supportedLocales.includes(segments[0])) {
            const translatedRoute = getPathTranslation(route, currentLocale);
            return prependBasePath(translatedRoute || route);
        }
        return prependBasePath(`${currentLocale}${route}`);
    };

    const generateBreadcrumbs = (path: string) => {
        const tokens = path.split('/').filter((token) => token !== '');
        let tokenPath = '';
        let route = '';
        const langSlug = getLangSlug($locale);
        const flatMenuItems: MenuItem[] = flattenMenu(getMenuItems($locale));
        const homeBreadcrumb = {
            label: $t('breadcrumb.home'),
            href: prependBasePath(langSlug),
            route: 'home'
        };

        const breadcrumbs = tokens
            .map((token) => {
                tokenPath += `/${token}`;
                route = token.charAt(0).toUpperCase() + token.slice(1);
                const menuItem = findMenuItem(tokenPath, token, flatMenuItems);
                if (menuItem) {
                    return {
                        label: menuItem.title,
                        href: getLocalizedPathname(menuItem.link, $locale),
                        route
                    };
                }
            })
            .filter(Boolean);

        breadcrumbs.unshift(homeBreadcrumb);
        return breadcrumbs;
    };

    $: crumbs = generateBreadcrumbs(path);
</script>

<div class="breadcrumb">
    <div class="container">
        <div class="row">
            <div class="col-12">
                {#each crumbs as c, i}
                    {#if typeof c !== 'undefined'}
                        {#if !supportedLocales.includes(c.route)}
                            {#if i === crumbs.length - 1}
                                <span class="breadcrumb__link">
                                    {$t('breadcrumb.' + c.label) ||
                                        $t('menu.' + c.label) ||
                                        c.label}
                                </span>
                            {:else}
                                <a class="breadcrumb__link" rel="nofollow" href={c.href}>
                                    {$t('breadcrumb.' + c.label) ||
                                        $t('menu.' + c.label) ||
                                        c.label}
                                </a>
                            {/if}

                            {#if i !== crumbs.length - 1}
                                <span class="icon-master-arrow-right" />&nbsp;
                            {/if}
                        {/if}
                    {/if}
                {/each}
                {#if title}
                    <span>{title}</span>
                {/if}
            </div>
        </div>
    </div>
</div>
