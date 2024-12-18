import * as env from '$env/static/public';
import { joinUrlPath, sendGet } from '@eqs/cms-svelte-irtools';
import type { HydraCollectionResponse } from '@eqs/cms-svelte-irtools';
import type {
    ShareholderStructureData,
    StockInfo,
    CompanyFundamental,
    IpoData,
    CompanyProfile
} from './types';
import { locale } from '$lib/translations';
/**
 * Shareholder structure fetch
 */
export const fetchShareholderStructure = async (
    category: string
): Promise<HydraCollectionResponse<ShareholderStructureData>> => {
    const endpoint = new URL(
        joinUrlPath(
            env.PUBLIC_API_ENDPOINT,
            env.PUBLIC_API_PREFIX,
            'content/shareholder_structures'
        )
    );

    const combinedQueryParams = new URLSearchParams({
        'category.slug': category
    });
    endpoint.search = combinedQueryParams.toString();
    const response = await sendGet(endpoint, {
        headers: { 'Content-Type': 'application/json' }
    });
    return (await response.json()) as Promise<HydraCollectionResponse<ShareholderStructureData>>;
};

/**
 * Stock Info fetch
 * @param stockType
 */
export const fetchStockInfo = async (
    stockType: string
): Promise<HydraCollectionResponse<StockInfo>> => {
    const endpoint = new URL(
        joinUrlPath(env.PUBLIC_API_ENDPOINT, env.PUBLIC_API_PREFIX, 'content/stock_infos')
    );
    const combinedQueryParams = new URLSearchParams({
        'stockInfoType.stockType': stockType
    });
    endpoint.search = combinedQueryParams.toString();
    const response = await sendGet(endpoint, {
        headers: { 'Content-Type': 'application/json' }
    });
    return (await response.json()) as Promise<HydraCollectionResponse<StockInfo>>;
};

/**
 * Company Fundamentals fetch
 */
export const fetchCompanyFundamentals = async (): Promise<
    HydraCollectionResponse<CompanyFundamental>
> => {
    const endpoint = new URL(
        joinUrlPath(env.PUBLIC_API_ENDPOINT, env.PUBLIC_API_PREFIX, 'content/company_fundamentals')
    );
    const combinedQueryParams = new URLSearchParams({
        'locale.localeCode': locale.get()
    });

    endpoint.search = combinedQueryParams.toString();
    const response = await sendGet(endpoint, {
        headers: { 'Content-Type': 'application/json' }
    });
    return (await response.json()) as Promise<HydraCollectionResponse<CompanyFundamental>>;
};

/**
 * IPO data fetch
 */
export const fetchIpoData = async (): Promise<HydraCollectionResponse<IpoData>> => {
    const endpoint = new URL(
        joinUrlPath(env.PUBLIC_API_ENDPOINT, env.PUBLIC_API_PREFIX, 'content/ipo_datas')
    );

    const response = await sendGet(endpoint, {
        headers: { 'Content-Type': 'application/json' }
    });
    return (await response.json()) as Promise<HydraCollectionResponse<IpoData>>;
};

/**
 * Company Profile fetch
 */
export const fetchCompanyProfile = async (): Promise<HydraCollectionResponse<CompanyProfile>> => {
    const endpoint = new URL(
        joinUrlPath(env.PUBLIC_API_ENDPOINT, env.PUBLIC_API_PREFIX, 'content/company_profiles')
    );

    const response = await sendGet(endpoint, {
        headers: { 'Content-Type': 'application/json' }
    });
    return (await response.json()) as Promise<HydraCollectionResponse<CompanyProfile>>;
};
