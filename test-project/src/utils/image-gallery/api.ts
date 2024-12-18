import { sendGet } from '@eqs/cms-svelte-irtools/api';
import { joinUrlPath, type HydraCollectionResponse } from '@eqs/cms-svelte-irtools';
import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, PUBLIC_BACKOFFICE } from '$env/static/public';
import { locale } from '$lib/translations';
import type { ImageGallery } from './types';
import { v4 as uuidv4 } from 'uuid';
import { postMessageToParentWindow } from '$utils/ops';

export const getUploadUrl = async (
    file: File,
    folderName: string,
    entityId: string,
    entityType: string
) => {
    const payload = {
        action: 'presignedUrl',
        folderName,
        fileName: file.name,
        language: locale.get(),
        entityId,
        entityType
    };
    postMessageToParentWindow({ payload });
    return Promise.resolve(true);
};

export const getImageGalleryFolderName = async (
    entityId: string,
    slug: string
): Promise<string> => {
    const url = new URL(joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'content/galleries'));
    const params = new URLSearchParams({
        entityId,
        page: '1',
        limit: '1'
    });

    url.search = params.toString();
    const res = await sendGet(url, undefined);
    const response = (await res.json()) as HydraCollectionResponse<ImageGallery>;
    const members = response['hydra:member'] ?? [];
    return members[0]?.folderName ?? uuidv4();
};

export const uploadImage = async (file: File, uploadUrl: string): Promise<boolean> => {
    const amzMatch = new RegExp(/^https:\/\/s3.[a-z-0-9]+.amazonaws.com\//);
    if (!amzMatch.test(uploadUrl)) {
        return false;
    }
    const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type
        },
        body: file
    });
    return res.status === 200;
};
