import { sendPost } from '@eqs/cms-svelte-irtools/api';
import { joinUrlPath, type ProblemJsonResponse } from '@eqs/cms-svelte-irtools';
import { ALLOWED_FIELDS_CONTACT_DATA } from './constants';
import { filterOutFields, removeEmptyFields } from './ops';
import type { ApiResponse, CategoryValueMap, NameValueMap } from './types';
import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX } from '$env/static/public';
import { locale } from '$lib/translations';
type ContactApiResponse = ApiResponse & ProblemJsonResponse & { status?: boolean };

export type ContactApiPostData = {
    email: string;
    locale?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    gender?: string;
    jobTitle?: string;
    subscribeRecaptchaToken: string;
    otherEmails?: CategoryValueMap[];
    streetName?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    phone?: string;
    otherPhones?: CategoryValueMap[];
    faxes?: CategoryValueMap[];
    meta?: NameValueMap[];
    category?: string[];
    distributionList?: string[];
    supportedDist?: string[];
    directSendMail?: boolean;
};
export const createSubscription = async (data: ContactApiPostData) => {
    //filter and remove empty or illegal fields
    const formattedData = removeEmptyFields(filterOutFields(data, ALLOWED_FIELDS_CONTACT_DATA));
    const url = new URL(joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'tools/contacts'));
    const response = await sendPost(url, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json+ld'
        },
        body: JSON.stringify({
            ...formattedData,
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
