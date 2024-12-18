<script lang="ts">
    import { PUBLIC_PAGE_LIMIT, PUBLIC_PAGINATION_LINK_LIMIT } from '$env/static/public';
    import { t } from '$lib/translations';
    import { DateSortOrderType, PaginatorType } from '$utils/constants';
    import type { SecFiling, SecFilingsCategory } from '$utils/sec-filing/types';
    import Loader from '$components/Loader.svelte';
    import { getSecFilingList } from '$utils/sec-filing/helper';
    import {
        fetchSecFilingUniqueYears,
        fetchSecFilingCategories,
        getSecFilingsDownloadItemData
    } from '$utils/sec-filing/api';
    import { debounce, formatDate } from '$utils/ops.js';
    import DynamicPaginator from '$components/DynamicPaginator.svelte';
    import { onMount } from 'svelte';
    import {
        secFilingCategory,
        secFilingYears,
        secFilingSearchKeyword
    } from '$utils/sec-filing/filterState';
    import { DOWNLOAD_FORMAT_ICON } from '$utils/sec-filing/constants';
    // import SelectInput from '$components/form/components/SelectInput.svelte';
    import { TextInputSvelte, type OptionType } from '@eqs/cms-svelte-irtools';
    import JquerySelectric from '$components/JquerySelectric.svelte';

    export let itemsPerPage: string = PUBLIC_PAGE_LIMIT;
    export let notFound: string | null = null;
    export let tickers: string | null = null;
    export let sortOrder: string = DateSortOrderType.DESC;
    /**
     * Number of visible pages in the pagination
     * recommended to use an odd number as value for numberOfPaginationLinks
     */
    export let numberOfPaginationLinks: string = PUBLIC_PAGINATION_LINK_LIMIT;

    /**
     * Define the type of paginatorType: "pagination", "loadMore"
     */
    export let paginatorType: string = 'pagination';
    export let currentPage: number = 1;

    let filings: SecFiling[] = [];
    let secFilingList: SecFiling[] = [];
    let totalItems: number = 0;
    let uniqueYearMap: OptionType[] = [];
    let categoriesMap: OptionType[] | null = [];
    let uniqueYears: { [key: string]: string }[] | null = null;
    let categoriesData: SecFilingsCategory[] | null = null;
    let loader: boolean = true;
    let uniqueYearLoader: boolean = true;
    let categoryLoader: boolean = true;
    let debounceDelay = 500;

    const getData = debounce(async () => {
        loader = true;
        try {
            const response = await getSecFilingList({
                itemsPerPage: itemsPerPage,
                years: $secFilingYears.toString(),
                categories: $secFilingCategory.toString(),
                tickers: tickers,
                page: currentPage,
                search: $secFilingSearchKeyword,
                order: {
                    fieldName: 'receivedDate',
                    direction: sortOrder
                }
            });

            filings = response?.filingsList;

            totalItems = response.totalItems;
            if (paginatorType == PaginatorType.LoadMore && currentPage != 1) {
                secFilingList = [
                    ...secFilingList,
                    ...filings.filter(
                        (doc) => !secFilingList.some((existingDoc) => existingDoc.id === doc.id)
                    )
                ];
            } else {
                secFilingList = filings;
            }
        } catch (error) {
            console.error('Error fetching Documents:', error);
        } finally {
            loader = false;
        }
    });

    const fetchYears = debounce(async () => {
        uniqueYearLoader = true;
        try {
            const response = await fetchSecFilingUniqueYears();
            uniqueYears = response['hydra:member'];
            uniqueYearMap = uniqueYears.map((item) => {
                return {
                    name: item.year,
                    value: item.year
                };
            });
        } catch (error) {
            console.error('Error fetching sec filing years:', error);
        } finally {
            uniqueYearLoader = false;
        }
    });

    const getFileType = (filePath: string): string => {
        return filePath?.split('.').pop() || '';
    };

    const fetchCategories = debounce(async () => {
        categoryLoader = true;
        try {
            const response = await fetchSecFilingCategories();
            categoriesData = response['hydra:member'];
            categoriesMap = categoriesData.map((item) => {
                return {
                    name: item.categoryName,
                    value: item.id
                };
            });
        } catch (error) {
            console.error('Error fetching sec filing categories:', error);
        } finally {
            categoryLoader = false;
        }
    });

    const downloadSecFilingsFormat = async (
        event: Event,
        id: string,
        shortDesc: string,
        format: string,
        fileType: string
    ) => {
        const secFilingsParams = {
            event,
            id,
            shortDesc,
            format,
            fileType
        };
        const anchor =
            (event.currentTarget as HTMLAnchorElement) || (event.target as HTMLAnchorElement);
        if (anchor.getAttribute('href') == '#') {
            event.preventDefault();

            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

            try {
                const response = await getSecFilingsDownloadItemData(secFilingsParams);
                if (response.status === 200) {
                    const blob = await response.blob();
                    const blobUrl = window.URL.createObjectURL(blob);

                    if (blobUrl) {
                        anchor.href = blobUrl;
                        const isTargetBlankFileTypes = fileType === 'html' || fileType === 'pdf';

                        if (isTargetBlankFileTypes && !isIOS) {
                            anchor.target = '_blank';
                        } else {
                            anchor.download =
                                fileType === 'xbrl-viewer'
                                    ? 'xbrl-viewer.html'
                                    : secFilingsParams.shortDesc + '.' + fileType;
                            anchor.target = '_self';
                        }
                        anchor.click();
                    }
                }
            } catch (error) {
                console.error('Error fetching sec filing downloads:', error);
            }
        }

        return false;
    };

    const applySearch = debounce(getData, debounceDelay);

    onMount(async () => {
        await fetchYears();
        await fetchCategories();
    });

    $: if (
        $secFilingYears ||
        $secFilingCategory ||
        $secFilingCategory == '' ||
        $secFilingYears == ''
    ) {
        currentPage = 1;
        getData();
    }

    $: if (currentPage) {
        getData();
    }

    $: if (
        ($secFilingSearchKeyword && $secFilingSearchKeyword.length > 3) ||
        !$secFilingSearchKeyword
    ) {
        applySearch();
    }
