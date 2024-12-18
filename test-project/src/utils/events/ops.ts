import { PUBLIC_FALLBACK_LOCALE, PUBLIC_PAGE_LIMIT } from '$env/static/public';
import type {
    Event,
    EventCategory,
    EventCategoryLocale,
    EventLocale,
    MetaData,
    BoxCategories
} from './types';
import { type OptionType } from '@eqs/cms-svelte-irtools';
import { fetchEventCategories, fetchEvents, fetchEventUniqueYears } from './api';
import { PaginatorType } from '$utils/constants';
import { locale } from '$lib/translations';
import { formatDate, sanitizeFilename } from '$utils/ops';
import { addDays, format } from 'date-fns';
import { getDocumentUrl } from '$utils/documents/helper';

/**
 * Fetches a list of events based on the provided parameters, and returns an object containing the events and the total number of items.
 * The function constructs a set of query parameters based on the provided options, and uses these to fetch the events.
 * The options include language, items per page, years, categories, timeline, tags, search term, page number, whether it's a landing page, and various order parameters.
 * If an option is not provided, a default value is used.
 * @param options An object containing the options for fetching the events. All properties are optional and have default values.
 * @returns A Promise that resolves to an object containing an array of events and the total number of items.
 * @throws Will throw an error if the fetch operation fails.
 */
export const getEventsList = async ({
    lang = PUBLIC_FALLBACK_LOCALE,
    itemsPerPage = PUBLIC_PAGE_LIMIT,
    years = [],
    months = [],
    categories = [],
    timeline = null,
    tags = [],
    search = null,
    page = null,
    isLandingPage = false,
    startOrder = 'DESC',
    sortOrder = null,
    dateOrder = null,
    timeOrder = null,
    restrictions = []
}: {
    lang?: string | null;
    itemsPerPage?: string;
    years?: Array<string>;
    months?: Array<string>;
    categories?: Array<string>;
    timeline?: string | null;
    tags?: Array<string>;
    search?: string | null;
    page?: number | null;
    isLandingPage?: boolean;
    startOrder?: string | null;
    sortOrder?: string | null;
    dateOrder?: string | null;
    timeOrder?: string | null;
    restrictions?: Array<string>;
} = {}): Promise<{ events: Event[]; totalItems: number }> => {
    const queryParams = new URLSearchParams();
    page && queryParams.append('page', page.toString());
    search && queryParams.append('search', search.toString());
    lang && queryParams.append('localId.languageCode[]', lang);
    itemsPerPage && queryParams.append('limit', itemsPerPage);
    timeline && queryParams.append('timeline', timeline);
    isLandingPage && queryParams.append('without_restriction[]', 'do_not_show_on_ir_landing_page');
    categories &&
        categories[0] !== '' &&
        categories.forEach((category) => queryParams.append('category.slug[]', category));
    tags && tags.forEach((tag) => queryParams.append('tags.slug[]', tag));
    if (years.length > 0) {
        years.forEach((year) => {
            if (year) {
                // For archive & fiscal years
                if (year.includes('_')) {
                    const archiveYears = year.split(/[_]/);
                    queryParams.append('start[after]', archiveYears[1] + 'T00:00:00');
                    queryParams.append('start[before]', archiveYears[0] + 'T23:59:59');
                } else if (year !== '') {
                    queryParams.append('years[]', year);
                }
            }
        });
    }
    months && months.forEach((month) => queryParams.append('months[]', month));
    sortOrder && queryParams.append('sortOrder', sortOrder);
    timeOrder && queryParams.append('timeOrder', timeOrder);
    dateOrder && queryParams.append('dateOrder', dateOrder);
    startOrder && queryParams.append('order[start]', startOrder);
    restrictions &&
        restrictions.forEach((restriction) =>
            queryParams.append('restriction_without_restriction[]', restriction)
        );
    const events = await fetchEvents(queryParams);
    const { 'hydra:member': eventItems, 'hydra:totalItems': totalItems } = events;
    eventItems.forEach((event) => {
        event.location = getEventLocation(event) || '';
        event.titleUrl = getEventLocaleValue(event, 'titleUrl') || '';
        event.subheadline = getEventLocaleValue(event, 'subheadline') || '';
        event.note = getEventLocaleValue(event, 'note') || '';
    });
    return { events: eventItems as Event[], totalItems: totalItems as number };
};

