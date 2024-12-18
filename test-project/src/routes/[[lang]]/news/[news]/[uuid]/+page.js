import { base } from '$app/paths';
import { joinUrlPath, sendGet } from '@eqs/cms-svelte-irtools';
import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, PUBLIC_PAGE_NOT_FOUND } from '$env/static/public';
export const prerender = false;
export const ssr = false;
export async function load({ params }) {
    const url = new URL(
        joinUrlPath(
            PUBLIC_API_ENDPOINT,
            PUBLIC_API_PREFIX,
            'content/generalized_news/',
            params.uuid
        )
    );
    const response = await sendGet(url, {
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.status !== 200) {
        window.location.href = `${base}/${params.lang}/${PUBLIC_PAGE_NOT_FOUND}`;
        return;
    }

    return await response.json();
}