</script>

<div class="sec-filing-filters">
    {#if uniqueYearMap.length > 0 && categoriesMap}
        <div class="row">
            <div class="col-md-4">
                <!-- <SelectInput
                bind:value={$secFilingYears}
                placeholder={$t('secFiling.please_choose')}
                label=""
                options={uniqueYearMap}
                id="years"
                cssClass="form-control"
            /> -->

                <JquerySelectric
                    id="country"
                    options={uniqueYearMap}
                    bind:value={$secFilingYears}
                    placeholder={$t('secFiling.please_choose')}
                />
            </div>
            <div class="col-md-4">
                <!-- <SelectInput
                bind:value={$secFilingCategory}
                placeholder={$t('secFiling.please_choose_category')}
                label=""
                options={categoriesMap}
                id="years"
                cssClass="form-control"
            /> -->

                <JquerySelectric
                    id="country"
                    options={categoriesMap || []}
                    bind:value={$secFilingCategory}
                    placeholder={$t('secFiling.please_choose_category')}
                />
            </div>
            <div class="col-md-4">
                <TextInputSvelte
                    cssClass="form-control search-input"
                    bind:value={$secFilingSearchKeyword}
                    placeholder={$t('secFiling.search_keyword')}
                />
            </div>
        </div>
    {/if}
</div>
<Loader align="center" animation={true} {loader}>
    {#if totalItems > 0}
        <div class="sec-filing-outer-wrapper">
            <table class="sec-filing-wrapper table table-hover">
                <thead>
                    <tr>
                        <th class="documents__head">{$t('secFiling.form')}</th>
                        <th class="documents__head">{$t('secFiling.description')}</th>
                        <th class="documents__head">{$t('secFiling.filed_date')}</th>
                        <th class="documents__head">{$t('secFiling.download')}</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {#each secFilingList as item}
                        <tr>
                            <td>
                                {item.formType.mnemonic}
                            </td>
                            <td>
                                {item.formType.shortDesc}
                            </td>
                            <td>
                                {formatDate(
                                    new Date(item.filedDate.split('T')[0].concat(' 00:00:00'))
                                )}
                            </td>
                            <td>
                                <div class="sec-filing-downloads">
                                    {#if Array.isArray(item.avaialbeFormats)}
                                        {#each item.avaialbeFormats as format}
                                            <a
                                                class="sec-filing-downloads__item sec-filing-downloads__item--button"
                                                href={'#'}
                                                data-file-type={getFileType(item.resources[format])}
                                                data-file-format={format}
                                                on:click={(event) =>
                                                    downloadSecFilingsFormat(
                                                        event,
                                                        item.id,
                                                        item.formType.shortDesc,
                                                        format,
                                                        getFileType(item.resources[format])
                                                    )}
                                            >
                                                {DOWNLOAD_FORMAT_ICON[format]}</a
                                            >
                                        {/each}
                                    {:else}
                                        <span>No documents available.</span>
                                    {/if}
                                </div>
                            </td>
                            {#if item?.xbrlInfo}
                                {#if item?.xbrlInfo?.viewer}
                                    <td>
                                        <ul>
                                            {#if item?.xbrlInfo?.viewer}
                                                <li>
                                                    <a
                                                        class="sec-filing-downloads__item"
                                                        href={'#'}
                                                        data-file-type="html"
                                                        data-file-format="html"
                                                        on:click={(event) =>
                                                            downloadSecFilingsFormat(
                                                                event,
                                                                item.id,
                                                                item.id + '-xbrl-viewer',
                                                                'xbrl-viewer',
                                                                'xbrl-viewer'
                                                            )}
                                                    >
                                                        XBRL Viewer
                                                    </a>
                                                </li>
                                            {/if}
                                            {#if item?.xbrlInfo?.sequence}
                                                {#each item?.xbrlInfo?.sequence as sequence}
                                                    <li>
                                                        <a
                                                            class="sec-filing-downloads__item"
                                                            href={'#'}
                                                            data-file-type={getFileType(
                                                                sequence.file
                                                            )}
                                                            data-file-format={sequence.type}
                                                            on:click={(event) =>
                                                                downloadSecFilingsFormat(
                                                                    event,
                                                                    item.id,
                                                                    item.id +
                                                                        '-' +
                                                                        (sequence.name.split(
                                                                            '.'
                                                                        )[0] || sequence.name),
                                                                    sequence.type,
                                                                    getFileType(sequence.name)
                                                                )}
                                                        >
                                                            {sequence.description}
                                                        </a>
                                                        <br />
                                                    </li>
                                                {/each}
                                            {/if}
                                        </ul>
                                    </td>
                                {/if}
                            {:else}
                                <td />
                            {/if}
                        </tr>
                    {/each}
                </tbody>
            </table>
            <DynamicPaginator
                {numberOfPaginationLinks}
                {paginatorType}
                {totalItems}
                {itemsPerPage}
                bind:currentPage
            />
        </div>
    {:else}
        {notFound}
    {/if}
</Loader>
