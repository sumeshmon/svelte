import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, PUBLIC_PAGE_LIMIT } from '$env/static/public';
import searchConfig from '$utils/search/config.json';
import { joinUrlPath, sendGet } from '@eqs/cms-svelte-irtools';

export const getSearchConfig = () => {
    type SearchConfigType = {
        [key: string]: {
            analyzer: string;
            website: string;
            searchPath: string;
        };
    };

    const searchConfigData: { search: SearchConfigType } = searchConfig;
    return searchConfigData;
};

/**
 * Get search result list
 * @param itemsPerPage
 * @param page
 * @param lang
 * @param keyword
 */
export const getSearchResults = async (
    {
        itemsPerPage = PUBLIC_PAGE_LIMIT,
        page = 1,
        lang = '',
        keyword = ''
    }: {
        itemsPerPage?: string;
        page: number | null;
        lang?: string;
        keyword?: string;
    } = { page: 1 }
): Promise<any> => {
    const searchConfigData = getSearchConfig();

    const endpoint = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'search/searches')
    );

    if (
        keyword &&
        searchConfigData['search']?.[lang]?.analyzer.toString() &&
        searchConfigData['search']?.[lang]?.website.toString()
    ) {
        const searchQuery = keyword ?? '';
        const analyzer = searchConfigData['search']?.[lang]?.analyzer.toString();
        const website = searchConfigData['search']?.[lang]?.website.toString();

        const combinedQueryParams = new URLSearchParams({
            keyword: searchQuery.toString(),
            analyzer: analyzer.toString(),
            website: website.toString(),
            limit: itemsPerPage.toString(),
            page: (page !== null ? page : 1).toString()
        });

        endpoint.search = combinedQueryParams.toString();

        const response = await sendGet(endpoint, {
            headers: { 'Content-Type': 'application/json' }
        });
        const res = await response.json();

        return {
            searchResults: res['hydra:member'],
            totalItems: res['hydra:totalItems'],
            keyword: keyword,
            lang: lang
        };
    }
};
