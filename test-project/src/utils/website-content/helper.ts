import { fetchWebsiteContent } from './api';
import type { HydraCollectionResponse } from '@eqs/cms-svelte-irtools';
import type { WebsiteContent } from './types';
import { locale } from '$lib/translations';

export const getWebsiteContentBySlug = async (
    slug: URLSearchParams
): Promise<{ content: WebsiteContent[] }> => {
    const contentResponse: HydraCollectionResponse<WebsiteContent> = await fetchWebsiteContent(
        slug
    );
    const { 'hydra:member': websiteContentItems } = contentResponse; // Destructuring to extract 'hydra:member' property

    const updatedWebsiteContent = await Promise.all(
        websiteContentItems.map(async (item) => {
            const filteredLocalIds = item.localId.filter(
                (loc) => loc.languageCode === locale.get()
            );
            return { ...item, localId: filteredLocalIds }; // Return the item with filtered localId array
        })
    );

    return { content: updatedWebsiteContent };
};

export const getWebsiteContentHtml = (item: WebsiteContent) => {
    return item.localId.map((loc) => loc.content).join('');
};
