import {
    locale,
    ROUTES_STATIC_TRANSLATIONS,
    ROUTES_TRANSLATION_KEY,
    supportedLocales,
    translations
} from '$lib/translations';
import { goto } from '$app/navigation';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import {
    PUBLIC_BACKOFFICE,
    PUBLIC_CURRENT_PHASE,
    PUBLIC_ENABLE_LOCALE_BASED_HOST,
    PUBLIC_HIDE_DEFAULT_LANG_SLUG,
    PUBLIC_MEDIA_ENDPOINT,
    PUBLIC_PHASE_ERROR_REDIRECTION
} from '$env/static/public';
import type { OptionType } from '@eqs/cms-svelte-irtools';
import slugify from 'slugify';
import { URL_REDIRECTS } from '$lib';
import { phases } from '$utils/constants';
import { base } from '$app/paths';
import { getDefaultLocale, getHostByLocale } from './default-locale';
import { getMenuItems } from '$utils/menu';

import DOMPurify from 'dompurify';

export const sanitizeContent = (content: any, config?: any) => {
    return DOMPurify.sanitize(content, config || { USE_PROFILES: { html: true } });
};

export type NumberFormatFunction = (value: number, options?: Intl.NumberFormatOptions) => string;

export const formatDate = (
    date: Date,
    options: Intl.DateTimeFormatOptions = {},
    dateFormat: { [key: string]: { [key: string]: string } } = {}
) => {
    const lang: string = locale.get();
    const formattedDateParts: string[] = [];
    const format: { [key: string]: string } = {};
    const delimiter: { [key: string]: string } = {};

    // Extracts the date format and delimiter from the dateFormat object based on the specified language.
    if (dateFormat[lang]) {
        Object.keys(dateFormat[lang]).forEach((key) => {
            format[key] = dateFormat[lang][key].replace(/[.,\s-/:]+(?:at\s|Uhr|um\s)?$/, '');
            delimiter[key] = dateFormat[lang][key].replace(format[key], '');
        });
    }
    const formatter = new Intl.DateTimeFormat(lang, {
        year: 'numeric',
        month: lang === 'de' && format['month'] === 'short' ? 'short' : 'long',
        day: '2-digit',
        ...format,
        ...options
    });
    if (Object.keys(dateFormat).length === 0) {
        //Return default date format
        return formatter.format(date);
    }
    // Format the date in the same order as specified in the 'format' object and include delimiters.
    const formattedParts = formatter.formatToParts(date);
    for (const key of Object.keys(format)) {
        const part = formattedParts.find((part) => part.type === key);
        if (part) {
            const value = lang === 'de' && key === 'month' && format[key] === 'short' ? part.value.replace('.', '') : part.value;
            formattedDateParts.push(value, delimiter[key]);
        }
    }

    // If it is 12Hr then show AM/PM
    const dayPeriodPart = formattedParts.find((part) => part.type === 'dayPeriod');
    if (dayPeriodPart) {
        formattedDateParts.push(dayPeriodPart.value);
    }

    // If the timeZoneName is available, display it at the end.
    const timeZoneNamePart = formattedParts.find((part) => part.type === 'timeZoneName');
    if (timeZoneNamePart) {
        formattedDateParts.push(' ' + timeZoneNamePart.value);
    }

    return formattedDateParts.join('');
};

export type SlugOptions = {
    replacement?: string;
    remove?: RegExp;
    lower?: boolean;
    strict?: boolean;
    locale?: string;
    trim?: boolean;
};

export const formatTime = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    return Intl.DateTimeFormat(locale.get(), {
        timeStyle: 'medium',
        ...(options || {})
    }).format(date);
};

/*export const formatDateTime = (date: Date, options?: Intl.DateTimeFormatOptions) => {
	return Intl.DateTimeFormat(locale.get(), {
		dateStyle: 'long',
		timeStyle: 'medium',
		...(options || {})
	}).format(date);

};*/
export const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(locale.get() || 'en', {
        maximumFractionDigits: options?.maximumFractionDigits,
        minimumFractionDigits: options?.minimumFractionDigits,
        ...(options || {})
    }).format(number);
};

