import { fetchNews, fetchNewsCategories, fetchNewsUniqueYears } from './api';
import {
    PUBLIC_NEWS_FALLBACK_LANG_LIST,
    PUBLIC_FALLBACK_LOCALE,
    PUBLIC_PAGE_LIMIT
} from '$env/static/public';
import { formatDate, createURLFriendlySlug, decodeHTMLEntities, getLangSlug } from '$utils/ops';
import type { LangSpecificText, NewsType, UrlDetailType } from './types';
import type { OptionType } from '@eqs/cms-svelte-irtools';
import { locale, t } from '$lib/translations';
import { PaginatorType } from '$utils/constants';
import { base } from '$app/paths';

/**
 * Get news list
 * @param lang
 * @param itemsPerPage
 * @param years
 * @param categories
 * @param newsTypes
 * @param tags
 * @param search
 * @param page
 * @param limit
 * @param isLandingPage
 */
export const getNewsList = async ({
    lang = PUBLIC_FALLBACK_LOCALE,
    itemsPerPage = PUBLIC_PAGE_LIMIT,
    years = [],
    categories = [],
    newsTypes = [],
    tags = [],
    search = null,
    page = null,
    isLandingPage = false,
    content = false,
    from = null,
    till = null,
    restrictions = [],
    requestId = null
}: {
    lang?: string | null;
    itemsPerPage?: string;
    years?: Array<string>;
    categories?: Array<string>;
    newsTypes?: Array<string>;
    tags?: Array<string>;
    search?: string | null;
    page?: number | null;
    isLandingPage?: boolean;
    content?: boolean;
    from?: string | null;
    till?: string | null;
    restrictions?: Array<string>;
    requestId?: string | null;
} = {}): Promise<{ news: NewsType[]; totalItems: number } | null> => {
    const queryParams = new URLSearchParams();
    page && queryParams.append('page', page.toString());
    search && queryParams.append('search', search.toString());
    lang && queryParams.append('languageCodes.code', lang);
    itemsPerPage && queryParams.append('limit', itemsPerPage);
    content && queryParams.append('groups[]', 'news_content');
    if (categories && categories[0] !== '') {
        categories
            .flat()
            .filter((category) => category.trim())
            .forEach((category) => {
                category.split(';').forEach((cat) => {
                    queryParams.append('category.code[]', cat);
                });
            });
    }

    restrictions &&
        restrictions.forEach((restriction) =>
            queryParams.append('without_restriction[]', restriction)
        );
    tags && tags.forEach((tag) => queryParams.append('tags.slug[]', tag));
    newsTypes && newsTypes.forEach((type) => queryParams.append('typeKey[]', type));
    //years && years[0] !== '' && years.forEach((year) => queryParams.append('years[]', year));
    if (years.length > 0) {
        years.forEach((year) => {
            if (year) {
                // For archive & fiscal years
                if (year.includes('_')) {
                    const archiveYears = year.split(/[_]/);
                    queryParams.append('newsDate[after]', archiveYears[1] + 'T00:00:00');
                    queryParams.append('newsDate[before]', archiveYears[0] + 'T23:59:59');
                } else if (year !== '') {
                    queryParams.append('years[]', year);
                }
            }
        });
    }
    isLandingPage && queryParams.append('without_restriction[]', 'do_not_show_on_ir_landing_page');
    from && queryParams.append('newsDate[after]', from + 'T00:00:00');
    till && queryParams.append('newsDate[before]', till + 'T23:59:59');
    const newsResponse = await fetchNews(queryParams, requestId);
    if (!newsResponse) {
        return Promise.resolve(null);
    }

    const { 'hydra:member': newsItems, 'hydra:totalItems': totalItems } = newsResponse;

    const updatedNewsItems = newsItems.map((item) => {
        const [headline, language] = getItemByLanguage(item.headline as LangSpecificText, lang);
        return { ...item, headline, language };
    });
    return { news: updatedNewsItems, totalItems: totalItems as number };
};

/**
 * Gets an item based on the specified language or a fallback language.
 * @param item - An object containing language-specific text.
 * @param lang - The preferred language or null for mixed language.
 * @returns An array with the text in the selected language and the language code.
 */
export const getItemByLanguage = (item: LangSpecificText, lang: string | null) => {
    if (lang) {
        // Return text in the specified language if available
        return [item[lang] ?? '', lang];
    } else {
        // Mixed language handling
        const currentLang = locale.get();
        // Return text if available in the current website language
        if (currentLang in item) return [item[currentLang], currentLang];

        // Fallback languages handling
        const fallBackLanguages = PUBLIC_NEWS_FALLBACK_LANG_LIST.split(',');
        const filteredFallBackLanguages = fallBackLanguages.filter(
            (language) => language !== currentLang
        );
        for (const key of filteredFallBackLanguages) {
            if (key in item) {
                return [item[key], key];
            }
        }

        // If no language key is found, use the first available key
        const firstKey = Object.keys(item)[0];
        return [item[firstKey] ?? '', firstKey ?? ''];
    }
};
/**
 * Get formatted date for news item
 * @returns Formatted date string
 * @param date
 * @param dateFormat
 */
