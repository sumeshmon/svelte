export type ShareholderStructureData = {
    figureId: FigureId[];
    shareholderStructureMeta: ShareholderStructureMeta[];
    isPublished: boolean;
    isScheduled: boolean;
    category: Category;
    lastUpdatedDate: string;
    itemPublished: boolean;
    itemScheduled: boolean;
};
export type FigureId = {
    value: number;
    color: string;
    localId: LocalId[];
    sortOrder: number;
};
export type LocalId = {
    id: string;
    languageCode: string;
    title: string;
};
export type ShareholderStructureMeta = {
    languageCode: string;
    metaData: MetaData;
};

export type MetaData = {
    [key: string]: {
        key: string;
        name: string;
        value: string;
    };
};

export type Category = {
    name: string;
    slug: string;
};

export type ShareholderStructure = {
    highchartsData: HighchartsData;
    tableData: TableData;
    seriesName: string;
    footNote: string;
    lastUpdatedDate: string;
};

export type HighchartsData = {
    name: string;
    y: number;
    color: string;
}[];

export type TableData = [string | null | number, string | null | number][];

export type StockInfo = {
    stockInfoMeta: MetaData[];
    stockInfoType: StockInfoType[];
    itemPublished: boolean;
    itemScheduled: boolean;
};

export type StockInfoType = {
    id: string;
    stockType: string;
    securityCodeNumber: string;
    stockTradingSymbol: string;
    onlineDate: string;
    isin: string;
    cusip: string | null;
    wkn: string | null;
    rating: string | null;
    totalSharesOutstanding: string;
    capitalStock: string;
    localeId: StockInfoLocale[];
};

export type StockInfoLocale = {
    languageCode: string;
    stockExchange: string | null;
    stockIndex: string | null;
    sector: string | null;
    lastDividends: string | null;
    shareTypeStatedValue: string | null;
    metaData: MetaData[];
};

export type CompanyFundamentalLocale = {
    industry: string;
    sales: null | string;
    staff: null | string;
    subsidiaries: null | string;
    paymentAgency: null | string;
    metaData: MetaData[];
    localeCode: string;
};

export type CompanyFundamentalSegment = {
    name: string;
    slug: string;
};

export type CompanyFundamental = {
    id: string;
    yearOfFoundation: null | string;
    endOfBusinessYear: null | string;
    ric: null | string;
    bloombergTicker: null | string;
    locale: CompanyFundamentalLocale[];
    segment: CompanyFundamentalSegment | string | null;
    itemPublished: boolean;
    itemScheduled: boolean;
} & Partial<CompanyFundamentalLocale>;

export type IpoData = {
    firstTradingDay: string | null;
    offeringPeriodStart: string | null;
    offeringPeriodEnd: string | null;
    publishedEntityId: string | null;
    isPublished: boolean;
    isScheduled: boolean;
    ipoDataLocales: IpoDataLocale[];
    itemPublished: boolean;
    itemScheduled: boolean;
};

export type IpoDataLocale = {
    languageCode: string;
    bookBuildingRange: string;
    subscriptionPrice: string;
    issuingMethod: string;
    firstPrice: string;
    ipoVolume: string;
    greenshoeExecuted: string;
    legacyId: string | null;
    metaData: MetaData[];
    previewLegacyId: string | null;
    offeringPeriod: string | null;
    firstDay: string | null;
    leadManager: string | null;
    syndicate: string | null;
    note: string | null;
};

export type CompanyProfileLocale = {
    languageCode: string;
    profileContent: string;
    metaData: MetaData[];
    legacyId: null | string;
};

export type CompanyProfile = {
    isPublished: boolean;
    isScheduled: boolean;
    publishedEntityId: string;
    localeId: CompanyProfileLocale[];
    draftAhead: boolean;
    itemPublished: boolean;
    itemScheduled: boolean;
};

export type chartApi = {
    company_name: string;
    isin: string;
    exchange_name: string | null;
    currency: string | null;
    time_zone: string | null;
    time_last_price: number;
    last_price: string;
    change_relative: string;
    change_absolute: string;
    volume: string;
    turnover: number;
    open_price: string;
    high_price: string;
    low_price: string;
    previous_close_price: string;
    previous_close_time: number | null;
    week_52_high_price: string;
    week_52_high_time: number;
    week_52_low_price: string;
    week_52_low_time: number;
    sign_prefix: string;
};

export type CombinedCompanyData = {
    isPublished?: boolean;
    isScheduled?: boolean;
    itemPublished?: boolean;
    itemScheduled?: boolean;
    publishedEntityId?: string | null;
    metaData?: MetaData[] | null;
} & Partial<IpoData> &
    Partial<CompanyFundamental> &
    Partial<StockInfo>;