/**
 * It will give you localized version of
 * the given pathname in target locale.
 *
 * Use this function whenever you need a localized url whether
 * in a tag or anywhere else.
 *
 * @param sourcePathname
 * @param targetLocale
 * @returns
 */
export const getLocalizedPathname = (
    sourcePathname: string,
    targetLocale: string,
    pathTranslationGetter = getPathTranslation
) => {
    sourcePathname = removeBasePath(sourcePathname);
    const tt = fillVariablesInPathTranslations(
        ROUTES_STATIC_TRANSLATIONS?.[targetLocale] || {},
        sourcePathname
    );
    const langSlug = getLangSlug(targetLocale);
    targetLocale = langCodeFormatter(targetLocale);
    const sourceInternalPath = (findInternalPathname(sourcePathname, pathTranslationGetter) ||
        sourcePathname) as string;
    const targetInternalPath = replaceLocaleInPathname(sourceInternalPath, targetLocale);
    const localizedPathname = Object.entries(tt)
        .filter(
            ([, internalPath]) =>
                internalPath === targetInternalPath ||
                internalPath === `/${getDefaultLocale()}${targetInternalPath}`
        )
        .pop()?.[0];

    if (localizedPathname) {
        return prependBasePath(
            localizedPathname.replace(new RegExp(`^/${getDefaultLocale()}`), langSlug)
        );
    }

    return prependBasePath(targetInternalPath);
};

/**
 * It will give you localized URL object
 *
 * It is very similar to getLocalizedPathname but its for URL objects
 *
 * @param url
 * @param targetLocale
 * @returns
 */
export const getLocalizedUrl = (
    url: URL,
    targetLocale: string,
    pathTranslationGetter = getPathTranslation
) => {
    const localizedPathname = getLocalizedPathname(
        removeBasePath(url.pathname),
        targetLocale,
        pathTranslationGetter
    );
    const newUrl = new URL(url);
    newUrl.pathname = prependBasePath(localizedPathname);
    if (PUBLIC_ENABLE_LOCALE_BASED_HOST !== 'true') {
        return newUrl;
    }
    const targetHost = getHostByLocale(targetLocale);
    const currentHost = url.host;
    if (!targetHost || currentHost === targetHost) {
        return newUrl;
    }
    newUrl.host = targetHost;
    if (PUBLIC_HIDE_DEFAULT_LANG_SLUG === 'true') {
        newUrl.pathname = removeLocaleFromPathname(newUrl.pathname);
    }
    return newUrl;
};

/**
 * It extracts locale value from url.
 *
 * use this function throughout the app whenever you
 * need to get locale from url
 *
 * @param pathname
 * @returns
 */
export const extractLocaleFromPathname = (pathname: string) => {
    const locales = supportedLocales.join('|');
    const localeRegex = new RegExp(`^/(${locales})(/|$)`);
    const match = removeBasePath(pathname).match(localeRegex);
    if (match) {
        return match[1];
    }
};

/**
 * It will give you internal pathname with which
 * sveltekit serves the right directory content.
 *
 * @param sourcePathname
 */
export const findInternalPathname = (
    sourcePathname: string,
    pathTranslationGetter = getPathTranslation
) => {
    const langInSourcePath = extractLocaleFromPathname(sourcePathname) || getDefaultLocale();
    const internalPath = pathTranslationGetter(sourcePathname, langInSourcePath);
    if (internalPath) {
        return internalPath;
    }
};

/**
 * give a pathname and locale and it will
 * give you its internal path if available
 * @param pathname
 * @param locale
 * @returns
 */
export const getPathTranslation = (pathname: string, locale: string): string | undefined => {
    return getPathTranslationWithDynamicPath(
        pathname,
        locale,
        getNormalizedRouteTranslations(locale)
    );
};