export const getNewsFormattedDate = (
    date: string,
    dateFormat: { [key: string]: { [key: string]: string } } = {
        // Define the format for date parts such as weekday, day, month, year, hour, minute and second (Intl.DateTimeFormat options).
        // For each part, you can choose from options like "numeric", "2-digit", "narrow", "short", and "long" (Intl.DateTimeFormat values).
        // Add a delimiter along with the value for each part to separate them in the formatted date. Below is the example for EN: February 11, 2025 and DE: 11.02.2025
        en: {
            month: 'long ', // "numeric", "2-digit", "narrow", "short", and "long"
            day: '2-digit, ', // "numeric", "2-digit"
            year: 'numeric ', // "numeric", "2-digit"
            hour: '2-digit:', // "numeric", "2-digit"
            minute: '2-digit ' // "numeric", "2-digit"
        },
        de: {
            day: '2-digit.', // "numeric", "2-digit"
            month: 'short ', // "numeric", "2-digit", "narrow", "short", and "long"
            year: 'numeric ', //"numeric", "2-digit"
            hour: '2-digit:', // "numeric", "2-digit"
            minute: '2-digit ' // "numeric", "2-digit"
        }
    }
) => {
    const newsDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {};

    return formatDate(newsDate, options, dateFormat);
};

/**
 * Get categories
 * @param categories
 * @param years
 */
export const getNewsCategories = async (categories: string[] = [], years: string[] = []) => {
    try {
        const params = new URLSearchParams();
        if (categories.length > 0) {
            categories.forEach((category) => {
                params.append('code[]', category);
            });
        }
        if (years.length > 0) {
            if (years[0] !== '') {
                years.forEach((year) => {
                    params.append('years[]', year);
                });
            }
        }
        const response = await fetchNewsCategories(params);
        const responseCategories = response['hydra:member'];
        const categoriesCount = response['hydra:totalItems'];
        let categoryData: { name: string; value: string }[] = [];

        if (categoriesCount > 0) {
            categoryData = responseCategories.map((c) => ({
                name: c.locales[locale.get()].categoryName || c.name,
                value: c.code
            }));
        }
        return categoryData;
    } catch (error) {
        console.error('Error fetching News Categories:', error);
        return [];
    }
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
        const response = await fetchNewsUniqueYears(params);
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
        console.error('Error fetching News years:', error);
        return [];
    }
};

export const getNewsImageUrl = (news: NewsType | { [key: string]: any }) => {
    const lang = locale.get();
    let imageUrl: string = ' ';
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg'];
    news.urls[lang]?.forEach((item: UrlDetailType) => {
        if (item?.linkUrl && item?.linkType && imageTypes.includes(item.linkType.toLowerCase())) {
            imageUrl = item.linkUrl;
        }
    });
    return imageUrl as string;
};

/**
 * Extract summary from news content if summary is not available
 * @param news
 * @param maxLength
 */
export const getNewsSummary = (news: NewsType, maxLength: number = 200) => {
    const lang = locale.get();
    let ellipsis = '';
    let summary = '';
    if (news.summary && news.summary[lang]) {
        summary = news.summary[lang];
    }
    if (summary === '') {
        if (news.content && news.content[lang]) {
            summary = news.content[lang];
        } else {
            return '' as string;
        }
    }
    summary = decodeHTMLEntities(summary);
    summary = summary
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    if (summary.length > maxLength) {
        ellipsis = '...';
        summary = summary.slice(0, maxLength);
        const lastSpaceIndex = summary.lastIndexOf(' ', maxLength);
        summary = summary.slice(0, lastSpaceIndex) + ellipsis;
    }

    return summary as string;
};

/**
 * Prepare paginator based data
 * @param news
 * @param newsList
 * @param paginatorType
 */
export const prepareNewsList = (
    news: NewsType[],
    newsList: NewsType[],
    paginatorType: string | boolean
) => {
    if (paginatorType == PaginatorType.LoadMore) {
        newsList = [
            ...newsList,
            ...news.filter(
                (newsItem) => !newsList.some((existingNews) => existingNews.id === newsItem.id)
            )
        ];
    } else {
        newsList = news;
    }

    return newsList as NewsType[];
};

/**
 * Create News detail page link
 * @param news
 * @param lang
 */
export const getNewsDetailPageLink = (news: NewsType, lang: string) => {
    if (news.typeKey === 'hk_news') {
        return news.attachments[0]?.url;
    }
    let headline = '';
    if (typeof news.headline !== 'string') {
        headline = news.headline[lang] || news.headline[news.language];
    } else {
        headline = news.headline;
    }
    const urlSlug = createURLFriendlySlug(headline, lang);
    return t.get('news.detailLink', {
        base,
        lang: getLangSlug(lang),
        slug: urlSlug,
        id: news.id
    } as any);
};

/**
 * get PDF News link
 * @param news
 * @param lang
 */
export const getPdfNewsLink = (news: NewsType, lang: string): string | null => {
    if (news.typeKey === 'hk_news') {
        return news.attachments[0]?.url || null;
    }

    if (Array.isArray(news.attachments)) {
        for (const attachment of news.attachments) {
            if (attachment.fileType === 'application/pdf') {
                return attachment.url;
            }
        }
    }

    if (news.urls[lang]) {
        const link = news.urls[lang].find(
            (link) => link.linkType && ['LINK', 'application/pdf'].includes(link.linkType)
        );
        if (link) {
            return link.linkUrl;
        }
    }

    return null;
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

/**
 * Get category name of a news item
 * @param news
 */
export const getNewsCategoryName = (news: NewsType) => {
    const newsCategory = news.category;
    if (!newsCategory) {
        return;
    }
    const lang = news.language;
    return newsCategory
        .map((category) => {
            const categoryValue = t.get(`news.${category.code}`); // Use translated or modified name if available;
            if (categoryValue) return categoryValue;
            const locale = category.categoryLocales.find((locale) => locale.languageCode === lang);
            if (locale) return locale.categoryName;
            return null;
        })
        .filter((name) => name !== null)
        .join(', ');
};
