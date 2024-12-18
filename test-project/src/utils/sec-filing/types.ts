export type SecFiling = {
    id: string;
    acceptanceDate: string;
    avaialbeFormats: string[];
    company_id: string;
    externalId: string;
    created: string;
    filedDate: string;
    periodEndDate: string;
    receivedDate: string;
    processed: boolean;
    ticker: string;
    resources: SecFilingsResource;
    formType: SecFilingFormType;
    xbrlInfo: XbrlInfo;
};

export type SecFilingsUniqueYear = {
    year: string;
};

export type SecFilingFormType = {
    id: number;
    longDesc: string;
    mnemonic: string;
    shortDesc: string;
};

export type SecFilingsResource = {
    [key: string]: string;
};

export type SecFilingsCategory = {
    id: string;
    categoryName: string;
    alertCode: string;
    formType: SecFilingFormType;
};

export type XbrlInfo = {
    viewer: string;
    sequence: Sequence[];
};

export type Sequence = {
    file: string;
    name: string;
    size: number;
    type: string;
    description: string;
};

export type SecFilingsDownloads = {
    id: string;
    shortDesc: string;
    format: string;
};
