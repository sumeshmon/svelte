import { PUBLIC_ENABLE_LOCALE_BASED_HOST, PUBLIC_MAINTENANCE } from '$env/static/public';
import { supportedLocales } from '$lib/translations';
import { getDefaultLocale, redirectToHostWithLocale } from '$utils/default-locale';
import { extractLocaleFromPathname, hideIfLangNotFound } from '$utils/ops';

export const prerender = false;
export const ssr = false;
export const trailingSlash = 'never';

export const load = ({ url }) => {
    const lang = extractLocaleFromPathname(url.pathname) ?? getDefaultLocale();
    const isUnderMaintenance =
        PUBLIC_MAINTENANCE === '1' || PUBLIC_MAINTENANCE?.toLowerCase() === 'true';

    if (PUBLIC_ENABLE_LOCALE_BASED_HOST === 'true' && lang) {
        // this redirection is here to forcefully
        // redirect to the correct host of the locale
        // if someone explicitly put different locale
        // in url with wrong host.
        // Otherwise, by default urls and pathnames gerenation
        // in our app follow the locales and their linked host.
        redirectToHostWithLocale(lang, url);
    }

    return {
        maintenance: isUnderMaintenance,
        pageNotFound:
            (lang && !supportedLocales.find((x) => x === lang)) ||
            hideIfLangNotFound(url).redirect === true,
        lang: lang
    };
};
