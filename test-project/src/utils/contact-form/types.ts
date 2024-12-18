import type { HydraResponse } from '@eqs/cms-svelte-irtools';

export type PersonInfoType = {
    email?: string;
    emailReception?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    gender?: string;
    jobTitle?: string;
    streetName?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    phone?: string;
    mobilePhoneBusiness?: string;
    mobilePhonePrivate?: string;
    phoneReception?: string;
    faxReception?: string;
    age?: number;
    ageGroup?: string;
    affiliation?: string;
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
