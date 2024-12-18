import { fetchDocument } from '$utils/documents/api';

export const prerender = false;
export const ssr = false;
export async function load({ params }) {
    return {
        item: await fetchDocument(params.uuid),
        thumbType: params.thumb_type
    };
}
