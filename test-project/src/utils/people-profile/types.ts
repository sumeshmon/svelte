export type PeopleProfile = {
    id: string;
    companyId: string;
    name: string | null;
    title: string | null;
    email: string | null;
    phone: string | null;
    sortOrder: number;
    metaData: MetaData[];
    isPublished: boolean;
    isScheduled: boolean;
    publishedEntityId: string;
    localId: Locale[];
    category: Category[];
    profileCategories: ProfileCategories[];
    linkedCategories: Category[] | null;
    tags: Tags[];
    restrictions: Restrictions[];
    image: Image[];
    itemPublished: boolean;
    draftAhead: boolean;
    itemScheduled: boolean;
    link?: string | null;
    description?: string | null;
    imageUrl?: string | null;
};
export type Locale = {
    id: string;
    languageCode: string;
    name: string;
    title: string | null;
    description: string | null;
    link: string | null;
    metaData?: MetaData[];
};

export type MetaData = {
    name: string;
    value: string;
    key: string;
};

export type Category = {
    id: string;
    name: string;
    companyId: string;
    slug: string;
};

export type ProfileCategories = {
    id: string;
    profile: string | null;
    category: string;
};

export type Tags = {
    id: string;
    name: string;
    slug: string;
};

export type Restrictions = {
    id: string;
    restrictionKey: string;
    restrictionName: string;
};

export type Image = {
    '@id'?: string;
    id?: string;
    title: string;
    url?: string;
    fileName: string;
    filePath?: string;
    languageCode: string;
    fileType: string;
    imageKey?: string;
};
