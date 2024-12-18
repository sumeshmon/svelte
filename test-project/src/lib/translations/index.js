import i18n from 'sveltekit-i18n';
import deRoutes from './de/routes.json' assert { type: 'json' };
import enRoutes from './en/routes.json' assert { type: 'json' };

// Define the locales
export const supportedLocales = ['en', 'de'];
export const ROUTES_TRANSLATION_KEY = 'routes';

/**
 * Imports the translation file for a specific locale and key.
 *
 * NOTE: It will first try to import a JSON file if that does not exist
 * then it will try to import a JS file. If both are present, only JSON
 * will be imported
 *
 * NOTE: JS files are preferred to contain large text spanning over multiple lines
 * as it support JS string literla notation (`some string`). On the other hand,
 * JSON files are for small text that does not span over multiple lines.
 *
 * @param {string} locale The locale for which to import the translation file.
 * @param {string} key The key of the translation file.
 * @returns {Promise<any>} A promise that resolves with the imported translation file.
 */
const importTranslation = async (locale, key) => {
    return await import(`./${locale}/${key}.json`)
        .then((module) => module.default)
        .catch(async () => {
            // if json does not exist then try js file
            return await import(`./${locale}/${key}.js`);
        });
};

const loaders = supportedLocales.flatMap((locale) => [
    { locale, key: 'head', loader: () => importTranslation(locale, 'head') },
    { locale, key: 'lang', loader: () => importTranslation(locale, 'lang') },
    { locale, key: 'documents', loader: () => importTranslation(locale, 'documents') },
    { locale, key: 'error', loader: () => importTranslation(locale, 'error') },
    { locale, key: 'menu', loader: () => importTranslation(locale, 'menu') },
    { locale, key: 'events', loader: () => importTranslation(locale, 'events') },
    { locale, key: 'share', loader: () => importTranslation(locale, 'share') },
    { locale, key: 'facts', loader: () => importTranslation(locale, 'facts-figures') },
    { locale, key: 'countries', loader: () => importTranslation(locale, 'countries') },
    { locale, key: 'common', loader: () => importTranslation(locale, 'common') },
    { locale, key: 'news', loader: () => importTranslation(locale, 'news') },
    { locale, key: 'search', loader: () => importTranslation(locale, 'search') },
    { locale, key: 'disclaimers', loader: () => importTranslation(locale, 'disclaimers') },
    { locale, key: 'profile', loader: () => importTranslation(locale, 'people-profile') },
    { locale, key: 'secFiling', loader: () => importTranslation(locale, 'sec-filing') },
    { locale, key: 'news', loader: () => importTranslation(locale, 'news') },
    { locale, key: 'forms', loader: () => importTranslation(locale, 'forms') },
    { locale, key: 'breadcrumb', loader: () => importTranslation(locale, 'breadcrumb') },
    { locale, key: 'flipbook', loader: () => importTranslation(locale, 'flipbook') },
    { locale, key: ROUTES_TRANSLATION_KEY, loader: () => importTranslation(locale, 'routes') },
    {
        locale,
        key: 'largeTextContent',
        loader: () => importTranslation(locale, 'largeTextContent')
    },
    {
        locale,
        key: 'largeHtmlContent',
        loader: () => importTranslation(locale, 'largeHtmlContent')
    },
    { locale, key: 'footer', loader: () => importTranslation(locale, 'footer') },
    { locale, key: 'pdf', loader: () => importTranslation(locale, 'pdf') }
]);
/**
 * @type {import('sveltekit-i18n').Config}
 */
const config = {
    loaders,
    fallbackValue: undefined
};

export const { t, locale, locales, loading, setLocale, setRoute, translations, loadTranslations } =
    new i18n(config);

/**
 * use this static translations
 * wherever the actual translations are
 * not available
 * @type {{[locale: string]: {[routeKey: string]: string}}}
 */
export const ROUTES_STATIC_TRANSLATIONS = {
    en: enRoutes,
    de: deRoutes
};
