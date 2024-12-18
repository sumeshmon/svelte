<script lang="ts">
    import { tick } from 'svelte';
    import Tabs from '$components/Tabs.svelte';
    import DropDown from '$components/DropDown.svelte';
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import { getEventsCategories } from '$utils/events/ops';
    import { locale, t } from '$lib/translations';
    import { debounce } from '$utils/ops';
    import JquerySelectric from '$components/JquerySelectric.svelte';
    import { SelectorValues } from '$utils/constants';
    export let selectedCategory: string = '';
    export let currentPage: number = 1;
    export let categoryData: OptionType[] = [];
    export let showAllCategory: boolean = false;
    export let selectorCategories: string[] = [];
    export let categorySelector: string | null = SelectorValues.Tabs;
    export let activeCategory: string | null = null;

    const fetchCategories = debounce(async () => {
        categoryData = [];
        await tick();

        categoryData = await getEventsCategories(selectorCategories);
        if (showAllCategory) {
            categoryData.unshift({ name: 'common.all', value: selectorCategories.join(';') });
        }
        activeCategory && (selectedCategory = activeCategory);
        selectedCategory == '' && (selectedCategory = categoryData[0].value);
    });
    $: $locale && fetchCategories();
    $: if (selectedCategory) {
        currentPage = 1;
    }
</script>

{#await categoryData}
    <p>Loading...</p>
{:then categoryData}
    <div
        class="mb-2{categorySelector === SelectorValues.DropDown ||
        categorySelector === SelectorValues.Selectric
            ? ' d-inline-block w-25'
            : ''}"
    >
        {#if categorySelector === SelectorValues.Tabs}
            <Tabs options={categoryData} bind:value={selectedCategory} />
            <div class="clearfix" />
        {:else if categorySelector === SelectorValues.Selectric}
            <JquerySelectric
                options={categoryData}
                bind:value={selectedCategory}
                placeholder={$t('common.pleaseChooseCategory')}
            />
        {:else}
            <DropDown options={categoryData} bind:value={selectedCategory} />
        {/if}
    </div>
{/await}