/**
 * Prepares a list of events for display, based on the provided list of events and pagination type.
 * If the pagination type is 'LoadMore', the function appends new events to the existing list, avoiding duplicates.
 * Otherwise, the function simply returns the provided list of events.
 * @param events An array of new events to be added to the list.
 * @param eventsList The existing list of events.
 * @param paginatorType The type of pagination being used. If 'LoadMore', new events are appended to the existing list.
 * @returns An array of events, either the updated existing list or the provided list of new events, depending on the pagination type.
 */
export const prepareEventsList = (
    events: Event[],
    eventsList: Event[],
    paginatorType: string | boolean
) => {
    if (paginatorType == PaginatorType.LoadMore) {
        eventsList = [
            ...eventsList,
            ...events.filter(
                (newsItem) => !eventsList.some((existingNews) => existingNews.id === newsItem.id)
            )
        ];
    } else {
        eventsList = events;
    }
    return eventsList as Event[];
};

/**
 * Fetches event categories based on provided category slugs, and returns an array of category data.
 * Each category data object contains the localized category name and the category slug.
 * If no categories are found or an error occurs, an empty array is returned.
 * @param categories An array of category slugs to fetch. If empty, all categories are fetched.
 * @returns An array of category data objects, each containing a 'name' and 'value' property. 'name' is the localized category name, and 'value' is the category slug.
 * @throws Will log an error message to the console if an error occurs during the fetch operation.
 */
export const getEventsCategories = async (categories: string[] = []) => {
    try {
        const params = new URLSearchParams();
        if (categories.length > 0) {
            categories.forEach((category) => {
                params.append('slug[]', category);
            });
        }
        const response = await fetchEventCategories(params);
        const responseCategories = response['hydra:member'];

        const categoriesCount = response['hydra:totalItems'];
        let categoryData: { name: string; value: string }[] = [];
        const lang = locale.get();
        if (categoriesCount > 0) {
            categoryData = responseCategories.map((c) => ({
                name:
                    c.localId.find((locale) => locale?.languageCode === lang)?.categoryName ??
                    c.name,
                value: c.slug
            }));
        }
        return categoryData;
    } catch (error) {
        console.error('Error fetching Events Categories:', error);
        return [];
    }
};

/**
 * Fetches unique years for events based on the provided parameters.
 * @param params An optional URLSearchParams object.
 * @param noOfYears An optional number specifying the maximum number of years to include.
 * @param archive A boolean indicating whether to include archive data.
 * @param fiscalYearBeginMD An optional string representing the start date of the fiscal year in MM-DD format.
 * @param fiscalYearEndMD An optional string representing the end date of the fiscal year in MM-DD format.
 * @param showAllYears A boolean indicating whether to include an entry for "All".
 * @param archiveTill An optional string representing the year up to which the archive extends in YYYY format.
 * @param timeline An optional string indicating the timeline filter ('upcoming', 'past' or null).
 * @returns An array of objects representing unique years for events.
 */
