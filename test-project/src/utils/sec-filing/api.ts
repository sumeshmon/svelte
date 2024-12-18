import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, PUBLIC_PAGE_LIMIT } from '$env/static/public';
import type { HydraCollectionResponse } from '@eqs/cms-svelte-irtools';
import { sendGet, joinUrlPath } from '@eqs/cms-svelte-irtools';
import type {
    SecFilingsUniqueYear,
    SecFiling,
    SecFilingsCategory,
    SecFilingsDownloads
} from './types';

export const fetchSecFilingUniqueYears = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<SecFilingsUniqueYear>> => {
    const url = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'us/sec_filings/get_unique_years')
    );
    const combinedQueryParams = new URLSearchParams({
        limit: PUBLIC_PAGE_LIMIT.toString(),
        ...Object.fromEntries(url.searchParams),
        ...Object.fromEntries(queryParams || new URLSearchParams())
    });
    url.search = combinedQueryParams.toString();
    const res = await sendGet(url, undefined);
    return (await res.json()) as Promise<HydraCollectionResponse<SecFilingsUniqueYear>>;
};

export const fetchSecFilingCategories = async () => {
    const url = `${PUBLIC_API_ENDPOINT}/${PUBLIC_API_PREFIX}/us/sec_filing_categories?`;
    const response = await sendGet(url, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async (res) => {
        return (await res.json()) as Promise<HydraCollectionResponse<SecFilingsCategory>>;
    });

    if (response) {
        return response;
    }
    throw new Error(response['hydra:description'] || response['detail']);
};

export const fetchSecFilings = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<SecFiling>> => {
    const endpoint = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'us/sec_filings_search')
    );
    const combinedQueryParams = new URLSearchParams({
        limit: PUBLIC_PAGE_LIMIT.toString()
    });
    if (queryParams) {
        for (const [key, value] of queryParams.entries()) {
            if (key === 'categories[]' || key === 'year[]' || key === 'ticker[]') {
                combinedQueryParams.append(key, value);
            } else {
                combinedQueryParams.set(key, value);
            }
        }
    }
    endpoint.search = combinedQueryParams.toString();
    const response = await sendGet(endpoint, {
        headers: { 'Content-Type': 'application/json' }
    });

    return (await response.json()) as Promise<HydraCollectionResponse<SecFiling>>;
};

export const getSecFilingsDownloadItemData = async (secFilingsParams: SecFilingsDownloads) => {
    const url = new URL(
        joinUrlPath(
            PUBLIC_API_ENDPOINT,
            PUBLIC_API_PREFIX,
            'us/sec_filings',
            secFilingsParams.id,
            secFilingsParams.format
        )
    );
    const response = await sendGet(url, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
};
