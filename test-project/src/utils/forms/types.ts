export type GoogleRecaptchaConfig = {
    sitekey: string;
    locale?: string;
};

export type GoogleRecaptcha = {
    render: (id: string, options: { sitekey: string }) => number;
    execute: (id: number, options: { action: string }) => Promise<string>;
    ready: (callback: () => void) => void;
    reset: () => void;
    getResponse: () => string;
};

declare global {
    interface Window {
        grecaptcha: GoogleRecaptcha;
    }
}

export type FormStatus = 'initial' | 'inprogress' | 'success' | 'failed';
