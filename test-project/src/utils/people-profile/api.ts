import { type HydraCollectionResponse, joinUrlPath, sendGet } from '@eqs/cms-svelte-irtools';
import type { PeopleProfile } from './types';
import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX } from '$env/static/public';
import { addDefaultListRestriction } from '$utils/ops';
const API_ENDPOINT = joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX);

export const fetchPeopleProfileList = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<PeopleProfile>> => {
    const endpoint = new URL(joinUrlPath(API_ENDPOINT, 'content/people_profiles'));
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
    endpoint.search = addDefaultListRestriction(combinedQueryParams, 'people-profile');
    const response = await sendGet(endpoint, { headers: { 'Content-Type': 'application/json' } });
    return (await response.json()) as HydraCollectionResponse<PeopleProfile>;
};
