<script lang="ts">
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import { locale, t } from '$lib/translations';
    import Tabs from '$components/Tabs.svelte';
    import DropDown from '$components/DropDown.svelte';
    import JquerySelectric from '$components/JquerySelectric.svelte';
    import { SelectorValues } from '$utils/constants';
    export let showAllMonths: boolean = false;
    export let monthSelector: string | null = SelectorValues.Tabs;
    export let selectedMonth: string = '';
    let monthsData: OptionType[] = [];

    const initializeMonthsData = () => {
        monthsData = [
            { name: $t('common.january'), value: '01' },
            { name: $t('common.february'), value: '02' },
            { name: $t('common.march'), value: '03' },
            { name: $t('common.april'), value: '04' },
            { name: $t('common.may'), value: '05' },
            { name: $t('common.june'), value: '06' },
            { name: $t('common.july'), value: '07' },
            { name: $t('common.august'), value: '08' },
            { name: $t('common.september'), value: '09' },
            { name: $t('common.october'), value: '10' },
            { name: $t('common.november'), value: '11' },
            { name: $t('common.december'), value: '12' }
        ];
        showAllMonths && monthsData.unshift({ name: $t('common.allMonths'), value: '' });
        /*setTimeout(()=>{ // Set the current month as the selected month
            selectedMonth = String(new Date().getMonth() + 1);
        }, 500)*/
    };
    $: if ($locale) {
        initializeMonthsData();
    }
</script>

<div
    class="mb-2{monthSelector === SelectorValues.DropDown ||
    monthSelector === SelectorValues.Selectric
        ? ' d-inline-block w-25'
        : ''}"
>
    {#if monthSelector == SelectorValues.Tabs}
        <Tabs options={monthsData} bind:value={selectedMonth} />
    {:else if monthSelector === SelectorValues.Selectric}
        <JquerySelectric
            options={monthsData}
            bind:value={selectedMonth}
            placeholder={$t('common.pleaseChooseMonths')}
        />
    {:else}
        <DropDown options={monthsData} bind:value={selectedMonth} />
    {/if}
</div>