export const getPathTranslationWithDynamicPath = (
    pathname: string,
    locale: string,
    routeTranslations: Record<string, string>
) => {
    const filledTranslations = fillVariablesInPathTranslations(routeTranslations, pathname);
    return filledTranslations[pathname] || filledTranslations[`/${locale}${pathname}`];
};

export const getNormalizedRouteTranslations = (locale: string) => {
    const tt: Record<string, string> = translations.get()?.[locale] || {};
    return Object.entries(tt)
        .filter(([key]) => key.startsWith(`${ROUTES_TRANSLATION_KEY}.`))
        .map(([key, value]) => {
            return [key.replace(`${ROUTES_TRANSLATION_KEY}.`, ''), value];
        })
        .reduce((result, [key, value]) => {
            result[key] = value;
            return result;
        }, {} as Record<string, string>);
};

export const fillVariablesInPathTranslations = (
    tt: Record<string, string>,
    sourcePathname: string
) => {
    let sourceLocale = extractLocaleFromPathname(sourcePathname);
    if (!sourceLocale) {
        sourceLocale = getDefaultLocale();
        sourcePathname = `${sourceLocale}${sourcePathname}`;
    }
    // fill variables in translations
    return Object.entries(tt)
        .map(([keyPath, valuePath]) => {
            const dynamicSegments = extractDynamicSegments(sourcePathname, keyPath);
            const filledKeyPath = fillDynamicSegments(keyPath, dynamicSegments);
            const filledValuePath = fillDynamicSegments(valuePath as string, dynamicSegments);
            return [filledKeyPath, filledValuePath];
        })
        .reduce((filledTranslations, [filledKeyPath, filledValuePath]) => {
            filledTranslations[filledKeyPath] = filledValuePath;
            return filledTranslations;
        }, {} as Record<string, string>);
};

export const extractDynamicSegments = (pathname: string, pattern: string) => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const patternSegments = pattern.split('/').filter(Boolean);

    const dynamicSegments: Record<string, string> = {};

    patternSegments.forEach((segment, index) => {
        if (segment.startsWith('[') && segment.endsWith(']')) {
            const key = segment.slice(1, -1);
            dynamicSegments[key] = pathSegments[index];
        }
    });

    return dynamicSegments;
};

export const fillDynamicSegments = (pathname: string, dynamicSegments: Record<string, string>) => {
    let filledPath = pathname;
    Object.entries(dynamicSegments).forEach(([key, value]) => {
        filledPath = filledPath.replace(`[${key}]`, value);
    });
    return filledPath;
};

/**
 * this function guess the correct pathname by looping through
 * all available route translations.
 * e.g
 * if sourcepathname is /en/dokumente it will give /en/documents
 * @param sourcePathname
 * @returns
 */
export const guessInternalPathname = (
    sourcePathname: string,
    pathTranslationGetter = getPathTranslation
) => {
    sourcePathname = removeBasePath(sourcePathname);
    let internalPathname = findInternalPathname(sourcePathname, pathTranslationGetter);
    if (internalPathname) {
        return internalPathname;
    }
    internalPathname = supportedLocales
        .map((locale) => {
            const newSourcePathname = replaceLocaleInPathname(sourcePathname, locale);
            return findInternalPathname(newSourcePathname, pathTranslationGetter);
        })
        .filter((p) => p)
        .pop();
    if (!internalPathname) {
        return; // early exit
    }
    const langInSourcePath = extractLocaleFromPathname(sourcePathname) || getDefaultLocale();
    internalPathname = replaceLocaleInPathname(internalPathname, langInSourcePath);
    return prependBasePath(internalPathname);
};

/**
 * it replaces local value in the url
 *
 * @param pathname
 * @param targetLocale
 * @returns
 */
