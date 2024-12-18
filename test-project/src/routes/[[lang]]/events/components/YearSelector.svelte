<script lang="ts">
    import { tick } from 'svelte';
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import { locale, t } from '$lib/translations';
    import Tabs from '$components/Tabs.svelte';
    import DropDown from '$components/DropDown.svelte';
    import { fetchYears } from '$utils/events/ops';
    import { GroupByValues } from '$utils/constants';
    import { debounce } from '$utils/ops';
    import JquerySelectric from '$components/JquerySelectric.svelte';
    import { SelectorValues } from '$utils/constants';
    export let showAllYears: boolean = false;
    export let yearSelector: string | null = SelectorValues.Tabs;
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
    export let archiveTill: string = '';
    export let timeline: string | null = null;
    export let groupBy: string | null = null;
    export let restrictions: string[] = [];
    const currentYear = new Date().getFullYear();

    if (archive) {
        noOfYears || (noOfYears = 1);
    }
    // Check if a year array contains the current year
    const hasCurrentYear = (yearsArray: OptionType[]) =>
        yearsArray.some((item) => item.value === currentYear.toString());

    const getYears = debounce(async () => {
        await tick();

        const params = new URLSearchParams();
        params.set('locale', $locale);
        categories.forEach((category) => params.append('category_slug[]', category));
        tags.forEach((tag) => params.append('tags_slug[]', tag));
        timeline && params.append('timeline', timeline);
        restrictions.forEach((restriction) =>
            params.append('restriction_without_restriction[]', restriction)
        );
        // Fetch unique years data
        uniqueYearsData = await fetchYears({
            params,
            showAllYears,
            archive,
            noOfYears,
            archiveTill,
            fiscalYearBeginMD,
            fiscalYearEndMD,
            timeline
        });

        if (uniqueYearsData.length === 0) return;
        if (groupBy === GroupByValues.UpcomingWithYears) {
            // Check if the array contains any future years
            let hasFutureYears = uniqueYearsData.some(
                (item) => !isNaN(parseInt(item.value)) && parseInt(item.value) >= currentYear
            );
            if (hasFutureYears) {
                // Remove future years
                uniqueYearsData = uniqueYearsData.filter(
                    (item) => isNaN(parseInt(item.value)) || parseInt(item.value) <= currentYear
                );
                // Add upcoming item
                uniqueYearsData.unshift({ name: 'common.upcoming', value: 'upcoming' });
            }
        }
        if (activeYear) {
            if (activeYear === 'currentYear') {
                // Fetch upcoming years if currentYear is active
                const upcomingYearsData = await fetchYears({
                    ...params,
                    timeline: 'upcoming'
                });

                if (upcomingYearsData.length > 0) {
                    if (groupBy === GroupByValues.UpcomingWithYears) {
                        selectedYear = 'upcoming';
                    } else {
                        // If there are no future events in the current year, then set the next future year as the selectedYear.
                        selectedYear = hasCurrentYear(upcomingYearsData)
                            ? currentYear.toString()
                            : upcomingYearsData[upcomingYearsData.length - 1]?.value;
                    }
                } else {
                    // Check for currentYear in uniqueYearsData or fallback to closest past year
                    selectedYear = hasCurrentYear(uniqueYearsData)
                        ? currentYear.toString()
                        : uniqueYearsData
                              .filter((item) => parseInt(item.value) < currentYear)
                              .sort((a, b) => parseInt(b.value) - parseInt(a.value))[0]?.value ||
                          '';
                }
            } else {
                // If not currentYear, use activeYear directly
                selectedYear = activeYear;
            }
        } else {
            // Default to the first available year if no activeYear is provided
            selectedYear = uniqueYearsData[0].value;
        }
    });

    $: if ($locale || categories || timeline) {
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
    <div
        class="mb-2{yearSelector === SelectorValues.DropDown ||
        yearSelector === SelectorValues.Selectric
            ? ' d-inline-block w-25'
            : ''}"
    >
        {#if yearSelector === SelectorValues.Tabs}
            <Tabs options={uniqueYearsData} bind:value={selectedYear} />
        {:else if yearSelector === SelectorValues.Selectric}
            <JquerySelectric
                options={uniqueYearsData}
                bind:value={selectedYear}
                placeholder={$t('common.pleaseChooseYears')}
            />
        {:else}
            <DropDown options={uniqueYearsData} bind:value={selectedYear} />
        {/if}
    </div>
{/await}
