<script lang="ts">
    import type { Document } from '$utils/documents/types';
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import { fetchYears, getFDList, getDocumentUrl } from '$utils/documents/helper';
    import { locale, t } from '$lib/translations';
    import { handleClick } from '$components/disclaimer/handleClick';
    import Slider from '$components/Header/Slider.svelte';
    import Slide from '$components/Header/Slide.svelte';
    import Loader from '$components/Loader.svelte';
    import { debounce } from '$utils/ops';
    export let itemsPerYear: string = '100';
    export let categories: Array<string> | null = null;
    export let tags: Array<string> | null = null;
    export let featureDocument: string | null = null;
    export let notFound: string = $t('documents.no_item_found');
    export let currentPage: number = 1;
    export let noOfYears: number | null = null;
    export let archive: boolean = false;
    export let sortOrder: string | null = null;
    export let dateOrder: string = 'DESC';
    export let yearOrder: string = 'DESC';
    export let timeOrder: string | null = null;
    export let fiscalYearBeginMD: string | null = null;
    export let fiscalYearEndMD: string | null = null;
    const documentListByYear: { [year: string]: Document[] } = {};
    let items: { [category: string]: { [year: string]: Document[] } } = {};
    let quarterTags: Array<string> = ['q1', 'q2', 'q3', 'q4'];
    let displayYears: Array<string> = [];
    let loader: boolean = true;
    let uniqueYears: OptionType[] = [];
    let slideClass: string = '';
    let swiperOptions = {
        slidesPerView: 1,
        loop: false,
        breakpoints: {
            640: {
                slidesPerView: 1
            },
            768: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 3
            }
        }
    };

    const params = new URLSearchParams();
    featureDocument && params.append('isFeatureDocument', featureDocument);
    categories && categories.forEach((category) => params.append('category.slug[]', category));
    tags && tags.forEach((tag) => params.append('tags.slug[]', tag));
    sortOrder && params.append('sortOrder', sortOrder);
    timeOrder && params.append('timeOrder', timeOrder);
    dateOrder && params.append('dateOrder', dateOrder);

    const setItems = (years: OptionType[], docListByYear: { [key: string]: Document[] }) => {
        displayYears = [];
        items = {};
        for (const year of years) {
            let displayYear = year.value;
            if (displayYear.includes('_')) {
                displayYear = (parseInt(displayYear) - 1).toString();
            }
            displayYears.push(displayYear);
            for (const document of docListByYear[year.value]) {
                if (categories) {
                    for (const category of categories) {
                        items[category] = items[category] ?? {};
                        items[category][displayYear] = items[category][displayYear] ?? [];
                        if (document?.category?.find((cat) => cat.slug === category)) {
                            items[category][displayYear].push(document);
                        }
                    }
                }
            }
        }

        if (yearOrder === 'DESC') {
            displayYears.sort((a, b) => parseInt(b) - parseInt(a));
        } else {
            displayYears.sort((a, b) => parseInt(a) - parseInt(b));
        }
    };

    const getData = debounce(async () => {
        try {
            loader = true;
            uniqueYears = await fetchYears({
                params: params,
                noOfYears: noOfYears,
                archive: archive,
                fiscalYearBeginMD: fiscalYearBeginMD,
                fiscalYearEndMD: fiscalYearEndMD
            });

            await Promise.all(
                uniqueYears.map(async (year) => {
                    const response = await getFDList({
                        lang: $locale,
                        itemsPerPage: itemsPerYear,
                        years: year.value,
                        featureDocument,
                        categories,
                        tags,
                        page: currentPage,
                        sortOrder,
                        dateOrder,
                        timeOrder
                    });
                    documentListByYear[year.value] = response.documents;
                })
            );
        } catch (error) {
            console.error('Error fetching Documents:', error);
        } finally {
            setItems(uniqueYears, documentListByYear);
            loader = false;
            if (uniqueYears.length == 1) {
                slideClass = ' fdl-slide__full';
            } else if (uniqueYears.length == 2) {
                slideClass = ' fdl-slide__half';
            }
        }
    });

    $: if ($locale) getData();
