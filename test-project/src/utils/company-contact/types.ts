export type CompanyContactData = {
    id: string;
    name: string;
    isin: string;
    wkn: string;
    irCenterType: string;
    sector: CompanySector[];
    market: CompanyMarket[];
    logo: CompanyLogo[];
    showOnPortals: false;
    cockpitCompanyData: CockpitCompanyData;
    isTestCompany: true;
};

export type CompanySector = {
    name: string;
};
export type CompanyMarket = {
    name: string;
};
export type CompanyLogo = {
    filePath: string;
    fileType: string;
    fileGroup: string;
};
export type CockpitCompanyData = {
    fax: string;
    tel: string;
    url: string;
    zip: string;
    city: string;
    email: string;
    street: string;
    country: string;
    company_name: string;
};
