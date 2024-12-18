import { googleRecaptchaConfig } from '../contact-form/constants';
import type { GoogleRecaptchaConfig } from '../contact-form/types';

const loadRecaptchaScript = async () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

export const initializeRecaptcha = async (recaptchaHtmlId: string) => {
    await loadRecaptchaScript();
    const googleRecaptcha = window.grecaptcha;
    googleRecaptcha.ready(() => {
        return googleRecaptcha.render(recaptchaHtmlId, {
            sitekey: googleRecaptchaConfig.sitekey
        } as GoogleRecaptchaConfig);
    });
};

export const generateUniqueId = (counter: number) => {
    counter++;
    return `checkbox-${counter}`;
};
