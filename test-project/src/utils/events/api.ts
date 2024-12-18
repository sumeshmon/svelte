import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX } from '$env/static/public';
import { joinUrlPath, sendGet } from '@eqs/cms-svelte-irtools';

import { locale } from '$lib/translations';
import type { EventCategory, EventUniqueYear, Event } from './types';
import type { HydraCollectionResponse } from '@eqs/cms-svelte-irtools';
import { addDefaultListRestriction } from '$utils/ops';

export const fetchEventUniqueYears = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<EventUniqueYear>> => {
    const url = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'content/events/get_unique_years')
    );
    const combinedQueryParams = new URLSearchParams({
        //'order[start]': 'desc',
        //locale: locale.get(),
        ...Object.fromEntries(url.searchParams)
    });
    if (queryParams) {
        for (const [key, value] of queryParams.entries()) {
            if (key.includes('[]')) {
                combinedQueryParams.append(key, value);
            } else {
                combinedQueryParams.set(key, value);
            }
        }
    }
    url.search = combinedQueryParams.toString();
    const res = await sendGet(url, undefined);
    return res.json();
};

export const fetchEventCategories = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<EventCategory>> => {
    const url = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'content/event_categories')
    );
    url.search = queryParams.toString();
    const res = await sendGet(url, undefined);
    return res.json();
};

export const fetchEvents = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<Event>> => {
    const endpoint = new URL(joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'content/events'));
    const combinedQueryParams = new URLSearchParams();
    if (queryParams) {
        for (const [key, value] of queryParams.entries()) {
            if (key.includes('[]')) {
                combinedQueryParams.append(key, value);
            } else {
                combinedQueryParams.set(key, value);
            }
        }
    }
    endpoint.search = addDefaultListRestriction(combinedQueryParams, 'events');
    const response = await sendGet(endpoint, {
        headers: { 'Content-Type': 'application/json' }
    });

    return (await response.json()) as Promise<HydraCollectionResponse<Event>>;
};

export const fetchEventBox = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<Event>> => {
    const url = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'content/events/eventbox')
    );
    // Step 1: Create a new URLSearchParams object
    const combinedQueryParams = new URLSearchParams();

    // Step 2: Add default query parameters
    // combinedQueryParams.set('dateOrder', 'DESC');
    // combinedQueryParams.set('timeOrder', 'DESC');
    combinedQueryParams.set('localId.languageCode', locale.get());

    // Step 3: Add additional query parameters from url.searchParams
    for (const [name, value] of url.searchParams) {
        combinedQueryParams.append(name, value);
    }

    // Step 3: Add additional query parameters from queryParams
    for (const [name, value] of queryParams) {
        combinedQueryParams.append(name, value);
    }

    url.search = combinedQueryParams.toString();
    const res = await sendGet(url, undefined);
    return res.json();
};
