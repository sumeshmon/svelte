import * as env from '$env/static/public';
import { joinUrlPath, sendGet } from '@eqs/cms-svelte-irtools';
import type { HydraCollectionResponse } from '@eqs/cms-svelte-irtools';
import type { Figures } from './types';
import { locale } from '$lib/translations';
/**
 *  Figures data fetch
 * @param slug
 */
export const fetchFigures = async (slug: string): Promise<HydraCollectionResponse<Figures>> => {
    const endpoint = new URL(
        joinUrlPath(env.PUBLIC_API_ENDPOINT, env.PUBLIC_API_PREFIX, 'content/figures')
    );
    const combinedQueryParams = new URLSearchParams({
        localeCode: locale.get(),
        'slug[]': slug
    });

    endpoint.search = combinedQueryParams.toString();
    const response = await sendGet(endpoint, {
        headers: { 'Content-Type': 'application/json' }
    });

    return (await response.json()) as Promise<HydraCollectionResponse<Figures>>;
};