export const fetchYears = async ({
    params = new URLSearchParams(),
    noOfYears = null,
    archive = false,
    fiscalYearBeginMD = null,
    fiscalYearEndMD = null,
    showAllYears = false,
    archiveTill = '',
    timeline = null
}: {
    params?: URLSearchParams;
    noOfYears?: number | null;
    archive?: boolean;
    fiscalYearBeginMD?: string | null;
    fiscalYearEndMD?: string | null;
    showAllYears?: boolean;
    archiveTill?: string;
    timeline?: string | null;
} = {}) => {
    try {
        if (timeline) {
            params.append('timeline', timeline);
        }
        if (fiscalYearBeginMD && fiscalYearEndMD) {
            const [monthBegin, dayBegin] = fiscalYearBeginMD.split('-');
            const [monthEnd, dayEnd] = fiscalYearEndMD.split('-');
            params.append('fiscal[from]', `${dayBegin}-${monthBegin}`);
            params.append('fiscal[to]', `${dayEnd}-${monthEnd}`);
        }
        const response = await fetchEventUniqueYears(params);
        const uniqueYears = response['hydra:member'];
        const yearsCount = response['hydra:totalItems'];

        let uniqueYearsData: OptionType[] = [];

        showAllYears && uniqueYears.unshift({ year: 'common.all' });

        if (yearsCount > 0) {
            uniqueYearsData = getUniqueYearsData(uniqueYears, fiscalYearBeginMD, fiscalYearEndMD);
            if (noOfYears) {
                uniqueYearsData = uniqueYearsData.slice(0, noOfYears);
            }
            if (archive) {
                uniqueYearsData = processArchiveData(
                    uniqueYearsData,
                    uniqueYears,
                    fiscalYearBeginMD,
                    fiscalYearEndMD,
                    archiveTill
                );
            }
        } else if (yearsCount == 0) {
            uniqueYearsData = [];
        }

        return uniqueYearsData;
    } catch (error) {
        console.error('Error fetching Events years:', error);
        return [];
    }
};

/**
 * Creates data for a Tab/DropDown component based on a list of unique years.
 * The function maps each year in the uniqueYears array to an object with a name and value.
 * If fiscal year settings are provided, the function adjusts the year values accordingly.
 * @param uniqueYears An array of objects, each containing a year.
 * @param fiscalYearBeginMD The start date of the fiscal year, in MM-DD format, or null if not provided.
 * @param fiscalYearEndMD The end date of the fiscal year, in MM-DD format, or null if not provided.
 * @returns An array of objects, each containing a name and value representing a year for the Tab/DropDown component.
 */
const getUniqueYearsData = (
    uniqueYears: Array<{ year: string }>,
    fiscalYearBeginMD: string | null,
    fiscalYearEndMD: string | null
) => {
    return uniqueYears.map((y) => {
        if (fiscalYearBeginMD && fiscalYearEndMD) {
            const year =
                parseInt(y.year) +
                1 +
                '-' +
                fiscalYearEndMD +
                '_' +
                y.year +
                '-' +
                fiscalYearBeginMD;
            return { name: y.year, value: y.year == 'common.all' ? '' : year };
        } else {
            return { name: y.year, value: y.year == 'common.all' ? '' : y.year };
        }
    });
};

/**
 * Processes a list of unique years for display in the archive tab.
 * The function modifies the years based on the provided fiscal year settings, if any.
 * @param uniqueYearsData An array of unique years, each represented as an object with a name and value.
 * @param uniqueYears An array of objects, each containing a year.
 * @param fiscalYearBeginMD The start date of the fiscal year, in MM-DD format, or null if not provided.
 * @param fiscalYearEndMD The end date of the fiscal year, in MM-DD format, or null if not provided.
 * @param archiveTill The year up to which the archive extends, in YYYY format.
 * @returns An array of unique years, with an added entry for the archive if necessary.
 */
