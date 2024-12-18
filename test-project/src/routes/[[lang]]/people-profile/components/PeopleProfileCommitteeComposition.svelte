<script lang="ts">
    import { PUBLIC_PAGE_LIMIT } from '$env/static/public';
    import type { PeopleProfile } from '$utils/people-profile/types';
    import { locale } from '$lib/translations';
    import { fetchPeopleProfileList } from '$utils/people-profile/api';
    import Loader from '$components/Loader.svelte';
    import { profileMapList } from '$utils/people-profile/ops';
    import { debounce } from '$utils/ops';

    export let categories: Array<string> | null = null;
    export let itemsPerPage: string = PUBLIC_PAGE_LIMIT;
    export let notFound: string | null = null;

    const params = new URLSearchParams();
    let loader: boolean = true;
    let totalItems: number = 0;
    let profileItems: PeopleProfile[] = [];

    if (categories) {
        categories.forEach((category) => {
            params.append('profileCategories.category.slug[]', category);
        });
    }

    const getCommitteeComposition = debounce(async (params: URLSearchParams) => {
        loader = true;
        try {
            const response = await fetchPeopleProfileList(params);
            profileItems = response['hydra:member'];
            profileItems = profileMapList(profileItems, $locale, 'localId', 'languageCode', [
                'name',
                'title',
                'description',
                'metaData',
                'link'
            ]);
            totalItems = response['hydra:totalItems'];
        } catch (error) {
            console.error('Error fetching People Profile:', error);
        } finally {
            loader = false;
        }
    });

    $: if ($locale) {
        params.set('localId.languageCode', $locale);
        params.append('limit', itemsPerPage || PUBLIC_PAGE_LIMIT);
        getCommitteeComposition(params);
    }
</script>

<Loader bind:loader animation={true} align="center">
    {#if totalItems > 0}
        <table class="table table-hover">
            <thead>
                <th />
                <th />
                <th>Compensation Committee</th>
                <th>Nominating &amp;<br /> Governance Committee</th>
                <th>Audit Committee</th>
            </thead>
            <tbody>
                {#each profileItems as item}
                    <tr>
                        <td>
                            {item.name}
                        </td>
                        {#if item.tags && item.tags.length > 0}
                            <td>
                                {#if item.tags.some((tag) => tag.slug === 'independent_director')}
                                    <i class="icon-independent">I</i>
                                {/if}
                            </td>
                            <td>
                                {#if item.tags.some((tag) => tag.slug === 'compensation_committee_chairperson')}
                                    <i class="icon-user">C</i>
                                {:else if item.tags.some((tag) => tag.slug === 'compensation_committee_member')}
                                    <i class="icon-user-21">M</i>
                                {/if}
                            </td>
                            <td>
                                {#if item.tags.some((tag) => tag.slug === 'nominating_committee_chairperson')}
                                    <i class="icon-user">C</i>
                                {:else if item.tags.some((tag) => tag.slug === 'nominating_committee_member')}
                                    <i class="icon-user-21">/M</i>
                                {/if}
                            </td>
                            <td>
                                {#if item.tags.some((tag) => tag.slug === 'audit_committee_chairperson')}
                                    <i class="icon-user">C</i>
                                {:else if item.tags.some((tag) => tag.slug === 'audit_committee_member')}
                                    <i class="icon-user-21">M</i>
                                {/if}
                            </td>
                        {:else}
                            <td />
                            <td />
                            <td />
                            <td />
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>
        <div class="cms__composition-info">
            <div><i class="icon-independent">I</i> = Independent Director</div>
            <div><i class="icon-user">C</i> = Chairperson</div>
            <div><i class="icon-user-21">M</i> = Member</div>
        </div>
    {:else}
        {notFound}
    {/if}
</Loader>
