import { getLangSlug, prependBasePath } from '$utils/ops';
export interface MenuItem {
    title: string;
    link: string;
    isCorporate?: string;
    phase: string;
    submenu?: MenuItem[];
    hideOnLang?: string[];
}
export const getMenuItemsFooter = (locale: string): MenuItem[] => {
    const basePath = prependBasePath(`${getLangSlug(locale)}`);
    return [
        {
            title: `Test footer menu`,
            link: `${basePath}/ipo`,
            phase: `itf`,
            hideOnLang: ['de'] // Hide this page for DE
        },
        {
            title: `menu.documents`,
            link: `${basePath}/documents`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.agm`,
                    link: `${basePath}/documents/agm`,
                    phase: `website`
                },
                {
                    title: `menu.fdl`,
                    link: `${basePath}/documents/fdl`,
                    phase: `website`
                }
            ]
        },
        {
            title: `menu.events`,
            link: `${basePath}/events`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.event_filter`,
                    link: `${basePath}/events/filter`,
                    phase: `website`
                },
                {
                    title: `menu.event_box`,
                    link: `${basePath}/events/box`,
                    phase: `website`
                },
                {
                    title: `menu.event_home_teaser`,
                    link: `${basePath}/events/home-teaser`,
                    phase: `website`
                },
                {
                    title: `menu.event_tags_tabs`,
                    link: `${basePath}/events/tags-as-tabs`,
                    phase: `website`
                }
            ]
        },
        {
            title: `menu.share`,
            link: `${basePath}/share`,
            phase: `website`
        },
        {
            title: `menu.news`,
            link: `${basePath}/news`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.sec_filing`,
                    link: `${basePath}/news/sec-filing`,
                    phase: `website`
                }
            ]
        },
        {
            title: `menu.people_profile`,
            link: `${basePath}/people-profile`,
            phase: `website`
        },
        {
            title: `menu.fact_figures`,
            link: `${basePath}/facts-and-figures`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.financial_glossary`,
                    link: `${basePath}/examples/financial-glossary`,
                    phase: `website`
                }
            ]
        },
        {
            title: `menu.contact_form`,
            link: `${basePath}/contact`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.send_mail`,
                    link: `${basePath}/contact/email`,
                    phase: `website`
                },
                {
                    title: `menu.event_reminder`,
                    link: `${basePath}/contact/event_reminder`,
                    phase: `website`
                },
                {
                    title: `menu.email_alert`,
                    link: `${basePath}/contact/alert`,
                    phase: `website`
                }
            ]
        },
        {
            title: `menu.examples`,
            link: `${basePath}/examples/one`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.example_banner`,
                    link: `${basePath}/examples/banner`,
                    phase: `website`
                },
                {
                    title: `menu.example_documents`,
                    link: `${basePath}/examples/documents`,
                    phase: `website`
                },
                {
                    title: `menu.chart3`,
                    link: `${basePath}/examples/Charts3`,
                    phase: `website`
                },
                {
                    title: `menu.chart4`,
                    link: `${basePath}/examples/Charts4`,
                    phase: `website`
                },
                {
                    title: `menu.example_icons`,
                    link: `${basePath}/examples/icons`,
                    phase: `website`
                },
                {
                    title: `menu.company_contact`,
                    link: `${basePath}/examples/company-contact`,
                    phase: `website`
                },
                {
                    title: `menu.flip_book`,
                    link: `${basePath}/examples/flipbook`,
                    phase: `website`
                },
                {
                    title: `menu.flip_book_static`,
                    link: `${basePath}/examples/flipbook-static`,
                    phase: `website`
                },
                {
                    title: `menu.external_content`,
                    link: `${basePath}/examples/external-content`,
                    phase: `website`
                },
                {
                    title: `menu.content_page`,
                    link: `${basePath}/examples/content-page`,
                    phase: `website`
                },
                {
                    title: `menu.cstest`,
                    link: `${basePath}/examples/cstest`,
                    phase: `website`
                }
            ]
        },
        {
            title: `menu.reports`,
            link: `${basePath}/reports`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.e_paper`,
                    link: `${basePath}/reports/e-paper`,
                    phase: `website`
                }
            ]
        }
    ];
};

export const getMenuItems = (locale: string): MenuItem[] => {
    const basePath = prependBasePath(`${getLangSlug(locale)}`);
    return [
        {
            title: `menu.ipo`,
            link: `${basePath}/ipo`,
            phase: `itf`,
            hideOnLang: ['de'] // Hide this page for DE
        },
        {
            title: `menu.documents`,
            link: `${basePath}/documents`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.agm`,
                    link: `${basePath}/documents/agm`,
                    phase: `website`
                },
                {
                    title: `menu.fdl`,
                    link: `${basePath}/documents/fdl`,
                    phase: `website`
                }
            ]
        },
        {
            title: `menu.events`,
            link: `${basePath}/events`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.event_filter`,
                    link: `${basePath}/events/filter`,
                    phase: `website`
                },
                {
                    title: `menu.event_box`,
                    link: `${basePath}/events/box`,
                    phase: `website`
                },
                {
                    title: `menu.event_home_teaser`,
                    link: `${basePath}/events/home-teaser`,
                    phase: `website`
                },
                {
                    title: `menu.event_tags_tabs`,
                    link: `${basePath}/events/tags-as-tabs`,
                    phase: `website`
                }
            ]
        },
        {
            title: `menu.share`,
            link: `${basePath}/share`,
            phase: `website`
        },
        {
            title: `menu.news`,
            link: `${basePath}/news`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.sec_filing`,
                    link: `${basePath}/news/sec-filing`,
                    phase: `website`
                }
            ]
        },
        {
            title: `menu.people_profile`,
            link: `${basePath}/people-profile`,
            phase: `website`
        },
        {
            title: `menu.fact_figures`,
            link: `${basePath}/facts-and-figures`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.financial_glossary`,
                    link: `${basePath}/examples/financial-glossary`,
                    phase: `website`
                }
            ]
        },
        {
            title: `menu.contact_form`,
            link: `${basePath}/contact`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.send_mail`,
                    link: `${basePath}/contact/email`,
                    phase: `website`
                },
                {
                    title: `menu.event_reminder`,
                    link: `${basePath}/contact/event_reminder`,
                    phase: `website`
                },
                {
                    title: `menu.email_alert`,
                    link: `${basePath}/contact/alert`,
                    phase: `website`
                }
            ]
        },
        {
            title: `menu.examples`,
            link: `${basePath}/examples/one`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.example_banner`,
                    link: `${basePath}/examples/banner`,
                    phase: `website`
                },
                {
                    title: `menu.example_documents`,
                    link: `${basePath}/examples/documents`,
                    phase: `website`
                },
                {
                    title: `menu.chart3`,
                    link: `${basePath}/examples/Charts3`,
                    phase: `website`
                },
                {
                    title: `menu.chart4`,
                    link: `${basePath}/examples/Charts4`,
                    phase: `website`
                },
                {
                    title: `menu.example_icons`,
                    link: `${basePath}/examples/icons`,
                    phase: `website`
                },
                {
                    title: `menu.company_contact`,
                    link: `${basePath}/examples/company-contact`,
                    phase: `website`
                },
                {
                    title: `menu.flip_book`,
                    link: `${basePath}/examples/flipbook`,
                    phase: `website`
                },
                {
                    title: `menu.flip_book_static`,
                    link: `${basePath}/examples/flipbook-static`,
                    phase: `website`
                },
                {
                    title: `menu.external_content`,
                    link: `${basePath}/examples/external-content`,
                    phase: `website`
                },
                {
                    title: `menu.content_page`,
                    link: `${basePath}/examples/content-page`,
                    phase: `website`
                },
                {
                    title: `menu.cstest`,
                    link: `${basePath}/examples/cstest`,
                    phase: `website`
                }
            ]
        },
        {
            title: `menu.reports`,
            link: `${basePath}/reports`,
            phase: `website`,
            submenu: [
                {
                    title: `menu.e_paper`,
                    link: `${basePath}/reports/e-paper`,
                    phase: `website`
                }
            ]
        }
    ];
};
export const customMenu = (locale: string): MenuItem[] => {
    const basePath = prependBasePath(`${getLangSlug(locale)}`);
    return [
        {
            title: `custom-menu.company_data`,
            link: `${basePath}/custom-company-data`,
            phase: `website`,
            isCorporate : `true`
        },
        { 
            title: `custom-menu.company-profile`,
            link: `${basePath}/custom-company-contact`,
            phase: `website`
        },
    ];
};