const processArchiveData = (
    uniqueYearsData: OptionType[],
    uniqueYears: Array<{ year: string }>,
    fiscalYearBeginMD: string | null,
    fiscalYearEndMD: string | null,
    archiveTill: string
) => {
    const lastYearSliced = uniqueYearsData[uniqueYearsData.length - 1].value;
    let archiveFromMD: string = '-12-31';
    let archiveTillMD: string = '-01-01';
    let archiveFrom: string = '';
    const lastYearAvailable = uniqueYears[uniqueYears.length - 1]['year'];

    archiveFrom = (parseInt(lastYearSliced) - 1).toString();
    archiveTill || (archiveTill = lastYearAvailable);

    if (fiscalYearBeginMD && fiscalYearEndMD) {
        const fiscalYearData = lastYearSliced.split('_');
        archiveFrom = fiscalYearData[1].split('-')[0];
        archiveFromMD = '-' + fiscalYearEndMD;
        archiveTillMD = '-' + fiscalYearBeginMD;
    }

    const hasYearLessThanArchiveFrom = uniqueYears.some((entry) => {
        const year = parseInt(entry.year);
        return !isNaN(year) && year <= parseInt(archiveFrom);
    });
    if (hasYearLessThanArchiveFrom) {
        uniqueYearsData.push({
            name: 'common.archive',
            value: archiveFrom + archiveFromMD + '_' + archiveTill + archiveTillMD
        });
    }
    return uniqueYearsData;
};

/**
 * Retrieves a locale-specific value for a given field from an event.
 * @param event The event from which to retrieve the locale-specific value.
 * @param field The field for which to retrieve the locale-specific value.
 * @param locale The locale for which to retrieve the value.
 * @returns The locale-specific value for the specified field, or an empty string if no matching locale or field is found.
 */
export const getEventLocaleSpecificValue = (
    event: Event,
    field: keyof EventLocale,
    locale: string
) => {
    return (event.localId?.filter((l: EventLocale) => l.languageCode === locale).pop()?.[field] ||
        '') as string;
};

/**
 * Retrieves the localized value of a specified field from an event object,
 * with optional fallback behavior to default locales or non-empty local IDs.
 * @param event The event object containing localized data.
 * @param field The field key to retrieve from the localized data.
 * @param fallback If true, the function will return the value immediately if it's found. If false, it will try to find a fallback value.
 * @returns The localized value of the specified field, or an empty string if not found and fallback is enabled.
 */
export const getEventLocaleValue = (event: Event, field: keyof EventLocale, fallback = true) => {
    const value = getEventLocaleSpecificValue(event, field, locale.get());
    if (!fallback) {
        return value;
    }
    const fallbackValue = getEventLocaleSpecificValue(event, field, PUBLIC_FALLBACK_LOCALE);
    const notEmptyValue = event.localId?.filter((l) => l[field]).pop()?.[field];
    return (value || fallbackValue || notEmptyValue || '') as string;
};

/**
 * Retrieves the localized 'location' field value from an event object,
 * with optional fallback behavior if the value is not found.
 * @param event The event object containing localized data.
 * @param fallback If true, the function will return the value immediately if it's found. If false, it will try to find a fallback value.
 * @returns The localized 'location' value, or an empty string if not found and fallback is enabled.
 */
export const getEventLocation = (event: Event, fallback = true) => {
    return getEventLocaleValue(event, 'location', fallback);
};

/**
 * Retrieves the localized 'description' field value from an event object as the event title,
 * with optional fallback behavior to 'headline' field if the 'description' value is not found.
 * @param event The event object containing localized data.
 * @param fallback If true, the function will return the 'description' value immediately if it's found. If false, it will try to find a fallback value in the 'headline' field.
 * @returns The localized 'description' or 'headline' value as the event title, or an empty string if neither is found and fallback is enabled.
 */
export const getEventTitle = (event: Event, fallback = true) => {
    const description = getEventLocaleValue(event, 'description', fallback);
    return description || getEventLocaleValue(event, 'headline', fallback);
};

/**
 * Retrieves the details of an event.
 * @param event An object representing an event.
 * @param fallback A boolean indicating whether to use the fallback value if the 'details' property is not found. Default is true.
 * @returns The details of the event.
 */
export const getEventDetails = (event: Event, fallback = true) => {
    return getEventLocaleValue(event, 'details', fallback);
};

