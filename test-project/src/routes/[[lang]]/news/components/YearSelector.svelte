<script lang="ts">
    import { tick } from 'svelte';
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import { t, locale } from '$lib/translations';
    import Tabs from '$components/Tabs.svelte';
    import DropDown from '$components/DropDown.svelte';
    import JquerySelectric from '$components/JquerySelectric.svelte';
    import { fetchYears } from '$utils/news/ops';
    import { debounce } from '$utils/ops';
    export let showAllYears: boolean = false;
    export let yearSelector: string | null = 'tabs';
    export let uniqueYearsData: OptionType[] = [];
    export let selectedYear: string = '';
    export let currentPage: number = 1;
    export let activeYear: string | null = null;
    export let fiscalYearBeginMD: string | null = null;
    export let fiscalYearEndMD: string | null = null;
    export let archive: boolean = false;
    export let noOfYears: number | null = null;
    export let categories: string[] = [];
    export let tags: string[] = [];
    export let newsTypes: string[] = [];
    export let archiveTill: string = '';
    if (archive) {
        noOfYears || (noOfYears = 1);
        //showAllYears = false;
    }
    const getYears = debounce(async () => {
        await tick();
        const params = new URLSearchParams();
        params.set('locale', $locale);
        categories.forEach((category) => {
            params.append('category_code[]', category);
        });
        tags.forEach((tag) => {
            params.append('tags_slug[]', tag);
        });
        newsTypes.forEach((type) => {
            params.append('typeKey[]', type);
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
    });

    $: if ($locale || categories) {
        getYears();
    }
    $: if (selectedYear) {
        currentPage = 1;
        if (selectedYear == 'common.all') {
            selectedYear = '';
        } else {
            if (uniqueYearsData.length > 0) {
                if (!uniqueYearsData.some((item) => item.value === selectedYear)) {
                    selectedYear = uniqueYearsData[0].value;
                }
            }
        }
    }
</script>

{#await uniqueYearsData}
    <p>Loading...</p>
{:then uniqueYearsData}
    {#if uniqueYearsData && uniqueYearsData.length > 0}
        <div class="mb-2{yearSelector === 'dropDown' ? ' d-inline-block' : ''}">
            {#if yearSelector === 'tabs'}
                <Tabs options={uniqueYearsData} bind:value={selectedYear} />
            {:else if yearSelector === 'selectric'}
                <JquerySelectric
                    id="country"
                    options={uniqueYearsData}
                    bind:value={selectedYear}
                    placeholder={$t('common.pleaseChoose')}
                />
            {:else}
                <DropDown options={uniqueYearsData} bind:value={selectedYear} />
            {/if}
        </div>
    {/if}
{/await}
