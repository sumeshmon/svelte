import { fetchDocument } from '$utils/documents/api';

export const prerender = false;
export const ssr = false;
export async function load({ params }) {
    return await fetchDocument(params.uuid);
}
