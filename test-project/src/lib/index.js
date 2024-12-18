// place files you want to import through the `$lib` alias in this folder.
import urlRedirects from '$lib/url_redirect.json' assert { type: 'json' };

/**
 * @type {{[key: string]: {[url: string]: string}}}
 */
export const URL_REDIRECTS = {
    redirect: urlRedirects
};
