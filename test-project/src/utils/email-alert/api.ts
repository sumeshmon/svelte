import { ALLOWED_FIELDS_CONTACT_DATA } from './constants';
import { filterOutFields, removeEmptyFields } from './ops';
import type { ApiResponse, NameValueMap, PersonInfoType } from './types';
import { sendPost } from '@eqs/cms-svelte-irtools/api';
import { joinUrlPath } from '@eqs/cms-svelte-irtools';
import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX } from '$env/static/public';
type ContactApiResponse = ApiResponse & { status?: boolean };
import { locale } from '$lib/translations';

export type EmailAlertApiPostData = {
    email?: string;
    locale?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    company?: string;
    gender?: string;
    academicTitle?: string;
    subscribeRecaptchaToken: string;
    distributionList?: string[];
    supportedDist?: string[];
    countryCode?: string;
    meta?: NameValueMap[];
    type?: string;
    description?: string;
    occupation?: string;
    otherLocales?: string[];
};

export type EmailAlertUnSubPostData = {
    personalInfo: PersonInfoType;
    lastName?: string;
    occupation?: string;
    gender?: string;
    description?: string;
    academicTitle?: string;
    firstName?: string;
    countryCode?: string;
    meta?: string[];
    subscribeRecaptchaToken: string;
    middleName?: string;
    company?: string;
    salutation?: string;
    email: string;
};

export const createSubscription = async (data: EmailAlertApiPostData) => {
    const url = new URL(joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'tools/subscribers'));
    //filter and remove empty or illegal fields
    const formattedData = removeEmptyFields(filterOutFields(data, ALLOWED_FIELDS_CONTACT_DATA));
    const response = await sendPost(url, {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...formattedData,
            type: 'alert',
            locale: formattedData.locale || locale.get()
        })
    }).then(async (res) => {
        return (await res.json()) as ContactApiResponse;
    });
    if (response.status === true) {
        return true;
    }
    throw new Error(response['hydra:description'] || response['detail']);
};
export const sendUnSubscriptionRequest = async (data: EmailAlertUnSubPostData) => {
    const url = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'tools/subscribers/unsubscribe')
    );
    //filter and remove empty or illegal fields
    const formattedData = removeEmptyFields(filterOutFields(data, ALLOWED_FIELDS_CONTACT_DATA));

    const response = await sendPost(url, {
        body: JSON.stringify({
            ...formattedData,
            type: 'alert',
            locale: locale.get()
        })
    }).then(async (res) => {
        return (await res.json()) as ContactApiResponse;
    });
    if (response.status === true) {
        return true;
    }
    throw new Error(response['hydra:description'] || response['detail']);
};
