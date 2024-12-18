import type { Document, DocumentCategory, Agm, TitlePopup, PopupItem } from './types';
import { formatDate } from '../ops';
import {
    fetchDocuments,
    fetchDocumentCategories,
    fetchDocumentTags,
    fetchDocumentUniqueYears
} from './api';
import {
    PUBLIC_FALLBACK_LOCALE,
    PUBLIC_PAGE_LIMIT,
    PUBLIC_HIDE_DEFAULT_LANG_SLUG
} from '$env/static/public';
import { locale } from '$lib/translations';
import { generateMediaUrl } from '$utils/ops';
import type { OptionType } from '@eqs/cms-svelte-irtools';
import { PaginatorType } from '$utils/constants';
import { DocumentType } from '$utils/constants';
import { base } from '$app/paths';
import { DISCLAIMER_QUERY } from '$utils/disclaimer';

export const documentHasFile = (item: Document) => {
    return item.filePath;
};

export const documentHasThumb = (item: Document) => {
    return item.thumbnails?.default?.url || item.thumbnails?.custom?.url;
};

export const getDocumentFormattedDate = (
    item: Document,
    dateFormat: { [key: string]: { [key: string]: string } } = {
        // Define the format for date parts such as weekday, day, month, year, hour, minute and second (Intl.DateTimeFormat options).
        // For each part, you can choose from options like "numeric", "2-digit", "narrow", "short", and "long" (Intl.DateTimeFormat values).
        // Add a delimiter along with the value for each part to separate them in the formatted date. Below is the example for EN: February 11, 2025 and DE: 11.02.2025
        en: {
            month: 'long ', // "numeric", "2-digit", "narrow", "short", and "long"
            day: '2-digit, ', // "numeric", "2-digit"
            year: 'numeric' // "numeric", "2-digit"
        },
        de: {
            day: '2-digit.', // "numeric", "2-digit"
            month: '2-digit.', // "numeric", "2-digit", "narrow", "short", and "long"
            year: 'numeric' //"numeric", "2-digit"
        }
    }
) => {
    const showInsteadOfDate = item.showInsteadOfDate;
    if (showInsteadOfDate) {
        return showInsteadOfDate;
    }
    const startDate = new Date(item.date);

    const options: Intl.DateTimeFormatOptions = {};
    if (item?.timezone) {
        options.timeZone = item.timezone;
    }

    return `${formatDate(startDate, options, dateFormat)}`;
};

