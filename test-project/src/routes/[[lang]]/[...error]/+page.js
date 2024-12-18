import { setLocale, setRoute } from '$lib/translations';
export const prerender = true;
/** @type {import('@sveltejs/kit').Load} */
export async function load({ params }) {
    const { error, lang } = params;

    let status = error !== undefined ? parseInt(error) : 404;

    if (Number.isNaN(status)) status = 404;

    await setLocale(lang);
    await setRoute('error');

    return {
        status,
        lang
    };
}
