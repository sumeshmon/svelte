import { locale } from '$lib/translations';
import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';

export const contactFormUrlConfirmPrefix = 'alert/contacts/subscribe';

export const googleRecaptchaConfig = {
    sitekey: PUBLIC_RECAPTCHA_SITE_KEY,
    locale: locale.get()
};

export const ALLOWED_FIELDS_CONTACT_DATA = [
    'email',
    'locale',
    'firstName',
    'lastName',
    'company',
    'gender',
    'jobTitle',
    'subscribeRecaptchaToken',
    'otherEmails',
    'streetName',
    'postalCode',
    'city',
    'countryCode',
    'phone',
    'otherPhones',
    'faxes',
    'meta',
    'category',
    'distributionList',
    'supportedDist',
    'directSendMail'
];