</script>

<Loader align="center" animation={true} {loader}>
    {#if !Object.values(documentListByYear).every((arr) => arr.length === 0) && displayYears.length > 0}
        <div class="fdl">
            <div class="row g-0">
                <div class="col-3 col-sm-4">
                    <div class="fdl__category">
                        <strong class="fdl__category-heading">Category</strong>
                        {#if categories}
                            {#each categories as orderCategory}
                                {#if items[orderCategory]}
                                    <div class="fdl__category-item">
                                        {$t('documents.' + orderCategory)}
                                    </div>
                                {/if}
                            {/each}
                        {/if}
                    </div>
                </div>
                <div class="col-9 col-sm-8">
                    {#if categories}
                        <Slider options={swiperOptions} className="fdl-slider" pagination={false}>
                            {#each displayYears as year}
                                <Slide className={'fdl-slide' + slideClass}>
                                    <div class="fdl__year">
                                        <div class="fdl__year-heading">{year}</div>
                                        {#each categories as orderCategory}
                                            <div class="fdl__year-item">
                                                {#if items[orderCategory]}
                                                    {#if items[orderCategory][year]}
                                                        {#each items[orderCategory][year] as document}
                                                            {#if (orderCategory === 'annual_report' || orderCategory === 'proxy') && document.tags && document.tags.length > 0}
                                                                <a
                                                                    class="fdl__year-item-active"
                                                                    target="_blank"
                                                                    on:click={(event) =>
                                                                        handleClick(
                                                                            event,
                                                                            document
                                                                        )}
                                                                    data-disclaimer={document.disclaimer}
                                                                    data-uuid={document.id}
                                                                    href={getDocumentUrl(
                                                                        document,
                                                                        'disposition=inline'
                                                                    )}>{document.tags[0].name}</a
                                                                >
                                                            {/if}
                                                        {/each}
                                                    {:else}
                                                        <span class="fdl__year-item-empty" />
                                                    {/if}
                                                    {#if (orderCategory === 'annual_report' || orderCategory === 'proxy') && items[orderCategory][year] && items[orderCategory][year].length === 0}
                                                        <span class="fdl__year-item-inactive"
                                                            >{$t(
                                                                'documents.slug_' + orderCategory
                                                            )}</span
                                                        >
                                                    {/if}
                                                    {#if orderCategory !== 'annual_report' && orderCategory !== 'proxy'}
                                                        {#each quarterTags as quarter}
                                                            {#if items[orderCategory][year]}
                                                                {#if items[orderCategory][year].some((document) => document.tags && document.tags.length > 0 && document.tags[0].slug === quarter)}
                                                                    {#each items[orderCategory][year] as document}
                                                                        {#if document.tags && document.tags.length > 0 && document.tags[0].slug === quarter}
                                                                            <a
                                                                                class="fdl__year-item-active"
                                                                                target="_blank"
                                                                                on:click={(event) =>
                                                                                    handleClick(
                                                                                        event,
                                                                                        document
                                                                                    )}
                                                                                data-disclaimer={document.disclaimer}
                                                                                data-uuid={document.id}
                                                                                href={getDocumentUrl(
                                                                                    document,
                                                                                    'disposition=inline'
                                                                                )}
                                                                                >{document.tags[0]
                                                                                    .name}</a
                                                                            >
                                                                        {/if}
                                                                    {/each}
                                                                {:else}
                                                                    <span
                                                                        class="fdl__year-item-inactive"
                                                                        >{$t(
                                                                            'documents.' + quarter
                                                                        )}</span
                                                                    >
                                                                {/if}
                                                            {:else}
                                                                <span
                                                                    class="fdl__year-item-empty"
                                                                />
                                                            {/if}
                                                        {/each}
                                                    {/if}
                                                {/if}
                                            </div>
                                        {/each}
                                    </div>
                                </Slide>
                            {/each}
                        </Slider>
                    {/if}
                </div>
            </div>
        </div>
    {:else}
        <p>{notFound}</p>
    {/if}
</Loader>
