import type { ApiResponse } from './types';
import { sendPost } from '@eqs/cms-svelte-irtools/api';
import { joinUrlPath } from '@eqs/cms-svelte-irtools';
import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX } from '$env/static/public';

export type ValidateUnSubscriptionTokenResponse = ApiResponse & {
    status: boolean;
};

export const validateUnSubscriptionToken = async (token: string) => {
    const url = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'alert/subscribers/unsubscribe', token)
    );
    const response = await sendPost(url, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async (res) => {
        return (await res.json()) as ValidateUnSubscriptionTokenResponse;
    });
    if (response.status) {
        return true;
    }
    throw new Error(response['hydra:description']);
};
