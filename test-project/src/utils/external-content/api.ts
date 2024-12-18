import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX } from '$env/static/public';
import { sendGet, joinUrlPath } from '@eqs/cms-svelte-irtools';

export const fetchExternalContent = async (slug: string): Promise<any> => {
    const url = new URL(
        joinUrlPath(
            PUBLIC_API_ENDPOINT,
            PUBLIC_API_PREFIX,
            `content/external_contents/slug/${slug}`
        )
    );

    return await sendGet(url, undefined);
};
