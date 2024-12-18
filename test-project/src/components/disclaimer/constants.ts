import IpoDisclaimer from './IpoDisclaimer/IpoDisclaimer.svelte';
import GeneralDisclaimer from './GeneralDisclaimer/GeneralDisclaimer.svelte';
export enum DISCLAIMERS {
    GENERAL = 'general',
    IPO = 'ipo'
}

export const DISCLAIMER_TO_COMPONENT_MAP = {
    [DISCLAIMERS.IPO]: IpoDisclaimer,
    [DISCLAIMERS.GENERAL]: GeneralDisclaimer
};

export const DISCLAIMER_ALLOWED_COUNTRIES = {
    [DISCLAIMERS.IPO]: [
        'BE',
        'BG',
        'DK',
        'DE',
        'EE',
        'FI',
        'FR',
        'GR',
        'IE',
        'IT',
        'HR',
        'LV',
        'LT',
        'LU',
        'MT',
        'NL',
        'AT',
        'PL',
        'PT',
        'RO',
        'SE',
        'SK',
        'SI',
        'ES',
        'CZ',
        'HU',
        'CY',
        'IS',
        'LI',
        'NO',
        'GB',
        'CH',
        'US'
    ],
    [DISCLAIMERS.GENERAL]: ['DE', 'AT']
};
