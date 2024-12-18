import type { PageLoad } from './$types';
import { base } from '$app/paths';
import { joinUrlPath, sendGet } from '@eqs/cms-svelte-irtools';
import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, PUBLIC_PAGE_NOT_FOUND } from '$env/static/public';
import { transformPeopleProfileList } from '$utils/people-profile/ops';

export const prerender = false;
export const ssr = false;
export const load: PageLoad = async ({ params }) => {
    const url = new URL(
        joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'content/people_profiles/', params.uuid)
    );
    const response = await sendGet(url, {
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.status !== 200) {
        if (typeof window !== 'undefined') {
            window.location.href = `${base}/${params.lang}/${PUBLIC_PAGE_NOT_FOUND}`;
        }
        return;
    }
    const profileList = await response.json();
    const peopleProfile = transformPeopleProfileList([profileList])[0];
    return { peopleProfile };
};
