<script lang="ts">
    import {
        getYearOptionsFromFigure,
        getFullYear,
        getSummaryYear
    } from '$utils/facts-figures/ops';
    import { t, locale } from '$lib/translations';
    import type { CellValue, TableData } from '$utils/facts-figures/types';
    import Table from '$components/Table.svelte';
    import Loader from '$components/Loader.svelte';
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import JquerySelectric from '$components/JquerySelectric.svelte';
    export let tableData: TableData;
    export let filterColumn: string = '';
    export let notFound: string = $t('facts.noFactsFigures');

    let indexOfFilterColumn: number;
    let uniqueYearMap: OptionType[] = [];
    let selectedYear: string = '';
    let loader = true;
    let headerRow: CellValue[];
    let aggregatedData: {
        [key: string]: CellValue[][];
    } = {};

    const getData = () => {
        loader = true;
        indexOfFilterColumn = tableData[0]?.findIndex((item) => item.value === filterColumn);
        uniqueYearMap = getYearOptionsFromFigure(tableData, indexOfFilterColumn);

        uniqueYearMap.unshift({
            name: $t('secFiling.please_choose'), //Translate
            value: ''
        });
        headerRow = tableData[0];
        //aggregate the data for faster loading
        tableData.forEach((tableDataItem) => {
            let summaryYear = getSummaryYear(tableDataItem[0]?.formattedValue);
            if (!summaryYear.length) {
                let currentYear = getFullYear(
                    tableDataItem[indexOfFilterColumn]?.formattedValue,
                    tableDataItem[indexOfFilterColumn]?.numberFormatCode
                );
                if (currentYear && typeof aggregatedData[currentYear] === 'undefined') {
                    aggregatedData[currentYear] = [];
                }
                if (currentYear) {
                    aggregatedData[currentYear].push(tableDataItem);
                }
            } else {
                if (typeof aggregatedData[summaryYear] === 'undefined') {
                    aggregatedData[summaryYear] = [];
                }
                aggregatedData[summaryYear].push(tableDataItem);
            }
        });
        loader = false;
    };

    $: if ($locale) {
        getData();
    }
</script>

<Loader animation={true} {loader}>
    {#if tableData && tableData.length > 0}
        <div class="">
            <JquerySelectric options={uniqueYearMap} bind:value={selectedYear} />
        </div>

        <section class="tab dividend-tab__wrap">
            <div id="tab__container_16963" class="tab__container">
                <div class="tab__content">
                    <div
                        class="dividend-tab__content--item tab__content--item tab--active"
                        id="tab-2019_27067"
                    >
                        <Table className="facts-table">
                            <tbody>
                                {#each uniqueYearMap as years}
                                    {#if years['value'].length && (!selectedYear.length || selectedYear === years['value'])}
                                        {#if typeof aggregatedData[years['value']] !== 'undefined'}
                                            <tr class="facts-row facts-cell facts-table__row-head">
                                                {#each headerRow as headerRowItem}
                                                    <td
                                                        class="facts-cell"
                                                        colspan={headerRowItem.attribute.colspan}
                                                        >{@html headerRowItem.html}</td
                                                    >
                                                {/each}
                                            </tr>
                                            {#each aggregatedData[years['value']] as aggregatedDataItems}
                                                <tr class="facts-row facts-cell">
                                                    {#each aggregatedDataItems as item}
                                                        {#if item.formattedValue !== ''}
                                                            <td class="facts-cell"
                                                                >{@html item.html}</td
                                                            >
                                                        {:else}
                                                            <td />
                                                        {/if}
                                                    {/each}
                                                    {#if aggregatedDataItems.length < headerRow.length}
                                                        <td
                                                            colspan={headerRow.length -
                                                                aggregatedDataItems.length}
                                                        />
                                                    {/if}
                                                </tr>
                                            {/each}
                                        {/if}
                                    {/if}
                                {/each}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </section>
    {:else}
        <p>{notFound}</p>
    {/if}
</Loader>