export const replaceLocaleInPathname = (pathname: string, targetLocale: string) => {
    let langInPathname = extractLocaleFromPathname(pathname);
    const langSlug = getLangSlug(targetLocale);

    if (!langInPathname) {
        pathname = `${langSlug}${pathname}`;
        langInPathname = getDefaultLocale();
    }
    const localeOnlyPattern = new RegExp(`^/${langInPathname}(/?$)`);
    if (localeOnlyPattern.test(pathname)) {
        return targetLocale === getDefaultLocale() ? `/` : `/${targetLocale}`;
    }
    return pathname.replace(new RegExp(`^/${langInPathname}`), langSlug);
};

export const toSnakeCase = (inputString: string) => {
    return inputString.replace(/[\s_]/g, '-').toLowerCase();
};

export const getLocalStorageStore = <T>(key: string, initialValue: T) => {
    const value = browser && localStorage?.getItem(key);
    const store = writable<T>(JSON.parse(value || 'null') || initialValue);
    const unsub = store.subscribe((v) => browser && localStorage?.setItem(key, JSON.stringify(v)));
    return { store, stopUpdatingLocalStorage: unsub };
};

export const generateMediaUrl = (path: string): string | null => {
    if (!path) {
        return null;
    }

    if (path.charAt(0) === '/') {
        path = path.slice(1);
    }
    return `${PUBLIC_MEDIA_ENDPOINT}${path}`;
};

export const findClosestYear = (
    uniqueYearsData: OptionType[],
    currentYear: number
): string | null => {
    const availableYears = uniqueYearsData
        .map((item) => parseInt(item.value))
        .filter((year) => year < currentYear);
    return availableYears.length > 0 ? Math.max(...availableYears).toString() : null;
};

export const createSlug = (input: string, options?: SlugOptions | string) => {
    return slugify(input, options);
};

export const createURLFriendlySlug = (input: string, locale: string, maxLengthInWords = 15) => {
    // Split the segment into words
    const words = input.split(/\s+/);
    const limitedWords = words.slice(0, maxLengthInWords).join(' ');
    return createSlug(limitedWords, {
        locale,
        lower: true,
        trim: true,
        strict: true,
        replacement: '-',
        remove: undefined
    });
};
export const guessRedirectInternalPathname = (url: URL) => {
    try {
        let redirectRouteWithParams = `${url.pathname}`;
        if (url.searchParams.size > 0) {
            redirectRouteWithParams += `?${url.searchParams.toString()}`;
        }

        if (!URL_REDIRECTS.redirect[redirectRouteWithParams]) {
            return null;
        }
        let redirectedUrl = URL_REDIRECTS.redirect[redirectRouteWithParams];
        if (!isValidUrl(redirectedUrl)) {
            if (redirectedUrl.startsWith('/')) {
                redirectedUrl = redirectedUrl.slice(1);
            }
            const tempUrl = new URL(`${url.origin}/${redirectedUrl}`);
            return tempUrl.pathname;
        } else {
            return '/';
        }
    } catch (e) {
        console.log(e);
    }
    return null;
};

export const doUrlRedirection = (url: URL) => {
    if (!browser) {
        return false;
    }
    try {
        let redirectRouteWithParams = `${url.pathname}`;
        if (url.searchParams.size > 0) {
            redirectRouteWithParams += `?${url.searchParams.toString()}`;
        }

        if (!URL_REDIRECTS.redirect[redirectRouteWithParams]) {
            return false;
        }

        let redirectedUrl = URL_REDIRECTS.redirect[redirectRouteWithParams];
        if (isValidUrl(redirectedUrl)) {
            window.location.href = redirectedUrl;
        } else {
            if (redirectedUrl.startsWith('/')) {
                redirectedUrl = redirectedUrl.slice(1);
            }
            const tempUrl = new URL(`${url.origin}/${redirectedUrl}`);
            tempUrl.searchParams.append('url_redirect', 'true');
            const redirectUrl = `${tempUrl.pathname}?${tempUrl.searchParams.toString()}`;
            goto(redirectUrl);
        }
        return true;
    } catch (e) {
        console.log(e);
    }
    return false;
};

const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
};

export const openLinkInNewTab = (link: string, params?: URLSearchParams) => {
    if (params) {
        link = `${link}?${params.toString()}`;
    }
    window.open(link, '_blank');
};