/**
 * Retrieves the URL of an event.
 * @param event An object representing an event.
 * @param fallback A boolean indicating whether to use the fallback value if the 'titleUrl' property is not found. Default is true.
 * @returns The URL of the event.
 */
export const getEventUrl = (event: Event, fallback = true) => {
    return getEventLocaleValue(event, 'titleUrl', fallback);
};

/**
 * Retrieves the metadata links for an event.
 * @param event An object representing an event.
 * @param fallback A boolean indicating whether to use fallback values for the 'metaData' property.
 * @returns The metadata links for the event as HTML.
 */
export const getEventMetaDataLinks = (event: Event, fallback = true) => {
    let links: string = '';
    const metaData = getEventLocaleValue(event, 'metaData', fallback);
    if (!Array.isArray(metaData)) {
        return;
    }
    metaData.forEach((item: MetaData) => {
        if (item?.linkUrl) {
            const anchorElement = document.createElement('a');
            anchorElement.href = /^(https?:\/\/|\/\/)/i.test(item.linkUrl)
                ? item.linkUrl
                : '//' + item.linkUrl;

            const spanElement = document.createElement('span');
            spanElement.classList.add(`icon-master-`);
            spanElement.classList.add(`events__icon-${item.linkType.toLowerCase()}`);

            anchorElement.appendChild(spanElement);
            anchorElement.appendChild(document.createTextNode(item.linkTitle));

            anchorElement.classList.add('events__meta-link');
            anchorElement.setAttribute('data-type', item.linkType.toLowerCase());

            links += anchorElement.outerHTML;
        }
    });

    return links;
};

/**
 * Retrieves the name of an event category.
 * @param category An object representing an event category.
 * @returns The name of the event category.
 */
export const getEventCategoryName = (category: EventCategory) => {
    const value = category.localId
        ?.filter((l: EventCategoryLocale) => l.languageCode === locale.get())
        .pop()?.categoryName;
    const fallbackValue = category.localId
        ?.filter((l: EventCategoryLocale) => l.languageCode === PUBLIC_FALLBACK_LOCALE)
        .pop()?.categoryName;
    const notEmptyValue = category.localId
        ?.filter((l: EventCategoryLocale) => l.categoryName)
        .pop()?.categoryName;
    return (value || fallbackValue || notEmptyValue || '') as string;
};

/**
 * Formats the date of an event based on the provided format and options.
 * @param event An object representing an event.
 * @param dateFormat An object specifying the format for date parts.
 * @returns A formatted date string for the event.
 */
export const getEventFormattedDate = (
    event: Event,
    dateFormat: { [key: string]: { [key: string]: string } } = {
        // Define the format for date parts such as weekday, day, month, year, hour, minute and second (Intl.DateTimeFormat options).
        // For each part, you can choose from options like "numeric", "2-digit", "narrow", "short", and "long" (Intl.DateTimeFormat values).
        // Add a delimiter along with the value for each part to separate them in the formatted date. Below is the example for EN: February 11, 2025 and DE: 11.02.2025
        en: {
            //weekday: 'short, ', // "narrow", "short", and "long"
            month: 'long ', // "numeric", "2-digit", "narrow", "short", and "long"
            day: '2-digit, ', // "numeric", "2-digit"
            year: 'numeric ' // "numeric", "2-digit"
            //hour: '2-digit:', // "numeric", "2-digit"
            //minute: '2-digit:', // "numeric", "2-digit"
            //second: '2-digit ' // "numeric", "2-digit"
        },
        de: {
            //weekday: 'short, ', // "narrow", "short", and "long"
            day: '2-digit.', // "numeric", "2-digit"
            month: '2-digit.', // "numeric", "2-digit", "narrow", "short", and "long"
            year: 'numeric ' //"numeric", "2-digit"
            //hour: '2-digit:', // "numeric", "2-digit"
            //minute: '2-digit:', // "numeric", "2-digit"
            //second: '2-digit ' // "numeric", "2-digit"
        }
    }
) => {
    const showInsteadOfDate = getEventLocaleSpecificValue(event, 'showInsteadOfDate', locale.get());
    if (showInsteadOfDate) {
        return showInsteadOfDate;
    }
    const options: Intl.DateTimeFormatOptions = { hour12: false };
    if (event?.timezone) {
        options.timeZone = event.timezone;
    }

    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    if (event.exactDateUnknown === true) {
        return formatExactDateUnknown(startDate, options);
    }
    if (!event.end || event.start == event.end) {
        return formatDate(startDate, options, dateFormat);
    }

    const startDateFormatted = formatDate(startDate, options, dateFormat);
    const endDateFormatted = formatDate(endDate, options, dateFormat);
    const isSameDate = startDateFormatted === endDateFormatted;

    if (isSameDate) {
        return `${startDateFormatted}`;
    } else {
        return `${startDateFormatted} - ${endDateFormatted}`;
    }
};

