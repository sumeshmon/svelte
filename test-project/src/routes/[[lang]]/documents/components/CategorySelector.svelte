<script lang="ts">
    import Tabs from '$components/Tabs.svelte';
    import DropDown from '$components/DropDown.svelte';
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    import { getDocumentCategories } from '$utils/documents/helper';
    import { locale } from '$lib/translations';
    import { debounce } from '$utils/ops';
    export let selectedCategory: string = '';
    export let currentPage: number = 1;
    export let categoryData: OptionType[] = [];
    export let showAllCategory: boolean = false;
    export let selectorCategories: string[] = [];
    export let categorySelector: string | null = 'tabs';
    export let activeCategory: string | null = null;

    const fetchCategories = debounce(async () => {
        categoryData = [];
        categoryData = await getDocumentCategories(selectorCategories);
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
    <div class="mb-2">
        {#if categorySelector === 'tabs'}
            <Tabs options={categoryData} bind:value={selectedCategory} />
            <div class="clearfix" />
        {:else}
            <DropDown options={categoryData} bind:value={selectedCategory} />
        {/if}
    </div>
{/await}
