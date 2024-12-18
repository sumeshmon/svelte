<script lang="ts">
    import AgmListDefault from './templates/AgmListDefault.svelte';
    export let template: typeof AgmListDefault = AgmListDefault;
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import { t, locale } from '$lib/translations';
    import {
        fetchYears,
        getDocumentList,
        prepareAgmData,
        generateAgmListContent
    } from '$utils/documents/helper';
    import type { Document, Agm } from '$utils/documents/types';
    import Loader from '$components/Loader.svelte';
    import Accordion, { createAccordionContext } from '$components/Accordion.svelte';
    import { debounce } from '$utils/ops';
    createAccordionContext();
    export let showAllYears: boolean = false;
    export let uniqueYearsData: OptionType[] = [];
    export let selectedYear: string = '';
    export let activeYear: string | null = null;
    export let fiscalYearBeginMD: string | null = null;
    export let fiscalYearEndMD: string | null = null;
    export let archive: boolean = false;
    export let noOfYears: number | null = null;
    export let categories: string[] = [];
    export let tags: string[] = [];
    export let archiveTill: string = '';
    export let itemsPerPage: string;
    export let featureDocument: string | null = null;
    export let notFound: string = $t('documents.no_item_found');
    export let sortOrder: string | null = null;
    export let dateOrder: string = 'DESC';
    export let timeOrder: string | null = null;
    let documents: Document[] = [];
    let loader = true;
    let agm: Agm[];
    let agmList: Agm[] = [];
    let agmListContent: { [year: string]: Agm[] } = {};
    if (archive) {
        noOfYears || (noOfYears = 1);
    }
    const getYears = debounce(async () => {
        const params = new URLSearchParams();
        params.set('locale', $locale);
        categories.forEach((category) => {
            params.append('category_slug[]', category);
        });
        tags.forEach((tag) => {
            params.append('tags_slug[]', tag);
        });
        uniqueYearsData = await fetchYears({
            params: params,
            showAllYears: showAllYears,
            archive: archive,
            noOfYears: noOfYears,
            archiveTill: archiveTill,
            fiscalYearBeginMD: fiscalYearBeginMD,
            fiscalYearEndMD: fiscalYearEndMD
        });
        if (uniqueYearsData.length > 0) {
            if (selectedYear == '') {
                if (activeYear) {
                    if (activeYear == 'currentYear') {
                        const currentYear: number = new Date().getFullYear();
                        // Check if the uniqueYearsData has value equal to currentYear
                        const hasCurrentYear = uniqueYearsData.some(
                            (item) => item.value === currentYear.toString()
                        );
                        if (hasCurrentYear) {
                            selectedYear = currentYear.toString();
                        } else {
                            // Find the closest available year that is less than the currentYear
                            const closestYear = uniqueYearsData
                                .filter((item) => parseInt(item.value) < currentYear)
                                .sort((a, b) => parseInt(b.value) - parseInt(a.value))[0];
                            closestYear && (selectedYear = closestYear.value);
                        }
                    } else {
                        selectedYear = activeYear;
                    }
                } else {
                    selectedYear = uniqueYearsData[0].value;
                }
            }
        }
        await generateAgmList();
    });
    const getData = async (years: string[]) => {
        try {
            loader = true;
            agm = [];
            const response = await getDocumentList({
                lang: $locale,
                itemsPerPage: itemsPerPage,
                years: years,
                featureDocument: featureDocument,
                categories: categories,
                tags: null,
                page: 1,
                sortOrder: sortOrder,
                dateOrder: dateOrder,
                timeOrder: timeOrder
            });

            documents = response.documents;

            agm = prepareAgmData(documents);
            return agm;
        } catch (error) {
            console.error('Error fetching Documents:', error);
            return [];
        } finally {
            loader = false;
        }
    };

    $: if ($locale || categories) {
        getYears();
    }

    const generateAgmList = debounce(async () => {
        agmList = [];
        try {
            const values = uniqueYearsData.map((item) => item.value);
            const years = values.filter((item) => item.match(/^\d{4}$/));
            agmList = await getData(years);
            agmListContent = generateAgmListContent(agmListContent, agmList);

            // Fetch data for archive range if exists
            const archiveRange = values.find((item) => !item.match(/^\d{4}$/));
            if (archiveRange) {
                const agmArchiveData = await getData([archiveRange]);
                agmListContent = generateAgmListContent(
                    agmListContent,
                    agmArchiveData,
                    archiveRange
                );
            }
        } catch (error) {
            console.error('Error generating AGM list:', error);
        }
    });
</script>

<Loader {loader}>
    {#if uniqueYearsData && uniqueYearsData.length > 0}
        {#each uniqueYearsData as year}
            <Accordion>
                <span slot="title">{$t(year.name) || year.name}</span>
                <div slot="content">
                    <div class="agm">
                        {#if template}
                            <svelte:component this={template} agm={agmListContent[year.value]} />
                        {/if}
                    </div>
                </div>
            </Accordion>
        {/each}
    {:else}
        {notFound}
    {/if}
</Loader>
