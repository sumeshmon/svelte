<script lang="ts">
    import { slide } from 'svelte/transition';
    import { t, locale } from '$lib/translations';
    import { getSearchConfig } from '$utils/search/helper';
    export let open = false;
    let searchPath: string;

    $: {
        const searchConfigData = getSearchConfig();
        searchPath = searchConfigData['search']?.[$locale]?.searchPath;
    }
</script>

<div class="search">
    <form role="search" method="get" id="searchform" class="search__form" action={searchPath}>
        {#if open}
            <input
                id="search"
                type="text"
                name="q"
                class="search__field"
                data-search-field=""
                placeholder="{$t('search.placeholder')}..."
                transition:slide={{ axis: 'x' }}
            />
            <button
                type="submit"
                value=""
                class="search__submit"
                on:click={() => {
                    open = !open;
                }}><span class="icon-master-search" /></button
            >
        {:else}
            <button
                value=""
                class="search__submit"
                on:click={() => {
                    open = !open;
                }}><span class="icon-master-search" /></button
            >
        {/if}
    </form>
</div>
