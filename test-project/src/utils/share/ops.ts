import type {
    CompanyFundamental,
    CompanyFundamentalLocale,
    HighchartsData,
    ShareholderStructure,
    ShareholderStructureData,
    StockInfoLocale,
    StockInfoType,
    TableData,
    IpoData,
    CompanyProfile,
    CompanyProfileLocale,
    CombinedCompanyData,
    MetaData,
    CompanyFundamentalSegment
} from './types';
import {
    fetchCompanyFundamentals,
    fetchShareholderStructure,
    fetchStockInfo,
    fetchIpoData,
    fetchCompanyProfile
} from './api';
import { formatDate } from '../ops';
import { translations, locale } from '$lib/translations';
/**
 * Get Shareholder structure
 */
export const getShareholderStructure = async (category: string): Promise<ShareholderStructure> => {
    const shareholderStructureData = (await fetchShareholderStructure(category))['hydra:member'][0];
    const shareholderData: ShareholderStructure = {
        highchartsData: getHighchartsData(shareholderStructureData),
        tableData: getTableData(shareholderStructureData),
        seriesName: shareholderStructureData.category.name,
        footNote: getFootNote(shareholderStructureData),
        lastUpdatedDate: getLastUpdatedDate(shareholderStructureData)
    };

    return shareholderData as ShareholderStructure;
};

/**
 * Get Highcharts data
 * @param shareholderData
 */
export const getHighchartsData = (shareholderData: ShareholderStructureData) => {
    let highchartsData: HighchartsData = [];
    const lang = locale.get();
    if (shareholderData) {
        highchartsData = shareholderData.figureId.map((figureId) => {
            const localId = figureId.localId.find((local) => local.languageCode === lang);
            return {
                name: localId ? (localId.title !== null ? localId.title : '') : '',
                y: figureId.value,
                color: figureId.color
            };
        });
    }
    return highchartsData as HighchartsData;
};

/**
 * Get Shareholder structure table data
 * @param shareholderData
 */
export const getTableData = (shareholderData: ShareholderStructureData) => {
    let tableData: TableData = [];
    const lang = locale.get();
    const decimalSeparator = translations.get()[lang]['common.decimalSeparator'];
    if (shareholderData) {
        tableData = shareholderData.figureId.map((figureId) => {
            const localId = figureId.localId.find((local) => local.languageCode === lang);
            return [
                localId ? (localId.title !== null ? localId.title : '') : '',
                figureId.value.toString().replace('.', decimalSeparator)
            ];
        });
    }
    return tableData as TableData;
};

/**
 * Get Footnote
 * @param shareholderData
 * @param lang
 */
export const getFootNote = (shareholderData: ShareholderStructureData) => {
    const footNote: string[] = [];
    const lang = locale.get();
    if (shareholderData.shareholderStructureMeta) {
        const metaData = shareholderData.shareholderStructureMeta.filter(
            (item) => item.languageCode === lang
        );
        if (metaData.length > 0) {
            metaData.forEach((item) => {
                Object.values(item.metaData).forEach((metadataItem) => {
                    footNote.push('<div class="footenote">' + metadataItem.value + '</div>');
                });
            });
        }
    }
    return footNote.join() as string;
};

/**
 * Get Last updated Date
 * @param shareholderData
 */
export const getLastUpdatedDate = (shareholderData: ShareholderStructureData) => {
    let lastUpdatedDate: string = '';
    if (shareholderData.lastUpdatedDate) {
        lastUpdatedDate = formatDate(new Date(shareholderData.lastUpdatedDate));
    }
    return lastUpdatedDate as string;
};

/**
 * Get stock info data for table
 * @param stockType
 */
export const getStockInfo = async (stockType: string): Promise<TableData> => {
    const tableData: TableData = [];
    const stockInfoData: StockInfoType[] = (await fetchStockInfo(stockType))['hydra:member'][0][
        'stockInfoType'
    ];
    const lang = locale.get();
    stockInfoData.forEach((stock: StockInfoType) => {
        if (stock.stockType !== stockType) {
            return;
        }
        stock.localeId.forEach((loc: StockInfoLocale) => {
            if (lang !== loc.languageCode) {
                return;
            }

            processShareTableData({ ...stock, ...loc }, tableData);
        });
    });

    return tableData as TableData;
};

