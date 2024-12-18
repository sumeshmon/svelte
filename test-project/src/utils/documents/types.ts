export type Document = {
    id: string;
    title: string;
    url: string;
    fileName: string;
    fileType: string;
    showInsteadOfDate: string;
    description: string;
    note: string;
    notifySubscriber: true;
    languageCode: string;
    companyId: string;
    date: string;
    timezone: string;
    metaData: [];
    sortOrder: 0;
    isPublished: true;
    isScheduled: true;
    isPublishing: true;
    category: DocumentCategory[];
    link: DocumentLinks[];
    featureImage: DocumentFeatureImage[];
    isFeatureDocument: true;
    tags: DocumentTags[];
    restrictions: DocumentRestrictions[];
    alertTemplate: string;
    fileSize: string;
    featureTitle: string;
    uploadedFileName: string;
    legacyId: 0;
    legacyParameters: string[] | null;
    publishedEntityId: string;
    documentType: string;
    disclaimer: string;
    thumbnails: DocumentThumbnails;
    previewLegacyId: 0;
    draftAhead: true;
    itemPublished: true;
    itemScheduled: true;
    filePath: string;
    actualDate: string;
    storageUrl: string;
    disclaimerToken?: string | null;
};

export type DocumentCategory = {
    id: string;
    companyId: string;
    name: string;
    slug: string;
    basicSet: boolean;
    localId?: DocumentCategoryLocale[];
};
export type DocumentCategoryLocale = {
    id: string;
    categoryName: string;
    languageCode: string;
};
export type DocumentTags = {
    id: string;
    companyId: string;
    name: string;
    slug: string;
};
export type DocumentLinks = {
    title: string;
    url: string;
    languageCode: string;
    urlType: string;
};
export type DocumentRestrictions = {
    id: string;
    restrictionKey: string;
    restrictionName: string;
};
export type DocumentFeatureImage = {
    languageCode: string;
    filePath: string;
    title: string;
    fileName: string;
    fileType: string;
    resolution: string;
};
export type DocumentThumbnails = {
    default: DocumentThumb;
    custom: DocumentThumb;
};

export type DocumentThumbnailsKeys = keyof DocumentThumbnails;

export type DocumentThumb = {
    key: string;
    url: string;
    type: string;
    width: number;
    height: number;
    thumbType: string;
    storageUrl: string;
    orientation: string;
};
export type DocumentUniqueYear = {
    year: string;
};

export type PopupItem = {
    item?: Document;
};

export type TitlePopup = {
    item?: Document;
    popup?: PopupItem[];
};

export type Agm = {
    item?: Document;
    popup?: PopupItem[];
    titlePopup?: TitlePopup[];
};
