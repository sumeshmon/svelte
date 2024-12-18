import { browser } from '$app/environment';
import { PUBLIC_DISCLAIMER_ACCESS_MODE } from '$env/static/public';
import type { DisclaimerState } from './disclaimer';

export enum DisclaimerAccessType {
    localStorage = 'localStorage',
    noStorage = 'noStorage'
}

export const saveDisclaimerToStorage = (key: string, disclaimer: DisclaimerState): void => {
    const canUseLocalStorage = PUBLIC_DISCLAIMER_ACCESS_MODE === DisclaimerAccessType.localStorage;

    const expiry = new Date().getTime() + 5 * 60 * 1000;
    browser &&
        canUseLocalStorage &&
        localStorage?.setItem(key, `${JSON.stringify(disclaimer)}|${expiry}`);
};
export const getDisclaimerFromStorage = (key: string): DisclaimerState => {
    const canUseLocalStorage = PUBLIC_DISCLAIMER_ACCESS_MODE === DisclaimerAccessType.localStorage;
    const value = browser && canUseLocalStorage && localStorage?.getItem(key);
    let disclaimer = 'null';
    let expiry = 0;
    if (value) {
        const valueArray = value.split('|');
        expiry = parseInt(valueArray[1] ?? 0);
        disclaimer = expiry < new Date().getTime() ? 'null' : valueArray[0];
    }
    expiry = new Date().getTime() + 5 * 60 * 1000;
    return JSON.parse(disclaimer);
};