/**
 * Creates a filename for an ICS file based on the event's title and date.
 * @param event An object representing an event.
 * @returns A filename for the ICS file.
 */
export const createIcsFilename = (event: Event) => {
    const dateFormat: { [key: string]: { [key: string]: string } } = {};
    dateFormat['en'] = {
        year: 'numeric-', // "numeric", "2-digit"
        month: '2-digit-', // "numeric", "2-digit", "narrow", "short", and "long"
        day: '2-digit' // "numeric", "2-digit"
    };
    dateFormat['de'] = {
        year: 'numeric-', // "numeric", "2-digit"
        month: '2-digit-', // "numeric", "2-digit", "narrow", "short", and "long"
        day: '2-digit' // "numeric", "2-digit"
    };
    const eventTitle = getEventTitle(event);
    const eventDate = formatDate(new Date(event.start), {}, dateFormat);

    if (eventTitle && eventDate) {
        return sanitizeFilename(eventTitle + '-' + eventDate) + '.ics';
    } else {
        return 'event.ics';
    }
};
/**
 * Checks whether to show the ICS icon based on various conditions.
 * @param event An object representing an event.
 * @returns A boolean indicating whether to show the ICS icon.
 */
export const checkEventIcs = (event: Event) => {
    if (event.isFutureEvent && !event.exactDateUnknown) {
        const showInsteadOfDate = getEventLocaleSpecificValue(
            event,
            'showInsteadOfDate',
            locale.get()
        );
        return showInsteadOfDate === ''; //if showInsteadOfDate is empty then show ICS
    } else {
        return false;
    }
};

/**
 * Formats a date when the exact date is unknown.
 * @param date A Date object representing the date to be formatted.
 * @param options An optional object specifying additional formatting options.
 * @returns A formatted date string.
 */
export const formatExactDateUnknown = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    const dateFormat: { [key: string]: { [key: string]: string } } = {};
    dateFormat['en'] = {
        month: 'short ',
        year: 'numeric'
    };
    dateFormat['de'] = {
        month: 'short ',
        year: 'numeric '
    };
    return formatDate(date, options, dateFormat);
};

