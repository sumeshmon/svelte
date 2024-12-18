<script lang="ts">
    import { t } from '$lib/translations';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import PeopleProfileList from '$routes/people-profile/components/PeopleProfileList.svelte';
    import PeopleProfileCommitteeComposition from '$routes/people-profile/components/PeopleProfileCommitteeComposition.svelte';
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>{$t('head.peopleProfile.title')}</title>
    <meta name="description" content={$t('head.peopleProfile.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>
<div class="page">
    <Banner title={$t('head.peopleProfile.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <section>
                <h2>Management Board</h2>

                <PeopleProfileList
                    categories={['management_board']}
                    itemsPerPage="100"
                    notFound={$t('profile.noItemsFound')}
                    paginatorType={false}
                />
            </section>

            <section>
                <h2>Supervisory Board</h2>

                <PeopleProfileList
                    categories={['supervisory_board']}
                    itemsPerPage="100"
                    notFound={$t('profile.noItemsFound')}
                    paginatorType={false}
                />
            </section>
            <section>
                <h2>Ir Contacts</h2>
                <PeopleProfileList
                    categories={['ir_contacts']}
                    itemsPerPage="100"
                    notFound={$t('profile.noItemsFound')}
                    paginatorType={false}
                />
            </section>
            <section>
                <h2>Committee Composition</h2>
                <PeopleProfileCommitteeComposition notFound={$t('profile.noItemsFound')} />
            </section>
        </div>
    </div>
</div>
