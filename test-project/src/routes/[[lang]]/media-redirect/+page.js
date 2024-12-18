import { DISCLAIMERS, DISCLAIMER_TO_COMPONENT_MAP } from '$components/disclaimer/constants';
import {
    PUBLIC_ACCESS_DENIED,
    PUBLIC_PAGE_NOT_FOUND,
    PUBLIC_HIDE_DEFAULT_LANG_SLUG
} from '$env/static/public';
import { WebsiteModules } from '$utils/constants';
import { fetchDocument } from '$utils/documents/api';
import { fetchNewsDetailByOrigin } from '$utils/news/api';
import { extractInfoFromMediaPath } from '$utils/ops';
import { locale } from '$lib/translations';
import { base } from '$app/paths';

export const prerender = false;
export const ssr = false;

/** @type {import('@sveltejs/kit').Load} */
export async function load({ url }) {
    const mediaUrl = url.searchParams.get('media_url');

    let redirectUrl = `/${PUBLIC_ACCESS_DENIED}`;
    if (!mediaUrl) {
        return {
            redirectUrl
        };
    }
    const info = extractInfoFromMediaPath(mediaUrl);

    let response = null;
    switch (info.module) {
        case WebsiteModules.Document:
            response = await fetchDocument(info.uuid);
            break;
        case WebsiteModules.CustomNews:
            response = await fetchNewsDetailByOrigin(info.uuid);
            break;
    }

    if (!response) {
        redirectUrl = `${base}/${PUBLIC_PAGE_NOT_FOUND}`;
        return {
            redirectUrl
        };
    }

    if (!response.disclaimer) {
        //disclaimer is not there then redirect to download
        redirectUrl = mediaUrl.startsWith('/') ? `${mediaUrl}` : `/${mediaUrl}`;
        return {
            redirectUrl
        };
    }

    let disclaimer = String(DISCLAIMERS.GENERAL);

    if (response.disclaimer in DISCLAIMER_TO_COMPONENT_MAP) {
        disclaimer = response.disclaimer;
    }

    //decide the disclaimer page to be redirected based on the disclaimer value.
    let mediaPath = mediaUrl.startsWith('/') ? `${mediaUrl}` : `/${mediaUrl}`;
    const langSlug =
        PUBLIC_HIDE_DEFAULT_LANG_SLUG?.toLowerCase() === 'true' ? '' : locale.get() + '/';
    redirectUrl = `${base}/${langSlug}disclaimers/${disclaimer}${mediaPath}`;
    return {
        redirectUrl
    };
}
