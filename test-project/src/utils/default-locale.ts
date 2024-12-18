import {
    PUBLIC_DEFAULT_LOCALE,
    PUBLIC_ENABLE_LOCALE_BASED_HOST,
    PUBLIC_HOST_SPECIFIC_DEFAULT_LOCALES
} from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { removeLocaleFromPathname } from './ops';

/**
 * get current default locale
 * @returns
 */
export const getDefaultLocale = () => {
    let defaultLocale = PUBLIC_DEFAULT_LOCALE || 'en';
    if (PUBLIC_ENABLE_LOCALE_BASED_HOST !== 'true' || !browser) {
        return defaultLocale;
    }
    const currentHost = window.location.host;
    try {
        const hostLocaleMap: { [host: string]: string } = JSON.parse(
            PUBLIC_HOST_SPECIFIC_DEFAULT_LOCALES || '{}'
        );
        defaultLocale =
            Object.entries(hostLocaleMap)
                .filter(([host, locale]) => host === currentHost)
                .map(([host, locale]) => locale)
                .pop() || defaultLocale;
    } catch (e) {
        console.error(e);
    }
    return defaultLocale;
};

/**
 * Retrieves default locale of a host.
 * @param host host or domain name
 * @returns
 */
export const getLocaleByHost = (host: string): string | undefined => {
    try {
        const hostLocale = JSON.parse(PUBLIC_HOST_SPECIFIC_DEFAULT_LOCALES || '{}')[host];
        return hostLocale;
    } catch (e) {
        console.error(e);
    }
};

/**
 * Retrieves host/domain with the given locale.
 * @param host domain name
 * @returns
 */
export const getHostByLocale = (locale: string): string | undefined => {
    try {
        const hostLocaleMap = JSON.parse(PUBLIC_HOST_SPECIFIC_DEFAULT_LOCALES || '{}');
        return Object.entries(hostLocaleMap)
            .filter(([host, defaultLocale]) => defaultLocale === locale)
            .map(([host]) => host)
            .pop();
    } catch (e) {
        console.error(e);
    }
};

/**
 * It will redirect only if the current host
 * and new host (determined by locale) are different
 * @param locale
 * @param url
 */
export const redirectToHostWithLocale = (locale: string, url: URL) => {
    const localeHost = getHostByLocale(locale);
    if (!localeHost || localeHost === url.host) {
        return;
    }
    const langHostUrl = new URL(url);
    langHostUrl.host = localeHost;
    langHostUrl.pathname = removeLocaleFromPathname(langHostUrl.pathname);
    throw redirect(301, langHostUrl);
};
