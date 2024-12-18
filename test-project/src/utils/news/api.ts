import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX } from '$env/static/public';
import { joinUrlPath, sendGet } from '@eqs/cms-svelte-irtools';
import { locale } from '$lib/translations';
import type { HydraCollectionResponse } from '@eqs/cms-svelte-irtools';
import type { NewsCategoryType, NewsType, NewsYearType } from './types';
import { getAgreedDisclaimers, tokenGenerater } from '$utils/disclaimer';
import { addDefaultListRestriction } from '$utils/ops';
import { canCancelRequest, clearCancelRequestMap, initCancelRequest } from '$utils/cancel-request';

const API_ENDPOINT = joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX);

const listParams = [
    { key: 'properties[]', value: 'timezone' },
    { key: 'properties[]', value: 'id' },
    { key: 'properties[]', value: 'tags' },
    { key: 'properties[]', value: 'category' },
    { key: 'properties[]', value: 'headline' },
    { key: 'properties[]', value: 'newsDate' },
    { key: 'properties[]', value: 'typeKey' },
    { key: 'properties[]', value: 'attachments' },
    { key: 'properties[]', value: 'urls' },
    { key: 'properties[]', value: 'subheadline' },
    { key: 'properties[]', value: 'summary' },
    { key: 'properties[]', value: 'newsDateOffset' },
    { key: 'properties[]', value: 'category' },
    { key: 'properties[]', value: 'url' },
    { key: 'properties[]', value: 'fileName' },
    { key: 'properties[]', value: 'fileType' },
    { key: 'properties[]', value: 'disclaimer' },
    { key: 'properties[]', value: 'newsDateLocal' },
    { key: 'properties[]', value: 'metaData' },
    { key: 'properties[]', value: 'css' },
    { key: 'properties[]', value: 'thumbnails' },
    { key: 'properties[]', value: 'images' },
    { key: 'properties[]', value: 'restriction' },
    { key: 'order[newsDate]', value: 'desc' }
];

export const fetchNews = async (
    queryParams = new URLSearchParams(),
    requestId: string | null
): Promise<HydraCollectionResponse<NewsType> | null> => {
    const endpoint = new URL(joinUrlPath(API_ENDPOINT, 'content/generalized_news'));
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
    listParams.forEach((param) => {
        combinedQueryParams.append(param.key, param.value);
    });
    endpoint.search = addDefaultListRestriction(combinedQueryParams, 'news');

    let requestOptions: {
        [key: string]: unknown;
    } = { headers: { 'Content-Type': 'application/json' } };

    if (canCancelRequest() && requestId) {
        requestOptions = initCancelRequest(requestId, requestOptions);
    }
    try {
        const response = await sendGet(endpoint, requestOptions);
        const newsList = response.json() as Promise<HydraCollectionResponse<NewsType>>;

        const agreedDisclaimers = getAgreedDisclaimers();

        if (!agreedDisclaimers) {
            return newsList;
        }
        if (canCancelRequest() && requestId) {
            clearCancelRequestMap(requestId);
        }

        return newsList.then((data) => {
            data['hydra:member'] = data['hydra:member'].map((doc) => {
                doc.disclaimerToken =
                    !!doc.disclaimer && agreedDisclaimers.includes(doc.disclaimer)
                        ? tokenGenerater(doc.disclaimer)
                        : null;
                return doc;
            });
            return data;
        });
    } catch (e) {
        return Promise.resolve(null);
    }
};

export const fetchNewsDetail = async (id: string) => {
    const endpoint = new URL(joinUrlPath(API_ENDPOINT, 'content/generalized_news', id));
    const response = await sendGet(endpoint, { headers: { 'Content-Type': 'application/json' } });
    return (await response.json()) as NewsType;
};

export const fetchNewsUniqueYears = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<NewsYearType>> => {
    const endpoint = new URL(
        joinUrlPath(API_ENDPOINT, 'content/generalized_news/get_unique_years')
    );
    const combinedQueryParams = new URLSearchParams({
        'order[date]': 'desc',
        locale: locale.get()
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
    endpoint.search = combinedQueryParams.toString();
    const response = await sendGet(endpoint, undefined);
    return (await response.json()) as HydraCollectionResponse<NewsYearType>;
};

export const fetchNewsCategories = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<NewsCategoryType>> => {
    const endpoint = new URL(joinUrlPath(API_ENDPOINT, 'content/generalized_news_categories'));
    const combinedQueryParams = new URLSearchParams({
        'categoryLocales.languageCode': locale.get()
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
    endpoint.search = combinedQueryParams.toString();
    const response = await sendGet(endpoint, undefined);
    return (await response.json()) as HydraCollectionResponse<NewsCategoryType>;
};

export const fetchNewsDetailByOrigin = async (uuid: string): Promise<NewsType> => {
    const endpoint = new URL(
        joinUrlPath(
            PUBLIC_API_ENDPOINT,
            PUBLIC_API_PREFIX,
            'content/generalized_news/get_by_origin/' + uuid
        )
    );

    const response = await sendGet(endpoint, {
        headers: { 'Content-Type': 'application/json' }
    });

    const newsDetail = response.json() as Promise<NewsType>;

    const agreedDisclaimers = getAgreedDisclaimers();

    if (!agreedDisclaimers) {
        return newsDetail;
    }

    return newsDetail.then((detail) => {
        detail.disclaimerToken =
            !!detail.disclaimer && agreedDisclaimers.includes(detail.disclaimer)
                ? tokenGenerater(detail.disclaimer)
                : null;
        return detail;
    });
};