export const getDocumentFileSize = (item: Document, decimals = 2) => {
    const bytes = parseFloat(item.fileSize);
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const getDocumentFileInfo = (item: Document) => {
    if (item.fileType) {
        return item.fileType.split('/')[1];
    }
    return '';
};

export const getDocumentThumbnailUrl = (item: Document) => {
    const defaultThumbnail = item?.thumbnails?.default?.url;
    const customThumbnail = item?.thumbnails?.custom?.url;
    let url = defaultThumbnail || customThumbnail || '';
    if (url.length && item.disclaimerToken) {
        const queryParams = new URLSearchParams();
        queryParams.append(DISCLAIMER_QUERY, item.disclaimerToken);
        url += `?${queryParams.toString()}`;
    }
    return generateMediaUrl(url);
};

export const getDocumentUrl = (document: Document, queryStringParams?: string) => {
    let url = generateMediaUrl(document?.filePath || '');
    if (document.disclaimer) {
        const langSlug =
            PUBLIC_HIDE_DEFAULT_LANG_SLUG?.toLowerCase() === 'true' ? '' : locale.get() + '/';
        url = `${base}/${langSlug}disclaimers/${document.disclaimer}${document.filePath}`;
    }
    const queryParams = new URLSearchParams();
    if (queryStringParams) {
        queryStringParams.split('&').forEach((param) => {
            const [key, value] = param.split('=');
            queryParams.append(key, value);
        });
        url += url && queryStringParams ? `?${queryParams.toString()}` : '';
    }
    return url;
};

export const hasFeatureImage = (item: Document) => {
    return item.isFeatureDocument && item.featureImage.findIndex((img) => !!img.filePath) > -1;
};

export const getDocumentFeatureImage = (item: Document) => {
    let path = null;
    item.featureImage.map((featureImage) => {
        path = generateMediaUrl(featureImage.filePath || '');
    });
    return path;
};

export const getQueryParamsForDocuments = ({
    year,
    category,
    limit,
    page
}: {
    year: string;
    category: string;
    limit: string;
    page: string;
}) => {
    const queryParams = new URLSearchParams();
    if (limit) {
        queryParams.append('limit', limit.toString());
    }
    if (page) {
        queryParams.append('page', page.toString());
    }
    if (category) {
        queryParams.append('category.slug[]', category.toString());
    }
    if (year) {
        queryParams.append('years[]', year.toString());
    }
    return queryParams;
};

export const getDocumentCategoryName = (categories: DocumentCategory[]) => {
    const categoriesData: string[] = [];
    categories.forEach((category) => {
        const value = category.localId
            ?.filter((l) => l.languageCode === locale.get())
            .pop()?.categoryName;
        const fallbackValue = category.localId
            ?.filter((l) => l.languageCode === PUBLIC_FALLBACK_LOCALE)
            .pop()?.categoryName;
        const notEmptyValue = category.localId?.filter((l) => l.categoryName).pop()?.categoryName;
        const categoryValue = value || fallbackValue || notEmptyValue;
        if (categoryValue) {
            categoriesData.push(categoryValue);
        }
    });
    return categoriesData.join(', ');
};

/**
 * Get document list
 * @param lang
 * @param itemsPerPage
 * @param years
 * @param featureDocument
 * @param categories
 * @param tags
 * @param page
 * @param sortOrder
 * @param dateOrder
 * @param timeOrder
 * @param orderDate
 * @param restrictions
 */
export const getDocumentList = async ({
    lang = PUBLIC_FALLBACK_LOCALE,
    itemsPerPage = PUBLIC_PAGE_LIMIT,
    years = [],
    featureDocument = null,
    categories = null,
    tags = null,
    page = null,
    sortOrder = null,
    dateOrder = null,
    timeOrder = null,
    orderDate = 'DESC',
    restrictions = []
}: {
    lang?: string;
    itemsPerPage?: string;
    years?: string[];
    featureDocument?: string | null;
    categories?: string[] | null;
    tags?: string[] | null;
    page?: number | null;
    sortOrder?: string | null;
    dateOrder?: string | null;
    timeOrder?: string | null;
    orderDate?: string | null;
    restrictions?: string[] | null;
} = {}): Promise<{ documents: Document[]; totalItems: number }> => {
    const queryParams = new URLSearchParams();
    page && queryParams.append('page', page.toString());

    if (years.length > 0) {
        years.forEach((year) => {
            if (year) {
                // For archive & fiscal years
                if (year.includes('_')) {
                    const archiveYears = year.split(/[_]/);
                    queryParams.append('date[after]', archiveYears[1] + 'T00:00:00');
                    queryParams.append('date[before]', archiveYears[0] + 'T23:59:59');
                } else if (year !== '') {
                    queryParams.append('years[]', year);
                }
            }
        });
    }
    featureDocument && queryParams.append('isFeatureDocument', featureDocument);
    categories && categories.forEach((category) => queryParams.append('category.slug[]', category));
    tags && tags.forEach((tag) => queryParams.append('tags.slug[]', tag));
    restrictions &&
        restrictions.forEach((restriction) =>
            queryParams.append('restriction_without_restriction[]', restriction)
        );
    sortOrder && queryParams.append('sortOrder', sortOrder);
    timeOrder && queryParams.append('timeOrder', timeOrder);
    dateOrder && queryParams.append('dateOrder', dateOrder);
    orderDate && queryParams.append('order[date]', orderDate);
    queryParams.append('limit', itemsPerPage);
    const documents = await fetchDocuments(queryParams, lang);
    return {
        documents: documents['hydra:member'] as Document[],
        totalItems: documents['hydra:totalItems'] as number
    };
};

/**
 * Prepare paginator based data
 * @param documents
 * @param documentList
 * @param paginatorType
 */

export const prepareDocumentList = (
    documents: Document[],
    documentList: Document[],
    paginatorType: string | boolean
) => {
    if (paginatorType == PaginatorType.LoadMore) {
        documentList = [
            ...documentList,
            ...documents.filter(
                (doc) => !documentList.some((existingDoc) => existingDoc.id === doc.id)
            )
        ];
    } else {
        documentList = documents;
    }

    return documentList as Document[];
};

/**
 * Check the
 * @param listNotFound
 * @param searchString
 */
export const listNotFoundCheck = (
    listNotFound: { [key: string]: boolean },
    searchString: string
) => {
    // Filter the keys that include the search string
    const keysToCheck = Object.keys(listNotFound).filter((key) => key.includes(searchString));
    // Check if all filtered keys have the value true
    return keysToCheck.every((key) => listNotFound[key] === true);
};

/**
 * Prepare AGM data according to the requirements logic.
 * @param documents
 */
export const prepareAgmData = (documents: Document[]) => {
    let popupFlag: boolean = false;
    let titlePopupFlag: boolean = false;
    let titlePopup: TitlePopup[] = [];
    let popup: PopupItem[] = [];
    const agm: Agm[] = [];
    documents.forEach((item: Document) => {
        if (item.documentType == DocumentType.TitlePopup && !titlePopupFlag && !popupFlag) {
            popup = [];
            titlePopupFlag = true;
            titlePopup.push({ item });
            agm.push({ titlePopup: titlePopup });
        } else if (titlePopupFlag && item.documentType == DocumentType.TitlePopup) {
            popup = [];
            titlePopup = [{ item }];
            popupFlag = false;
            agm.push({ titlePopup: titlePopup });
        } else if (item.documentType == DocumentType.Popup && !popupFlag) {
            popup = [{ item }];
            popupFlag = true;
            if (titlePopupFlag) {
                titlePopup.push({ popup: popup });
                agm[agm.length - 1].titlePopup = titlePopup;
            } else {
                titlePopup = [];
                agm.push({ popup: popup });
            }
        } else if (popupFlag && item.documentType == DocumentType.Popup) {
            popup = [{ item }];
            if (titlePopupFlag) {
                titlePopup.push({ popup: popup });
                agm[agm.length - 1].titlePopup = titlePopup;
            } else {
                titlePopup = [];
                agm.push({ popup: popup });
            }
        } else if (popupFlag && item.documentType == DocumentType.TitlePopup) {
            popup = [];
            titlePopup = [{ item }];
            popupFlag = false;
            titlePopupFlag = true;
            agm.push({ titlePopup: titlePopup });
        } else if (popupFlag && !titlePopupFlag) {
            popup.push({ item });
            agm[agm.length - 1].popup = popup;
        } else if (!popupFlag && titlePopupFlag) {
            titlePopup.push({ item });
            agm[agm.length - 1].titlePopup = titlePopup;
        } else if (popupFlag && titlePopupFlag) {
            popup.push({ item });
            const lastItem = agm[agm.length - 1];

            if (lastItem.titlePopup) {
                const index = lastItem.titlePopup.findIndex((obj) =>
                    Object.prototype.hasOwnProperty.call(obj, 'popup')
                );
                index !== -1 && (lastItem.titlePopup[index].popup = popup);
            }
        } else {
            agm.push({ item });
        }
    });
    return agm as Agm[];
};

/**
 * Get categories
 * @param categories
 */
export const getDocumentCategories = async (categories: Array<string> = []) => {
    try {
        const params = new URLSearchParams();
        if (categories.length > 0) {
            categories.forEach((category) => {
                params.append('slug[]', category);
            });
        }
        const response = await fetchDocumentCategories(params);
        const responseCategories = response['hydra:member'];
        const categoriesCount = response['hydra:totalItems'];
        let categoryData: { name: string; value: string }[] = [];

        if (categoriesCount > 0) {
            categoryData = responseCategories.map((c) => ({
                name:
                    c.localId?.filter((l) => l.languageCode === locale.get()).pop()?.categoryName ||
                    c.name,
                value: c.slug
            }));
        }
        return categoryData;
    } catch (error) {
        console.error('Error fetching Document Categories:', error);
        return [];
    }
};

/**
 * Get tags
 * @param tags
 */
export const getDocumentTags = async (tags: Array<string> | null = null) => {
    try {
        const params = new URLSearchParams();
        tags &&
            tags.forEach((tag) => {
                params.append('slug[]', tag);
            });
        const response = await fetchDocumentTags(params);
        const responseTags = response['hydra:member'];
        const tagsCount = response['hydra:totalItems'];
        let tagsData: { name: string; value: string }[] = [];

        if (tagsCount > 0) {
            tagsData = responseTags.map((t) => ({
                name: t.name,
                value: t.slug
            }));
        }
        return tagsData;
    } catch (error) {
        console.error('Error fetching Document tags:', error);
        return [];
    }
};

/**
 * Get document list
 * @param lang
 * @param itemsPerPage
 * @param years
 * @param featureDocument
 * @param category
 * @param tags
 * @param page
 */
export const getFDList = async ({
    lang = PUBLIC_FALLBACK_LOCALE,
    itemsPerPage = PUBLIC_PAGE_LIMIT,
    years = null,
    featureDocument = null,
    categories = null,
    tags = null,
    page = null,
    sortOrder = null,
    dateOrder = 'DESC',
    timeOrder = null
}: {
    lang?: string;
    itemsPerPage?: string;
    years?: string | null;
    featureDocument?: string | null;
    categories?: Array<string> | null;
    tags?: Array<string> | null;
    page?: number | null;
    sortOrder?: string | null;
    dateOrder?: string;
    timeOrder?: string | null;
} = {}): Promise<{ documents: Document[]; totalItems: number }> => {
    const queryParams = new URLSearchParams();
    if (page) {
        queryParams.append('page', page.toString());
    }
    if (itemsPerPage) {
        queryParams.append('limit', itemsPerPage);
    }
    if (years) {
        // For archive & fiscal years
        if (years.includes('_')) {
            const archiveYears = years.split(/[_]/);
            queryParams.append('date[after]', archiveYears[1] + ' 00:00:00');
            queryParams.append('date[before]', archiveYears[0] + ' 23:59:59');
        } else {
            queryParams.append('years', years.toString());
        }
    }
    if (featureDocument) {
        queryParams.append('isFeatureDocument', featureDocument);
    }
    if (categories) {
        categories.forEach((category) => {
            queryParams.append('category.slug[]', category);
        });
    }
    if (tags) {
        tags.forEach((tag) => {
            queryParams.append('tags.slug[]', tag);
        });
    }
    if (sortOrder) {
        queryParams.append('sortOrder', sortOrder);
    }
    if (timeOrder) {
        queryParams.append('timeOrder', timeOrder);
    }
    queryParams.append('dateOrder', dateOrder);
    const documents = await fetchDocuments(queryParams, lang);
    return {
        documents: documents['hydra:member'] as Document[],
        totalItems: documents['hydra:totalItems'] as number
    };
};

export const fetchYears = async ({
    params = new URLSearchParams(),
    noOfYears = null,
    archive = false,
    fiscalYearBeginMD = null,
    fiscalYearEndMD = null,
    showAllYears = false,
    archiveTill = ''
}: {
    params?: URLSearchParams;
    noOfYears?: number | null;
    archive?: boolean;
    fiscalYearBeginMD?: string | null;
    fiscalYearEndMD?: string | null;
    showAllYears?: boolean;
    archiveTill?: string;
} = {}) => {
    try {
        if (fiscalYearBeginMD && fiscalYearEndMD) {
            const [monthBegin, dayBegin] = fiscalYearBeginMD.split('-');
            const [monthEnd, dayEnd] = fiscalYearEndMD.split('-');
            params.append('fiscal[from]', `${dayBegin}-${monthBegin}`);
            params.append('fiscal[to]', `${dayEnd}-${monthEnd}`);
        }

        const response = await fetchDocumentUniqueYears(params);
        const uniqueYears = response['hydra:member'];
        const yearsCount = response['hydra:totalItems'];
        let uniqueYearsData: OptionType[] = [];

        showAllYears && uniqueYears.unshift({ year: 'common.all' });

        if (yearsCount > 0) {
            uniqueYearsData = getUniqueYearsData(uniqueYears, fiscalYearBeginMD, fiscalYearEndMD);
            if (noOfYears) {
                uniqueYearsData = uniqueYearsData.slice(0, noOfYears);
            }
            if (archive) {
                uniqueYearsData = processArchiveData(
                    uniqueYearsData,
                    uniqueYears,
                    fiscalYearBeginMD,
                    fiscalYearEndMD,
                    archiveTill
                );
            }
        } else if (yearsCount == 0) {
            uniqueYearsData = [];
        }

        return uniqueYearsData;
    } catch (error) {
        console.error('Error fetching Documents years:', error);
        return [];
    }
};

/**
 * Creates data for Tab/DropDown component.
 * @param uniqueYears
 * @param fiscalYearBeginMD
 * @param fiscalYearEndMD
 */
const getUniqueYearsData = (
    uniqueYears: Array<{ year: string }>,
    fiscalYearBeginMD: string | null,
    fiscalYearEndMD: string | null
) => {
    return uniqueYears.map((y) => {
        if (fiscalYearBeginMD && fiscalYearEndMD) {
            const year =
                parseInt(y.year) +
                1 +
                '-' +
                fiscalYearEndMD +
                '_' +
                y.year +
                '-' +
                fiscalYearBeginMD;
            return { name: y.year, value: y.year == 'common.all' ? '' : year };
        } else {
            return { name: y.year, value: y.year == 'common.all' ? '' : y.year };
        }
    });
};

/**
 * Shapes the unique years values for displaying in the archive tab.
 * It modifies the years based on the given fiscal year settings if they are provided.
 *
 * @param uniqueYearsData
 * @param uniqueYears
 * @param fiscalYearBeginMD
 * @param fiscalYearEndMD
 * @param archiveTill - The year up to which the archive extends, in YYYY format.
 */
const processArchiveData = (
    uniqueYearsData: OptionType[],
    uniqueYears: Array<{ year: string }>,
    fiscalYearBeginMD: string | null,
    fiscalYearEndMD: string | null,
    archiveTill: string
) => {
    const lastYearSliced = uniqueYearsData[uniqueYearsData.length - 1].value;
    let archiveFromMD: string = '-12-31';
    let archiveTillMD: string = '-01-01';
    let archiveFrom: string = '';
    const lastYearAvailable = uniqueYears[uniqueYears.length - 1]['year'];

    archiveFrom = (parseInt(lastYearSliced) - 1).toString();
    archiveTill || (archiveTill = lastYearAvailable);

    if (fiscalYearBeginMD && fiscalYearEndMD) {
        const fiscalYearData = lastYearSliced.split('_');
        archiveFrom = fiscalYearData[1].split('-')[0];
        archiveFromMD = '-' + fiscalYearEndMD;
        archiveTillMD = '-' + fiscalYearBeginMD;
    }

    const hasYearLessThanArchiveFrom = uniqueYears.some((entry) => {
        const year = parseInt(entry.year);
        return !isNaN(year) && year <= parseInt(archiveFrom);
    });
    if (hasYearLessThanArchiveFrom) {
        uniqueYearsData.push({
            name: 'common.archive',
            value: archiveFrom + archiveFromMD + '_' + archiveTill + archiveTillMD
        });
    }
    return uniqueYearsData;
};

export const getDocumentTitle = (document: Document) => {
    return document.description || document.title;
};

/**
 * Generates the content for an AGM list: Years as Accordion.
 * @param agmListContent An object representing the content of an AGM list, with years as keys and arrays of Agm objects as values.
 * @param agmList An array of Agm objects.
 * @param agmYear An optional parameter indicating the year to filter the agmList by.
 * @returns The updated agmListContent object.
 */
export const generateAgmListContent = (
    agmListContent: { [year: string]: Agm[] },
    agmList: Agm[],
    agmYear: string | null = null
) => {
    agmList.forEach((agm) => {
        if (!agm.item) return;
        const year = agmYear === null ? agm.item.date.split('-')[0] : agmYear;
        if (!agmListContent[year]) {
            agmListContent[year] = [];
        }
        agmListContent[year].push(agm);
    });
    return agmListContent;
};
