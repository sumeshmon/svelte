export type Event = {
    id: string;
    companyId: string;
    start: string;
    timezoneStart: string;
    end: string;
    timezoneEnd: string;
    isFutureEvent: number;
    timezone: string;
    allDayEvent: boolean;
    metaData: string[];
    localId: EventLocale[];
    sortOrder: null | number;
    isPublished: boolean;
    isScheduled: boolean;
    reminderSent: boolean;
    restrictions: [];
    tags: EventTag[];
    category: EventCategory[];
    reminderInterval: number;
    irManagerEmail: null | string;
    publishedEntityId: null | string;
    exactDateUnknown: boolean;
    legacyId: null | number;
    company: Company;
    draftAhead: boolean;
    itemPublished: boolean;
    itemScheduled: boolean;
    boxItems?: any;
    location?: string;
    titleUrl?: string;
    subheadline?: string | null;
    note?: string;
};
export type MetaData = {
    linkUrl: string;
    linkType: string;
    linkTitle: string;
};
export type EventLocale = {
    id: string;
    languageCode: string;
    headline: string;
    subheadline: string | null;
    location: string;
    description: string;
    details: string;
    metaData: MetaData[];
    note: string;
    showInsteadOfDate: null | boolean;
    titleUrl: string;
};
export type Company = {
    name: string;
    isin: string;
    wkn: string;
    irCenterType: string;
    sector: CompanySector[];
    market: CompanyMarket[];
    logo: Array<unknown>;
};
export type CompanySector = {
    name: string;
};
export type CompanyMarket = {
    name: string;
};
export type EventCategory = {
    id: string;
    region: null | string;
    name: string;
    slug: string;
    companyId: null | string;
    basicSet: boolean;
    metaData: any;
    localId: EventCategoryLocale[];
};
export type EventCategoryLocale = {
    id: string;
    categoryName: string;
    languageCode: string;
};
export type EventTag = {
    id: string;
    companyId: null | string;
    name: string;
    slug: string;
};
export type EventRestriction = {
    id: string;
    restrictionKey: string;
    restrictionName: string;
};
export type EventUniqueYear = {
    year: string;
};

export type BoxCategories = string | string[];
