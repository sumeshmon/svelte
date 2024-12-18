import type { Locale, MetaData, PeopleProfile } from './types';
import { PUBLIC_FALLBACK_LOCALE } from '$env/static/public';
import { locale, t } from '$lib/translations';
import { fetchPeopleProfileList } from '$utils/people-profile/api';
import { generateMediaUrl, createURLFriendlySlug, getLangSlug } from '$utils/ops';
import { PaginatorType } from '$utils/constants';
import { base } from '$app/paths';

export const getPeopleProfileList = async (
    params = new URLSearchParams()
): Promise<{ profileList: PeopleProfile[]; totalItems: number }> => {
    const response = await fetchPeopleProfileList(params);
    const totalItems = response['hydra:totalItems'];
    const profileList = response['hydra:member'];
    const updatedProfileList = transformPeopleProfileList(profileList);
    return { profileList: updatedProfileList, totalItems: totalItems as number };
};

export const transformPeopleProfileList = (profileList: PeopleProfile[]): PeopleProfile[] => {
    profileList.forEach((profile) => {
        profile.link = getPeopleProfileWebsite(profile);
        profile.title = getPeopleProfileTitle(profile);
        profile.name = getPeopleProfileName(profile);
        profile.description = getPeopleProfileDescription(profile);
        profile.imageUrl = getPeopleProfileImageUrl(profile);
    });
    return profileList;
};

export const getPeopleProfileImageUrl = (item: PeopleProfile) => {
    const image = item?.image[0]?.filePath;
    return generateMediaUrl(image || '');
};

export const getPeopleProfileDescription = (item: PeopleProfile, fallback = true) => {
    return getPeopleProfileLocaleValue(item, 'description', fallback);
};

export const getPeopleProfileName = (item: PeopleProfile, fallback = true) => {
    return getPeopleProfileLocaleValue(item, 'name', fallback);
};

export const getPeopleProfileTitle = (item: PeopleProfile, fallback = true) => {
    return getPeopleProfileLocaleValue(item, 'title', fallback);
};

export const getPeopleProfileWebsite = (item: PeopleProfile, fallback = true) => {
    return getPeopleProfileLocaleValue(item, 'link', fallback);
};

export const getPeopleProfileMeta = (item: PeopleProfile, fallback = true) => {
    const metaData: string | MetaData[] = getPeopleProfileMetaLocaleValue(
        item,
        'metaData',
        fallback
    );
    if (metaData.length === 0) {
        return metaData;
    }
    return Object.values(metaData);
};

export const getPeopleProfileMetaLocaleValue = (
    profile: PeopleProfile,
    field: keyof Locale,
    fallback = true
) => {
    const value =
        profile.localId?.filter((l: Locale) => l.languageCode === locale.get()).pop()?.[field] ||
        [];
    if (!fallback) {
        return value;
    }
    const fallbackValue =
        profile.localId?.filter((l: Locale) => l.languageCode === PUBLIC_FALLBACK_LOCALE).pop()?.[
            field
        ] || [];
    return (value || fallbackValue) as string | MetaData[];
};

export const getPeopleProfileLocaleValue = (
    profile: PeopleProfile,
    field: keyof Locale,
    fallback = true
) => {
    const value = getPeopleProfileSpecificValue(profile, field, locale.get());
    if (!fallback) {
        return value;
    }
    const fallbackValue = getPeopleProfileSpecificValue(profile, field, PUBLIC_FALLBACK_LOCALE);
    const notEmptyValue = profile.localId?.filter((l) => l[field]).pop()?.[field];
    return (value || fallbackValue || notEmptyValue || '') as string;
};

export const getPeopleProfileSpecificValue = (
    profile: PeopleProfile,
    field: keyof Locale,
    locale: string
) => {
    return (profile.localId?.filter((l: Locale) => l.languageCode === locale).pop()?.[field] ||
        '') as string;
};

export const profileMapList = (
    items: PeopleProfile[],
    currentLocale: string,
    localeKey: string,
    localeCodeKey: string,
    fields: string[]
) => {
    if (items.length === 0) {
        return [];
    }
    return items.map((item: PeopleProfile) => {
        return map(item, currentLocale, localeKey, localeCodeKey, fields);
    });
};

const map = (
    item: any,
    currentLocale: string,
    localeKey: string,
    localeCodeKey: string,
    fields: string[]
) => {
    if (!Array.isArray(item[localeKey])) {
        return item;
    }
    const current = item[localeKey].filter((locale: { [x: string]: string }) => {
        return locale[localeCodeKey] === currentLocale;
    });

    if (!current.length) {
        return item;
    }

    fields.forEach((field) => {
        item[field] = current[0][field] || null;
    });

    return item;
};

/**
 * Prepare paginator based data
 * @param peopleProfiles
 * @param peopleProfileList
 * @param paginatorType
 */
export const prepareProfileList = (
    peopleProfiles: PeopleProfile[],
    peopleProfileList: PeopleProfile[],
    paginatorType: string | boolean
) => {
    if (paginatorType == PaginatorType.LoadMore) {
        peopleProfileList = [
            ...peopleProfileList,
            ...peopleProfiles.filter(
                (peopleItem) =>
                    !peopleProfileList.some(
                        (existingProfile) => existingProfile.id === peopleItem.id
                    )
            )
        ];
    } else {
        peopleProfileList = peopleProfiles;
    }

    return peopleProfileList as PeopleProfile[];
};

/**
 * Create PeopleProfile detail page link
 * @param peopleProfile
 * @param lang
 */
export const getPeopleProfileDetailPageLink = (peopleProfile: PeopleProfile, lang: string) => {
    const peopleProfileName = getPeopleProfileName(peopleProfile) ?? '';
    const urlSlug = createURLFriendlySlug(peopleProfileName as string, lang);
    return t.get('profile.detailLink', {
        base,
        lang: getLangSlug(lang),
        slug: urlSlug,
        id: peopleProfile.id
    } as any);
};
