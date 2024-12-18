import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX } from '$env/static/public';
import { sendGet, joinUrlPath, type HydraCollectionResponse } from '@eqs/cms-svelte-irtools';
import type { CompanyContactData } from '$utils/company-contact/types';

export const fetchCompanyContactData = async (): Promise<any> => {
    const url = new URL(joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, `content/companies`));

    const response = await sendGet(url, {
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 200) {
        const responseData = (await response.json()) as Promise<
            HydraCollectionResponse<CompanyContactData>
        >;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return responseData['hydra:member'][0];
    }
    console.error('Failed to fetch company contact data');
    return null;
};
