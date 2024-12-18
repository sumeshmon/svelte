<script lang="ts">
    import { tick } from 'svelte';
    import Loader from '$components/Loader.svelte';
    import type { PeopleProfile } from '$utils/people-profile/types';
    import { getPeopleProfileList, prepareProfileList } from '$utils/people-profile/ops';
    import { PUBLIC_PAGE_LIMIT } from '$env/static/public';
    import { PaginatorType } from '$utils/constants';
    import { t, locale } from '$lib/translations';
    import DynamicPaginator from '$components/DynamicPaginator.svelte';
    import PeopleProfileDefault from './templates/PeopleProfileDefault.svelte';
    import { debounce } from '$utils/ops';
    export let template: typeof PeopleProfileDefault = PeopleProfileDefault;
    export let itemsPerPage: string = PUBLIC_PAGE_LIMIT;

    export let categories: string[] = [];
    export let tags: string[] = [];
    export let notFound: string = $t('profile.noItemsFound');
    export let paginatorType: string | boolean = PaginatorType.Pagination;
    export let currentPage: number = 1;
    const params = new URLSearchParams();
    let loader: boolean = true;
    let totalItems: number = -1;
    let profileList: PeopleProfile[] = [];
    if (categories) {
        categories.forEach((category) => {
            params.append('profileCategories.category.slug[]', category);
        });
    }
    if (tags) {
        tags.forEach((tag) => {
            params.append('tags.slug[]', tag);
        });
    }
    params.append('limit', itemsPerPage);
    const getData = debounce(async () => {
        await tick();
        try {
            const response = await getPeopleProfileList(params);
            totalItems = response.totalItems;
            profileList = prepareProfileList(response.profileList, profileList, paginatorType);
        } catch (error) {
            console.error('Error fetching People Profile:', error);
        } finally {
            loader = false;
        }
    });

    $: {
        params.set('localId.languageCode', $locale);
        params.set('page', currentPage.toString());
        getData();
    }
    $: totalItems && (currentPage = 1);
</script>

<Loader {loader}>
    {#if profileList && totalItems > 0}
        {#if template}
            <svelte:component this={template} {profileList} />
        {/if}
        {#if paginatorType}
            <DynamicPaginator {paginatorType} {totalItems} {itemsPerPage} bind:currentPage />
        {/if}
    {:else if profileList && totalItems == 0}
        <p class="mt-1">{notFound}</p>
    {/if}
</Loader>