/**
 * Get IPO data for table
 */
export const getIpoData = async (): Promise<TableData> => {
    const tableData: TableData = [];
    const ipoData: IpoData = (await fetchIpoData())['hydra:member'][0];
    const lang = locale.get();
    ipoData.ipoDataLocales.forEach((loc: any) => {
        if (lang !== loc.languageCode) {
            return;
        }
        ipoData.firstTradingDay &&
            (ipoData.firstTradingDay = getShareFormattedDate(ipoData.firstTradingDay));
        ipoData.offeringPeriodStart &&
            (ipoData.offeringPeriodStart = getShareFormattedDate(ipoData.offeringPeriodStart));
        ipoData.offeringPeriodEnd &&
            (ipoData.offeringPeriodEnd = getShareFormattedDate(ipoData.offeringPeriodEnd));
        processShareTableData({ ...ipoData, ...loc }, tableData);
    });

    return tableData as TableData;
};

/**
 * Get Company Profile
 */
export const getCompanyProfile = async (): Promise<string> => {
    let companyProfile: string = '';
    const lang = locale.get();
    const companyData: CompanyProfile = (await fetchCompanyProfile())['hydra:member'][0];
    companyData.localeId.forEach((loc: CompanyProfileLocale) => {
        if (lang !== loc.languageCode) {
            return;
        }
        companyProfile = loc.profileContent;
    });
    return companyProfile as string;
};

/**
 * Get company fundamentals
 */
export const getCompanyFundamentals = async (): Promise<TableData> => {
    const tableData: TableData = [];
    const companyFundamentalData: CompanyFundamental = (await fetchCompanyFundamentals())[
        'hydra:member'
    ][0];
    if (companyFundamentalData.segment) {
        companyFundamentalData.segment =
            (companyFundamentalData.segment as CompanyFundamentalSegment)?.name || null;
    }
    processShareTableData(
        { ...companyFundamentalData, ...companyFundamentalData.locale[0] },
        tableData
    );
    return tableData as TableData;
};

/**
 * Fetches and combines company data from multiple sources (IPO data, Company fundamentals, and Stock info),
 *
 * @param stockType - The type of stock to fetch data for (default is 'Ordinary').
 * @returns Combined Company data in a table format.
 */
export const getCombinedCompanyData = async (
    stockType: string = 'Ordinary'
): Promise<TableData> => {
    let combinedCompanyData: CombinedCompanyData = {};
    let metaData: MetaData[] = [];
    const lang = locale.get();

    // Fetch IPO data and format relevant date fields.
    const ipoData: IpoData = (await fetchIpoData())['hydra:member'][0];

    ipoData.ipoDataLocales.forEach((loc: any) => {
        if (lang !== loc.languageCode) {
            return;
        }

        ipoData.firstTradingDay &&
            (ipoData.firstTradingDay = getShareFormattedDate(ipoData.firstTradingDay));
        ipoData.offeringPeriodStart &&
            (ipoData.offeringPeriodStart = getShareFormattedDate(ipoData.offeringPeriodStart));
        ipoData.offeringPeriodEnd &&
            (ipoData.offeringPeriodEnd = getShareFormattedDate(ipoData.offeringPeriodEnd));

        combinedCompanyData = { ...combinedCompanyData, ...ipoData, ...loc };
        if (loc.metaData) {
            metaData = { ...metaData, ...loc.metaData };
        }
    });

    // Fetch and process company fundamental data
    const companyFundamentalData: CompanyFundamental = (await fetchCompanyFundamentals())[
        'hydra:member'
    ][0];
    if (companyFundamentalData.segment) {
        companyFundamentalData.segment =
            (companyFundamentalData.segment as CompanyFundamentalSegment)?.name || null;
    }
    combinedCompanyData = {
        ...combinedCompanyData,
        ...companyFundamentalData,
        ...companyFundamentalData.locale[0]
    };
    if (companyFundamentalData.locale[0].metaData) {
        metaData = { ...metaData, ...companyFundamentalData.locale[0].metaData };
    }

    // Fetch and process stock info data
    const stockInfoData: StockInfoType[] = (await fetchStockInfo(stockType))['hydra:member'][0][
        'stockInfoType'
    ];
    const matchingStock = stockInfoData.find((stock) => stock.stockType === stockType);

    if (matchingStock) {
        const stockLocale = matchingStock.localeId.find((loc) => loc.languageCode === lang);
        if (stockLocale) {
            combinedCompanyData = { ...combinedCompanyData, ...matchingStock, ...stockLocale };
            if (stockLocale.metaData) {
                metaData = { ...metaData, ...stockLocale.metaData };
            }
        }
    }
    combinedCompanyData.metaData = metaData;
    const tableData: TableData = [];
    processShareTableData(combinedCompanyData, tableData, 'share.combinedCompanyData');

    return tableData as TableData;
};

