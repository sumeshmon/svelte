import type { ApiResponse } from './types';
import { joinUrlPath, sendPost } from '@eqs/cms-svelte-irtools/api';
import type { ProblemJsonResponse } from '@eqs/cms-svelte-irtools';
import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX } from '$env/static/public';

export type ValidateSubscriptionTokenResponse = ApiResponse &
    ProblemJsonResponse & {
        id: string;
    };

export const validateSubscriptionToken = async (token: string, confirmUrlPrefix: string) => {
    const requestUrl = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, confirmUrlPrefix, token)
    );
    const response = await sendPost(requestUrl, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/ld+json'
        }
    }).then(async (res) => {
        return (await res.json()) as ValidateSubscriptionTokenResponse;
    });
    if (!!response.id === true) {
        return true;
    }
    throw new Error(response['hydra:description'] || response['detail']);
};
