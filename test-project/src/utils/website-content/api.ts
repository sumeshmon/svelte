import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, PUBLIC_BACKOFFICE } from '$env/static/public';
import type { HydraCollectionResponse } from '@eqs/cms-svelte-irtools';
import { joinUrlPath, sendGet } from '@eqs/cms-svelte-irtools';
import type { WebsiteContent } from './types';
import { locale } from '$lib/translations';
import { postMessageToParentWindow } from '$utils/ops';

const API_ENDPOINT = joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX);

const createPayload = (action: string, id: string, data?: any) => {
    return {
        action,
        id,
        data
    };
};

const postMessageToParent = (payload: any) => {
    postMessageToParentWindow({ payload });
};

export const fetchWebsiteContent = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<WebsiteContent>> => {
    const endpoint = new URL(joinUrlPath(API_ENDPOINT, 'content/website_contents'));
    endpoint.search = queryParams.toString();
    const response = await sendGet(endpoint, { headers: { 'Content-Type': 'application/json' } });
    return (await response.json()) as HydraCollectionResponse<WebsiteContent>;
};

export const setWebsiteContentBySlug = async (id: string, content: string) => {
    const payload = createPayload('editSubmit', id, {
        localId: [
            {
                languageCode: locale.get(),
                content: content
            }
        ]
    });
    postMessageToParent(payload);
};

export const onEntityStatusSubmit = async (id: string, status: string) => {
    const prefixStatus = status === 'publish';
    const payload = createPayload('updateStatus', id, {
        attributes: {
            isPublished: prefixStatus
        }
    });
    postMessageToParent(payload);
};

export const fetchSvgContent = async (url: string | URL | Request) => {
    try {
        const response = await fetch(url);
        return await response.text();
    } catch (error) {
        console.error(error);
    }
};
