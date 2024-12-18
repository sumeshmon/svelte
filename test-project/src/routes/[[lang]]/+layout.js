import { loadTranslations } from '$lib/translations';
import { getDefaultLocale } from '$utils/default-locale';
import { doUrlRedirection, extractLocaleFromPathname, removeLocaleFromPathname } from '$utils/ops';
export const prerender = true;

/** @type { import('@sveltejs/kit').Load } */
export const load = async ({ url }) => {
    const { pathname } = url;
    let lang = extractLocaleFromPathname(pathname) || getDefaultLocale();

    if (doUrlRedirection(url)) {
        return;
    }

    const route = removeLocaleFromPathname(pathname);
    await loadTranslations(lang, route);
    return { route, lang };
};