export const openLinkInSameTab = (link: string, params?: URLSearchParams) => {
    if (params) {
        link = `${link}?${params.toString()}`;
    }
    window.open(link, '_self');
};

/**
 * Show placeholder image on error
 * @param event
 */

export const handleImageError = (event: Event, placeholder: string | null = null) => {
    if (event.target instanceof HTMLImageElement) {
        placeholder || (placeholder = base + '/images/placeholder.png');
        event.target.src = placeholder;
    }
};

export const extractInfoFromMediaPath = (path: string) => {
    const url = new URL(`http://localhost/${path}`);

    const pathParts = url.pathname.split('/').filter(function (item) {
        return item.length;
    });
    return {
        module: pathParts[1] ?? '',
        uuid: pathParts[2] ?? '',
        filename: pathParts.pop()
    };
};

export const getCurrentPhase = () => {
    if (typeof window !== 'undefined') {
        const currentPhase = sessionStorage.getItem('currentPhase');
        return currentPhase !== null ? currentPhase : PUBLIC_CURRENT_PHASE;
    }
    return PUBLIC_CURRENT_PHASE;
};

export const checkPhaseAndRedirect = (phase: string) => {
    if (phases[phase] > phases[PUBLIC_CURRENT_PHASE]) {
        if (typeof window !== 'undefined') {
            window.location.href = PUBLIC_PHASE_ERROR_REDIRECTION;
        }
    }
};

/**
 * Decodes a string containing HTML entities into its corresponding characters.
 *
 * @param {string} text - The string containing HTML entities to be decoded.
 * @returns {string} - The decoded string with HTML entities replaced by their corresponding characters.
 *
 */
export const decodeHTMLEntities = (text: string) => {
    const entities: { [key: string]: string } = {
        '&nbsp;': ' ',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': "'",
        '&cent;': '¢',
        '&pound;': '£',
        '&yen;': '¥',
        '&euro;': '€',
        '&copy;': '©',
        '&reg;': '®',
        '&Aacute;': 'Á',
        '&aacute;': 'á',
        '&Acirc;': 'Â',
        '&acirc;': 'â',
        '&Agrave;': 'À',
        '&agrave;': 'à',
        '&Auml;': 'Ä',
        '&auml;': 'ä',
        '&Ccedil;': 'Ç',
        '&ccedil;': 'ç',
        '&Eacute;': 'É',
        '&eacute;': 'é',
        '&Ecirc;': 'Ê',
        '&ecirc;': 'ê',
        '&Egrave;': 'È',
        '&egrave;': 'è',
        '&Euml;': 'Ë',
        '&euml;': 'ë',
        '&Iacute;': 'Í',
        '&iacute;': 'í',
        '&Icirc;': 'Î',
        '&icirc;': 'î',
        '&Igrave;': 'Ì',
        '&igrave;': 'ì',
        '&Iuml;': 'Ï',
        '&iuml;': 'ï',
        '&Ntilde;': 'Ñ',
        '&ntilde;': 'ñ',
        '&Oacute;': 'Ó',
        '&oacute;': 'ó',
        '&Ocirc;': 'Ô',
        '&ocirc;': 'ô',
        '&Ograve;': 'Ò',
        '&ograve;': 'ò',
        '&Ouml;': 'Ö',
        '&ouml;': 'ö',
        '&Uacute;': 'Ú',
        '&uacute;': 'ú',
        '&Ucirc;': 'Û',
        '&ucirc;': 'û',
        '&Ugrave;': 'Ù',
        '&ugrave;': 'ù',
        '&Uuml;': 'Ü',
        '&uuml;': 'ü',
        '&Yacute;': 'Ý',
        '&yacute;': 'ý',
        '&Yuml;': 'Ÿ',
        '&yuml;': 'ÿ',
        '&szlig;': 'ß'
        // Add more as needed
    };

    return text.replace(/&[^;]+;/g, (match) => entities[match] || match);
};