export const generateEventIcsFile = (
    events: Event | Event[],
    fileName: string,
    timeline: string | null = null
) => {
    if (timeline === 'past' && Array.isArray(events)) {
        return;
    }

    if (Array.isArray(events)) {
        events = events.filter(checkEventIcs);
        if (events.length === 0) return;
    } else if (!checkEventIcs(events)) {
        return;
    }

    const icsContent = `BEGIN:VCALENDAR
PRODID:-////NONSGML IR Website//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
${Array.isArray(events) ? events.map(renderIcsVEvent).join('\n') : renderIcsVEvent(events)}
END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    setTimeout(() => {
        downloadLink.click();
    }, 0);
    //downloadLink.click();
};

export const renderIcsVEvent = (item: Event) => {
    const companyName: string = item?.company?.name ? `${item.company.name}: ` : '';
    let vEvent = `BEGIN:VEVENT
SUMMARY:${companyName}${unescapeSummery(getEventLocaleValue(item, 'headline'))}
UID:${item.id}
DTSTART${item.allDayEvent ? ';VALUE=DATE' : ''}:${getEventIcsFormatDate(
        item,
        getEventStartDate(item)
    )}
DTEND${item.allDayEvent ? ';VALUE=DATE' : ''}:${getEventIcsFormatDate(item, getEventEndDate(item))}
CATEGORIES:${getIcsEventCategoryName(item.category)}
LOCATION:${getEventLocation(item)}
X-ALT-DESC;FMTTYPE=text/html:${getIcsCustomDescription(item, false, false)
        ?.replace(/\n/g, '\\n')
        ?.replace(/"/g, '\\"')}
DESCRIPTION:${getIcsCustomDescription(item, true, true)}`;
    if (item.reminderInterval) {
        vEvent += `
BEGIN:VALARM
TRIGGER:-PT${item.reminderInterval}S
ACTION:DISPLAY
DESCRIPTION:${getEventLocaleValue(item, 'headline')}
END:VALARM`;
    }
    vEvent += `
END:VEVENT`;
    return vEvent;
};

export const eventToGoogleCalendarEvent = (event: Event) => {
    const companyName: string = event?.company?.name + ': ';
    const apiUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const url = new URL(apiUrl);

    // Create a formatted dates string for start and end times
    const dates = `${getEventIcsFormatDate(
        event,
        getEventStartDate(event)
    )}/${getEventIcsFormatDate(event, getEventEndDate(event))}`;

    // Set the query parameters for the Google Calendar link
    url.searchParams.set(
        'text',
        companyName + unescapeSummery(getEventLocaleValue(event, 'headline'))
    );
    url.searchParams.set('location', getEventLocation(event));
    url.searchParams.set('details', getIcsCustomDescription(event, false, false) || '');
    if (event.allDayEvent) {
        url.searchParams.set('sf', 'true');
    }
    url.searchParams.set('dates', dates);
    return url.toString(); // Return the full URL as a string
};

export const eventToYahooCalendarEvent = (event: Event) => {
    const companyName: string = event?.company?.name + ': ';
    const apiUrl = 'https://calendar.yahoo.com/?v=60&view=d&type=20';
    const url = new URL(apiUrl);

    // Set the query parameters for the Yahoo Calendar link
    url.searchParams.set('title', companyName + unescapeSummery(getEventTitle(event)));
    url.searchParams.set('in_loc', getEventLocation(event));
    url.searchParams.set('desc', getIcsCustomDescription(event, false, false) || '');
    url.searchParams.set('st', getEventIcsFormatDate(event, getEventStartDate(event)));
    if (event?.end) {
        url.searchParams.set('et', getEventIcsFormatDate(event, getEventEndDate(event)));
    } else {
        url.searchParams.set('dur', 'allday');
    }
    if (event.reminderInterval) {
        const reminderIntervalInHour = event.reminderInterval / 3600;
        url.searchParams.set('rem1', reminderIntervalInHour + 'H');
    }

    return url.toString(); // Return the full URL as a string
};

const unescapeSummery = (text: string) => {
    text = text.replace(/&amp;/g, '&');
    // Remove HTML tags
    text = text.replace(/<\/?[^>]+(>|$)/g, '');
    return decodeURIComponent(text);
};

const getEventStartDate = (event: Event) => {
    return event.allDayEvent ? event.timezoneStart.toString().slice(0, 10) : event.start;
};

const getEventEndDate = (event: Event) => {
    if (event.end) {
        if (event.allDayEvent) {
            const endDate = event.timezoneEnd.toString().slice(0, 10);
            const newDate = addDays(new Date(endDate), 1);
            return format(newDate, 'yyyy-MM-dd').toString();
        }
        return event.end;
    } else if (!event.end && event.allDayEvent) {
        const endDate = event.timezoneStart.toString().slice(0, 10);
        const newDate = addDays(new Date(endDate), 1);
        return format(newDate, 'yyyy-MM-dd').toString();
    } else {
        return new Date(event.start).setHours(new Date(event.start).getHours() + 1);
    }
};

const getEventIcsFormatDate = (event: Event, eventDate: any) => {
    const isAllDay = event?.allDayEvent;
    return formatEventCalendarDate(eventDate, isAllDay);
};

const formatEventCalendarDate = (date: any, isAllDay: boolean) => {
    if (isAllDay) {
        const [year, month, day] = date.split('-');
        return `${year}${month}${day}`;
    }
    date = new Date(date);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}00Z`;
};

const getIcsEventCategoryName = (category: EventCategory[]) => {
    if (category.length === 0) {
        return;
    }
    return category
        .map((c) => {
            return (
                c.localId?.filter((l) => l.languageCode === locale.get()).pop()?.categoryName ||
                c.name
            );
        })
        .join(',');
};

const getIcsCustomDescription = (event: Event, removeTags = false, lineBreak: boolean) => {
    const mlDesc = [];

    let description = getEventLocaleValue(event, 'description');
    if (description !== '') {
        if (removeTags) {
            description = description.replace(/<[^>]+>/g, '');
        }
        mlDesc.push(description);
    }

    if (event.titleUrl !== '') {
        mlDesc.push(`<a href="${event.titleUrl}">${event.titleUrl}</a>`);
    }
    if (event.subheadline !== '') {
        mlDesc.push(event.subheadline);
    }

    if (event.note !== '') {
        mlDesc.push(event.note);
    }

    if (event.irManagerEmail !== '') {
        mlDesc.push(`<a href="mailto:${event.irManagerEmail}">${event.irManagerEmail}</a>`);
    }
    /*const location = getEventLocaleValue(event, 'location');
    if (location !== '') {
        mlDesc.push(location);
    }*/

    const metaData = getEventLocaleValue(event, 'metaData');
    if (!Array.isArray(metaData)) {
        return;
    }
    metaData.forEach((item: MetaData) => {
        mlDesc.push(`<a href="${item.linkUrl}">${item.linkTitle}</a>`);
    });
    let mlDescription;
    if (lineBreak) {
        mlDescription = mlDesc.join('\n');
        if (lineBreak) {
            mlDescription = mlDescription.replace(/\n/g, '\\n');
        }
    } else {
        mlDescription = mlDesc.join('<br />');
    }
    return mlDescription;
};

export const getEventBoxLinkData = (boxItem: any, boxCategory: BoxCategories) => {
    const docType = boxItem?.documentType?.toLowerCase();

    const getMatchingLink = (type: string) =>
        boxItem.link?.find(
            (link: typeof boxItem.link) =>
                link.urlType.toLowerCase() === type && link.languageCode === locale.get()
        );

    const getWebcastUrl = () => {
        if (docType === 'link' || docType === 'webcast') {
            const matchingLink = getMatchingLink('link');
            if (matchingLink) return { title: matchingLink.title, url: matchingLink.url };
        } else if (docType === 'mp3') {
            return { title: boxItem.title, url: boxItem?.filePath };
        }
        return { title: boxItem.title, url: getDocumentUrl(boxItem) ?? '' };
    };

    if (boxCategory.includes('webcast')) {
        return getWebcastUrl();
    }

    if (boxCategory.includes('presentations')) {
        if (docType === 'video') {
            const matchingLink = getMatchingLink('video');
            if (matchingLink) return { title: matchingLink.title, url: matchingLink.url };
        }
        return { title: boxItem.title, url: getDocumentUrl(boxItem) ?? '' };
    }

    // Default case
    return { title: boxItem.title, url: getDocumentUrl(boxItem) ?? '' };
};
