import { setLocale, setRoute } from '$lib/translations';
export const prerender = true;
/** @type {import('@sveltejs/kit').Load} */
export async function load({ params }) {
    const { lang } = params;

    let status = 404;

    await setLocale(lang);
    await setRoute('error');

    return {
        status,
        lang
    };
}
