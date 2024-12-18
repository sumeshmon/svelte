import { WebsiteModules } from '$utils/constants';
import { fetchNewsDetailByOrigin } from '$utils/news/api';

export const prerender = false;
export const ssr = false;
export async function load({ params }) {
    switch (params.type) {
        case WebsiteModules.CustomNews:
            return await fetchNewsDetailByOrigin(params.uuid);
    }
}
