<script lang="ts">
    import { tick } from 'svelte';
    import Tabs from '$components/Tabs.svelte';
    import DropDown from '$components/DropDown.svelte';
    import JquerySelectric from '$components/JquerySelectric.svelte';
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import { getNewsCategories } from '$utils/news/ops';
    import { locale, t } from '$lib/translations';
    import { debounce } from '$utils/ops';
    export let selectedCategory: string = '';
    export let currentPage: number = 1;
    export let categoryData: OptionType[] = [];
    export let selectorCategories: string[] = [];
    export let categorySelector: string | null = 'tabs';
    export let activeCategory: string | null = null;
    export let multiSelect: boolean = false;
    export let placeholder: string | boolean = false;
    export let showAllCategory: boolean = false;
    export let years: string[] = [];
    multiSelect && (showAllCategory = true);
    const fetchCategories = debounce(async () => {
        categoryData = [];
        await tick();
        categoryData = await getNewsCategories(selectorCategories, years);
        categoryData = categoryData.map((category) => {
            return {
                name: $t('news.' + category.value) || category.name, // Use translated or modified name if available; otherwise, use the default name
                value: category.value
            };
        });
        if (showAllCategory) {
            categoryData.unshift({ name: 'common.all', value: selectorCategories.join(';') });
        }
        activeCategory && (selectedCategory = activeCategory);
        selectedCategory === '' && (selectedCategory = categoryData[0].value);
    });
    $: if ($locale) {
        selectedCategory = '';
        fetchCategories();
    }
    $: if (selectedCategory) {
        currentPage = 1;
    }
    $: if (years) {
        fetchCategories();
    }
</script>

{#await categoryData}
    <p>Loading...</p>
{:then categoryData}
    {#if categoryData.length > 0}
        <div class="mb-2{categorySelector === 'dropDown' ? ' d-inline-block' : ''}">
            {#if categorySelector === 'tabs'}
                <Tabs options={categoryData} bind:value={selectedCategory} />
                <div class="clearfix" />
            {:else if categorySelector === 'selectric'}
                <JquerySelectric
                    id="category"
                    options={categoryData}
                    bind:value={selectedCategory}
                    multiple={multiSelect}
                    {placeholder}
                />
            {:else}
                <DropDown options={categoryData} bind:value={selectedCategory} />
            {/if}
        </div>
    {/if}
{/await}
