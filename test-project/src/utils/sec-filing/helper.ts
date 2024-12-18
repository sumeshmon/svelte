import type { SecFiling } from './types';
import { fetchSecFilings } from './api';
import { PUBLIC_PAGE_LIMIT } from '$env/static/public';

export const getSecFilingList = async ({
    itemsPerPage = PUBLIC_PAGE_LIMIT,
    years,
    categories,
    tickers,
    page,
    search,
    order
}: {
    itemsPerPage?: string;
    years?: string | null;
    categories?: string | null;
    tickers?: string | null;
    page?: number | null;
    search?: string | null;
    order?: {
        fieldName: string;
        direction: string;
    };
} = {}): Promise<{ filingsList: SecFiling[]; totalItems: number }> => {
    const queryParams = new URLSearchParams();
    if (page) {
        queryParams.append('page', page.toString());
    }
    if (itemsPerPage) {
        queryParams.append('limit', itemsPerPage);
    }
    if (order) {
        queryParams.append(`order[${order.fieldName}]`, order.direction);
    }
    if (search) {
        queryParams.append('search', search);
    }
    if (years) {
        years.split(/[;,|]/).forEach((year: { toString: () => string }) => {
            queryParams.append('year[]', year.toString());
        });
    }
    if (categories) {
        categories.split(/[;,|]/).forEach((category: string) => {
            queryParams.append('categories[]', category);
        });
    }
    if (tickers) {
        tickers.split(/[;,|]/).forEach((ticker: string) => {
            queryParams.append('ticker[]', ticker);
        });
    }

    const filings = await fetchSecFilings(queryParams);
    return {
        filingsList: filings['hydra:member'] as SecFiling[],
        totalItems: filings['hydra:totalItems'] as number
    };
};