/**
 * Sanitizes a filename by removing unsupported characters.
 * The function decodes HTML entities in the filename, removes HTML tags, replaces whitespace with dashes, and removes non-alphanumeric characters.
 * It also replaces multiple dashes with a single dash and converts the filename to lowercase.
 * @param filename A string representing the filename to be sanitized.
 * @returns A sanitized filename.
 */
export const sanitizeFilename = (filename: string) => {
    filename = decodeHTMLEntities(filename)
        .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
        .replace(/\s+/g, '-') // Replace whitespace with dashes
        .replace(/[^a-zA-Z0-9-_áéíóúÁÉÍÓÚñÑäöüÄÖÜßçÇàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãõÃÕ]/g, '') // Remove non-alphanumeric characters except special characters for certain languages
        .replace(/-+/g, '-') // Replace multiple dashes with a single dash
        .toLowerCase();
    return filename;
};

export const getLangSlug = (lang: string | null | undefined) => {
    lang = langCodeFormatter(lang);
    if (PUBLIC_HIDE_DEFAULT_LANG_SLUG?.toLowerCase() === 'true' && lang === getDefaultLocale()) {
        return ``;
    }
    return supportedLocales.length > 1 ? `/` + (lang ?? getDefaultLocale()) : ``;
};

export const removeLocaleFromPathname = (pathname: string) => {
    pathname = removeBasePath(pathname);
    const locale = extractLocaleFromPathname(pathname);
    return prependBasePath(pathname.replace(new RegExp(`^/${locale}(/|$)`), ''));
};

export const langCodeFormatter = (lang: string | null | undefined) => {
    return lang?.toLowerCase() || locale.get().toLowerCase();
};

export const getIconClass = (ext = '') => {
    switch (ext) {
        case 'pdf':
            return 'icon-master-file-pdf';
        case 'xls':
        case 'xlsx':
        case 'csv':
            return 'icon-master-file-excel';
        case 'html':
            return 'icon-master-code';
        case 'video':
            return 'icon-master-youtube';
        case 'webcast':
            return 'icon-master-play';
        case 'link':
            return 'icon-master-link';
        case 'jpg':
        case 'img':
            return 'icon-master-images';
        default:
            return 'icon-master-download';
    }
};

export const getDomPathOfElement = (element: Element): string => {
    const path: string[] = [];
    let currentElement: Element | null = element;

    while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
        const tagName = currentElement.nodeName.toLowerCase();
        const index = getElementChildIndex(currentElement);
        path.unshift(`${tagName}:nth-of-type(${index + 1})`);
        currentElement = currentElement.parentElement;
    }

    return path.join(' > ');
};

/**
 * It will tell what is the index number of this
 * element in the children array of its parent.
 * In short what is its position with respekt to
 * its siblings
 * @param element
 * @returns
 */
export const getElementChildIndex = (element: Element): number => {
    let index = 0;
    Array.from(element.parentElement?.children || []).map((el, i) => {
        if (el === element) {
            index = i;
        }
    });
    return index;
};

/**
 * this function does nothing.
 * it can be used for multiple purposes.
 * One usage is to define reactive block deps
 *
 * For Example:
 * ```
 * $: {
 *    noop(category, year, locale);
 * }
 * ```
 * @param deps
 */
export const noop = (..._args: any[]) => {
    /* nothing to do */
};

/**
 * Redirects to a 404 page if the current language is in the hideOnLang array.
 */
export const hideIfLangNotFound = (url: any) => {
    const currentLang = extractLocaleFromPathname(url.pathname) || getDefaultLocale();
    const menuItems = getMenuItems(currentLang);

    let path = url.pathname;
    if (PUBLIC_HIDE_DEFAULT_LANG_SLUG === 'true') {
        path = path.replace(`/${getDefaultLocale()}`, '');
    } else {
        path =
            extractLocaleFromPathname(url.pathname) === undefined
                ? `/${getDefaultLocale()}${path}`
                : path;
    }
    const hideOnLang = menuItems.find((menuItem) => menuItem.link === path)?.hideOnLang || [];
    // Check if the current language is in the hideOnLang array
    if (hideOnLang.includes(currentLang)) {
        return { redirect: true, hideOnLang: hideOnLang };
    }
    return { redirect: false, hideOnLang: hideOnLang };
};