/**
 * Process the keys of an object, check if a specified key exists, and update the tableData array accordingly.
 *
 * @param {object} dataObj - The object to process.
 * @param {Array} tableData - The array to store processed data.
 * @param translationFile
 */

function processShareTableData(
    dataObj:
        | StockInfoType
        | StockInfoLocale
        | CompanyFundamental
        | CompanyFundamentalLocale[]
        | CombinedCompanyData,
    tableData: TableData,
    translationFile: string = 'share'
) {
    const lang = locale.get();
    const translationsData = translations.get();
    // Create table data in the order they appear in translations
    const translationKeys = Object.keys(translationsData[lang]);
    translationKeys.forEach((key: string) => {
        const dataKey: string = key.replace(translationFile + '.', '');
        if (dataKey in dataObj) {
            const keys = Object.keys(dataObj);
            keys.forEach((objKey) => {
                if (dataKey === objKey) {
                    const objValue = dataObj[objKey as keyof typeof dataObj];
                    const value = objValue !== null ? String(objValue) : '';
                    tableData.push([translationsData[lang][key], value]);
                }
            });
        }
        // MetaData check.
        const metaDataKey = dataKey.split('.')[0];
        if (metaDataKey === 'metaData') {
            const metaKey = dataKey.split('.')[1];
            const keys = Object.keys((dataObj as CompanyFundamentalLocale).metaData);
            keys.forEach((objKey) => {
                if (metaKey !== objKey) {
                    return;
                }
                const objValue = (dataObj as CompanyFundamentalLocale).metaData[
                    objKey as keyof typeof dataObj
                ];
                const value = objValue !== null ? String(objValue.value) : '';
                tableData.push([translationsData[lang][key], value]);
            });
        }
    });
}

export const getShareFormattedDate = (
    date: string,
    dateFormat: { [key: string]: { [key: string]: string } } = {
        // Define the format for date parts such as weekday, day, month, year, hour, minute and second (Intl.DateTimeFormat options).
        // For each part, you can choose from options like "numeric", "2-digit", "narrow", "short", and "long" (Intl.DateTimeFormat values).
        // Add a delimiter along with the value for each part to separate them in the formatted date. Below is the example for EN: February 11, 2025 and DE: 11.02.2025
        en: {
            //weekday: 'short, ', // "narrow", "short", and "long"
            month: 'long ', // "numeric", "2-digit", "narrow", "short", and "long"
            day: '2-digit, ', // "numeric", "2-digit"
            year: 'numeric ' // "numeric", "2-digit"
        },
        de: {
            //weekday: 'short, ', // "narrow", "short", and "long"
            day: '2-digit.', // "numeric", "2-digit"
            month: '2-digit.', // "numeric", "2-digit", "narrow", "short", and "long"
            year: 'numeric ' //"numeric", "2-digit"
        }
    }
) => {
    date = date.replace('T', ' ').split('+')[0]; // Remove the 'T' and timezone part to prevent Date object from applying timezone conversion
    return formatDate(new Date(date), {}, dateFormat) as string;
};
