import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, PUBLIC_PAGE_LIMIT } from '$env/static/public';
import type { HydraCollectionResponse } from '@eqs/cms-svelte-irtools';
import { sendGet, joinUrlPath } from '@eqs/cms-svelte-irtools';
import type { DocumentUniqueYear, DocumentCategory, DocumentTags, Document } from './types';
import { locale } from '$lib/translations';
import { getAgreedDisclaimers, tokenGenerater } from '$utils/disclaimer';
import { addDefaultListRestriction } from '$utils/ops';

export const fetchDocumentUniqueYears = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<DocumentUniqueYear>> => {
    const url = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'content/documents/get_unique_years')
    );
    const combinedQueryParams = new URLSearchParams({
        locale: locale.get(),
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
    return (await res.json()) as Promise<HydraCollectionResponse<DocumentUniqueYear>>;
};

export const fetchDocumentCategories = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<DocumentCategory>> => {
    const url = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'content/document_categories')
    );
    const combinedQueryParams = new URLSearchParams();
    // Add existing search parameters from the URL
    for (const [key, value] of url.searchParams) {
        combinedQueryParams.append(key, value);
    }
    // Add new query parameters
    if (queryParams) {
        for (const [key, value] of queryParams) {
            combinedQueryParams.append(key, value);
        }
    }

    url.search = combinedQueryParams.toString();
    const res = await sendGet(url, undefined);
    return (await res.json()) as Promise<HydraCollectionResponse<DocumentCategory>>;
};
export const fetchDocumentTags = async (
    queryParams = new URLSearchParams()
): Promise<HydraCollectionResponse<DocumentTags>> => {
    const url = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'content/document_tags')
    );
    const combinedQueryParams = new URLSearchParams();
    // Add existing search parameters from the URL
    for (const [key, value] of url.searchParams) {
        combinedQueryParams.append(key, value);
    }
    // Add new query parameters
    if (queryParams) {
        for (const [key, value] of queryParams) {
            combinedQueryParams.append(key, value);
        }
    }

    url.search = combinedQueryParams.toString();
    const res = await sendGet(url, undefined);
    return (await res.json()) as Promise<HydraCollectionResponse<DocumentTags>>;
};

export const fetchDocuments = async (
    queryParams = new URLSearchParams(),
    lang: string
): Promise<HydraCollectionResponse<Document>> => {
    const endpoint = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'content/documents')
    );
    const combinedQueryParams = new URLSearchParams({
        languageCode: lang,
        limit: PUBLIC_PAGE_LIMIT.toString()
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

    endpoint.search = addDefaultListRestriction(combinedQueryParams, 'documents');
    const response = await sendGet(endpoint, {
        headers: { 'Content-Type': 'application/json' }
    });

    const documents = response.json() as Promise<HydraCollectionResponse<Document>>;

    const agreedDisclaimers = getAgreedDisclaimers();

    if (!agreedDisclaimers) {
        return documents;
    }

    return documents.then((data) => {
        data['hydra:member'] = data['hydra:member'].map((doc) => {
            doc.disclaimerToken =
                !!doc.disclaimer && agreedDisclaimers.includes(doc.disclaimer)
                    ? tokenGenerater(doc.disclaimer)
                    : null;
            return doc;
        });
        return data;
    });
};
export const fetchDocument = async (uuid: string): Promise<Document> => {
    const endpoint = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'content/documents/' + uuid)
    );

    const response = await sendGet(endpoint, {
        headers: { 'Content-Type': 'application/json' }
    });

    const document = response.json() as Promise<Document>;

    const agreedDisclaimers = getAgreedDisclaimers();

    if (!agreedDisclaimers) {
        return document;
    }
    return document.then((doc) => {
        doc.disclaimerToken =
            !!doc.disclaimer && agreedDisclaimers.includes(doc.disclaimer)
                ? tokenGenerater(doc.disclaimer)
                : null;
        return doc;
    });
};