export const postMessageToParentWindow = (payload: any): void => {
    if (!browser) {
        return;
    }
    window.parent.postMessage(payload, PUBLIC_BACKOFFICE);
};

/**
 * Removes the base path from a given pathname, handling all scenarios.
 * @param {string} pathname - The full pathname to process
 * @returns {string} The pathname with the base path removed, always starting with '/'.
 */
export const removeBasePath = (pathname: string): string => {
    let basePath = base || '';

    // Normalize basePath: remove leading and trailing slashes
    basePath = basePath.replace(/^\/+|\/+$/g, '');

    // Normalize pathname: ensure it starts with a single '/'
    pathname = '/' + pathname.replace(/^\/+/, '');

    // If basePath is empty, just return the normalized pathname
    if (!basePath) {
        return pathname;
    }

    // Create a regex to match the basePath at the start of the pathname
    const basePathRegex = new RegExp(`^/?${basePath.replace(/\//g, '/')}/?`);

    // Remove the basePath if it's at the start of the pathname
    const cleanedPathname = pathname.replace(basePathRegex, '/');

    // Ensure the result starts with a slash and doesn't have double slashes
    return cleanedPathname.replace(/\/+/g, '/') || '/';
};

/**
 * Prepends the base path to a given pathname if it's not already present,
 * avoiding double slashes.
 * @param {string} pathname - The pathname to process.
 * @returns {string} The pathname with the base path prepended.
 */
/**
 * Prepends the base path to a given pathname if it's not already present,
 * avoiding double slashes and handling edge cases.
 * @param {string} pathname - The pathname to process.
 * @returns {string} The pathname with the base path prepended, always starting with '/'.
 */
export const prependBasePath = (pathname: string): string => {
    let basePath = base || '';

    // Normalize basePath: remove leading and trailing slashes
    basePath = basePath.replace(/^\/+|\/+$/g, '');

    // Normalize pathname: remove leading slash if present
    pathname = pathname.replace(/^\/+/, '');

    // Create a regex to check if pathname already starts with basePath
    const basePathRegex = new RegExp(`^${basePath.replace(/\//g, '/')}(/|$)`);

    // If pathname already starts with basePath, just ensure it starts with a slash
    if (basePathRegex.test(pathname)) {
        return '/' + pathname;
    }

    // Combine parts
    let result = basePath ? '/' + basePath : '';
    result += pathname ? '/' + pathname : '';

    // Ensure the result starts with a slash and doesn't have double slashes
    result = result.replace(/\/+/g, '/');
    return result || '/';
};

/*
 * This is a debounce function that will
 * create debounce functionality around your own provided
 * function.
 *
 * Example Usage:
 * ```javascript
 * let searchTerm = '';
 * const search = async (term) => {
 *      // Make API call here
 * };
 * const debouncedSearch = debounce(search);
 * const debouncedSearch300 = debounce(search, 300);
 * const debouncedSearch500 = debounce(search, 500)
 * $: {
 *      debouncedSearch(searchTerm); // will be called after 100 miliseconds
 *      debouncedSearch300(searchTerm); // after 300 milisecond
 *      debouncedSearch500(searchTerm); // after 500 milisecond
 * }
 * ```
 * @param func
 * @param delay. Default value is 10 milisecond
 * @returns
 */
export const debounce = (func: (...args: any[]) => any, delay: number = 10) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export const addDefaultListRestriction = (
    combinedQueryParams: URLSearchParams,
    newsType: string
) => {
    let key = 'restriction_without_restriction[]';
    if (newsType === 'news') {
        key = 'without_restriction[]';
    }
    combinedQueryParams.append(key, 'do_not_show_on_website');

    return combinedQueryParams.toString();
};
