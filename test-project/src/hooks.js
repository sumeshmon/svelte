import { ROUTES_STATIC_TRANSLATIONS } from '$lib/translations';
import {
    extractLocaleFromPathname,
    getPathTranslation,
    getPathTranslationWithDynamicPath,
    guessInternalPathname,
    guessRedirectInternalPathname,
    prependBasePath,
    removeBasePath
} from '$utils/ops';

import {
    PUBLIC_AUTH_JWT_KEY,
    PUBLIC_AUTH_JWT_SECRET,
    PUBLIC_HIDE_DEFAULT_LANG_SLUG
} from '$env/static/public';
import { AuthStrategy, configureAuth, setAuthStrategy } from '@eqs/cms-svelte-irtools';
import { getDefaultLocale } from '$utils/default-locale';

configureAuth({
    key: PUBLIC_AUTH_JWT_KEY,
    secret: PUBLIC_AUTH_JWT_SECRET
});
setAuthStrategy(AuthStrategy.jwt);

/** @type {import('@sveltejs/kit').Reroute} */
export function reroute({ url }) {
    const defaultLocale = getDefaultLocale();
    const shouldHideDefaultLang = PUBLIC_HIDE_DEFAULT_LANG_SLUG?.toLowerCase() === 'true';
    const pathname = removeBasePath(url.pathname);
    const currentLocale = extractLocaleFromPathname(pathname) ?? getDefaultLocale();

    const internalPath = guessInternalPathname(pathname, (path, locale) => {
        const isDefaultLocale = locale === defaultLocale;
        if (shouldHideDefaultLang && isDefaultLocale) {
            path = `/${defaultLocale}${path}`;
        }
        const translatedPath = getPathTranslation(path, locale);
        return (
            translatedPath ||
            getPathTranslationWithDynamicPath(path, locale, ROUTES_STATIC_TRANSLATIONS[locale])
        );
    });

    let redirectInternalPath = guessRedirectInternalPathname(url);
    if (redirectInternalPath) {
        return prependBasePath(redirectInternalPath);
    }

    if (internalPath) {
        return prependBasePath(internalPath);
    }
    if (shouldHideDefaultLang && currentLocale === defaultLocale) {
        return prependBasePath(`/${defaultLocale}${pathname}`);
    }
}
