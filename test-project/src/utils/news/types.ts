export type NewsType = {
    id: string;
    originId: string;
    companyId: string;
    typeKey: string;
    newsDate: string;
    timezone: string;
    headline: LangSpecificText | string;
    subheadline: LangSpecificText;
    summary: LangSpecificText;
    footNotes: LangSpecificText;
    footer: LangSpecificText;
    header: LangSpecificText;
    category: NewsCategoryType[];
    tags: NewsTagType[];
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    attachments: NewsAttachmentType[];
    urls: UrlsType;
    content?: ContentType;
    disclaimer: string;
    newsDateLocal: string;
    metaData: MetaData;
    images: {
        [languageCode: string]: { url?: string };
    };
    disclaimerToken?: string | null;
    language: string;
};

/*export type NewsDetailType = NewsType & {
	content: LangSpecificText;
};*/

export type NewsCategoryType = {
    locales: { [key: string]: { categoryName?: string } };
    code: string;
    name: string;
    categoryLocales: categoryLocales[];
};
export type categoryLocales = {
    categoryName: string;
    languageCode: string;
};
/*export type NewsCategoryWithLocalesType = {
	locales: { [key: string]: { categoryName?: string } };
	name: string;
	code: string;
};*/

export type NewsCategoryLocaleType = {
    categoryName: string;
    languageCode: string;
};

export type NewsTagType = {
    name: string;
    slug: string;
};

export type NewsAttachmentType = {
    url: string;
    fileName: string;
    fileType: string;
    thumbnails: {
        [type: string]: ThumbnailDetailType;
    };
};
export type UrlsType = {
    [langCode: string]: UrlDetailType[];
};
export type ContentType = {
    [langCode: string]: string;
};
export type UrlDetailType = {
    linkUrl: string;
    linkType?: string;
    linkTitle?: string;
};

export type LangSpecificText = { [langCode: string]: string };
export type ThumbnailDetailType = {
    height: number;
    width: number;
    orientation: string;
    url: string;
};

export type GenericSearchFormSubmitDataType = {
    years: string;
    category: string;
    tag: string;
    search: string;
    limit: string;
    from: string;
    to: string;
};

export type NewsYearType = {
    year: string;
};

export type UkRegNewsCategoryType = {
    friendlySlug: string;
    id: string;
    name: string;
    slug: string;
};

export type MetaData = {
    [languageCode: string]: {
        details: {
            pvr: {
                person: {
                    legal_person: {
                        name:
                            | string
                            | {
                                  first_name: string;
                                  last_name: string;
                              };
                        location: {
                            city: string;
                            country: string;
                        };
                    };
                    natural_person: {
                        name:
                            | string
                            | {
                                  first_name: string;
                                  last_name: string;
                              };
                    };
                };
                threshold_date: string;
                total_positions: {
                    [key: string]: {
                        percentage_total_of_both: number;
                        total_number_of_voting_rights: number;
                    };
                };
            };
        };
        issuer: {
            lei: string;
            name: string;
        };
        person: {
            name: {
                title: string;
                lastName: string;
                firstName: string;
            };
        };
        reason: {
            type: {
                initial: number;
            };
            position: {
                boardofdirectors: number;
            };
        };
        country: string;
        news_id: string;
        Language: string;
        headline: string;
        dd_version: string;
        tradingDetails: {
            issuer: {
                lei: string;
                name: string;
            };
            person: {
                name: {
                    title: string;
                    lastName: string;
                    firstName: string;
                };
            };
            reason: {
                type: {
                    initial: number;
                };
                position: {
                    boardofdirectors: number;
                };
            };
            dateOfTrade: string;
            priceVolume: {
                transaction: {
                    price: string;
                    volume: string;
                    priceCurrency: string;
                    volumeCurrency: string;
                }[];
            };
            typeOfTrade: {
                buy: number;
            };
            locationOfTrade: {
                stockExchange: {
                    stockExchangeCode: string;
                    stockExchangeName: string;
                };
            };
            dateOfTradeUtcText: string;
            financialInstrument: {
                identifier: string;
            };
            dateOfTradeUtcOffset: string;
            aggregatedInformation: {
                averagePrice: string;
                aggregatedVolume: string;
                averagePriceCurrency: string;
                aggregatedVolumeCurrency: string;
            };
        };
    };
};
