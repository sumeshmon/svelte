import type { ApiResponse } from './types';
import { joinUrlPath, sendGet, sendPost } from '@eqs/cms-svelte-irtools/api';
import type { PersonInfoType } from '$utils/email-alert/types';
import { filterOutFields, removeEmptyFields } from '$utils/email-alert/ops';
import { ALLOWED_FIELDS_CONTACT_DATA } from '$utils/email-alert/constants';
import type { EmailAlertApiPostData } from '$utils/email-alert/api';
import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX } from '$env/static/public';
import { locale } from '$lib/translations';

type EmailAlertUpdatePreferenceApiResponse = ApiResponse & { id?: string };

export type ValidateUpdateSubscriptionTokenResponse = ApiResponse & {
    id: string;
};

export const validateUpdatePreferenceSubscriptionToken = async (token: string) => {
    const url = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'alert/subscribers/get_by_token', token)
    );
    const response = await sendGet(url, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async (res) => {
        return (await res.json()) as ValidateUpdateSubscriptionTokenResponse;
    });
    if (response?.id) {
        return response as PersonInfoType;
    }
    throw new Error(response['hydra:description'] || response['detail']);
};

export const updateSubscription = async (data: EmailAlertApiPostData, token: string) => {
    const url = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'tools/subscribers/updatepreference')
    );
    //filter and remove empty or illegal fields
    const formattedData = removeEmptyFields(filterOutFields(data, ALLOWED_FIELDS_CONTACT_DATA));
    const response = await sendPost(url, {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...formattedData,
            type: 'alert',
            locale: formattedData.locale || locale.get(),
            token: token
        })
    }).then(async (res) => {
        return (await res.json()) as EmailAlertUpdatePreferenceApiResponse;
    });
    if (response?.id) {
        return true;
    }
    throw new Error(response['hydra:description'] || response['detail']);
};
