export type WebsiteContent = {
    id: string;
    name: string;
    slug: string;
    itemPublished: boolean;
    draftAhead: boolean;
    itemScheduled: boolean;
    isPublished: boolean;
    isScheduled: boolean;
    localId: Locale[];
};

export type Locale = {
    languageCode: string;
    content: string;
};
