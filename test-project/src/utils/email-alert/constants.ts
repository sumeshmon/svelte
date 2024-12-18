import { locale } from '$lib/translations';
import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';

export const alertConfirmUrlPrefix = 'alert/subscribers/subscribe';

export const googleRecaptchaConfig = {
    sitekey: PUBLIC_RECAPTCHA_SITE_KEY,
    locale: locale.get()
};

export const ALLOWED_FIELDS_CONTACT_DATA = [
    'email',
    'locale',
    'firstName',
    'middleName',
    'lastName',
    'company',
    'gender',
    'academicTitle',
    'subscribeRecaptchaToken',
    'distributionList',
    'supportedDist',
    'countryCode',
    'meta',
    'type',
    'description',
    'occupation',
    'otherLocales'
];

export const EVENT_REMINDER_DISTRIBUTION_LIST = 'event-reminder';
