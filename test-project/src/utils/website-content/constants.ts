import { PUBLIC_APP_ENV } from '$env/static/public';
import { AppEnvTypes } from '$utils/constants';
let isLoadedInIframe = false;
if (typeof window !== 'undefined') {
    isLoadedInIframe = window.parent !== window;
}

export const isPreviewMode = () => {
    const isPreviewEnvironment = PUBLIC_APP_ENV === AppEnvTypes.ProductionPreview;
    return isPreviewEnvironment && isLoadedInIframe;
};
