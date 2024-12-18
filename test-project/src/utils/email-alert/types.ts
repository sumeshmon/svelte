import type { HydraResponse } from '@eqs/cms-svelte-irtools';

export type PersonInfoType = {
    email?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    company?: string;
    academicTitle?: string;
    gender?: string;
    salutation?: string;
    occupation?: string;
    description?: string;
    countryCode?: string;
    meta?: string[];
};

export type UpdatePersonInfoType = {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    company?: string;
    academicTitle?: string;
    gender?: string;
    salutation?: string;
    occupation?: string;
    description?: string;
    countryCode?: string;
    meta?: NameValueMap[];
    distributionList: string[];
    otherLocales?: string[];
};

export type GoogleRecaptchaConfig = {
    sitekey: string;
    locale?: string;
};

export type ApiResponse = HydraResponse;

export type CategoryValueMap = {
    category: string;
    value: string;
};

export type NameValueMap = {
    name: string;
    value: string;
};
