<script lang="ts">
    import { t } from '$lib/translations';
    import IpoNews from '$routes/ipo/components/IpoNews.svelte';
    import IpoProspectus from '$routes/ipo/components/IpoProspectus.svelte';
    import Faq from '$routes/facts-and-figures/components/Faq.svelte';
    import PeopleProfileList from '$routes/people-profile/components/PeopleProfileList.svelte';
    import { PUBLIC_CURRENT_PHASE } from '$env/static/public';
    import { phases } from '$utils/constants';
</script>

<svelte:head>
    <title>{$t('head.ipo.title')}</title>
    <meta content={$t('head.ipo.meta.description')} name="description" />
    <meta content="index, follow" name="robots" />
</svelte:head>

<div class="page__content">
    <div class="container">
        {#if phases['itf'] <= phases[PUBLIC_CURRENT_PHASE]}
            <section>
                <h1>Listing of [COMPANY AG]</h1>
                <p class="mb-5">
                    Here you will find information and documents about the listing of [COMPANY AG].
                </p>
            </section>
        {/if}
        {#if phases['itf'] <= phases[PUBLIC_CURRENT_PHASE]}
            <section>
                <h2>News</h2>
                <IpoNews
                    categories={['ipo']}
                    itemsPerPage="3"
                    notFound={$t('documents.no_item_found')}
                    tags={['ipo_news']}
                />
            </section>
        {/if}
        {#if phases['prospectus'] <= phases[PUBLIC_CURRENT_PHASE]}
            <section>
                <h2>Prospectus</h2>
                <IpoProspectus
                    categories={['ipo']}
                    itemsPerPage="3"
                    notFound={$t('documents.no_item_found')}
                    tags={['ipo_prospectus']}
                />
            </section>
        {/if}

        {#if phases['itf'] <= phases[PUBLIC_CURRENT_PHASE]}
            <section class="my-5">
                <h2>FAQ</h2>
                <br />
                <Faq />
            </section>
        {/if}

        {#if phases['itf'] <= phases[PUBLIC_CURRENT_PHASE]}
            <section class="my-5">
                <h2>IR Contact</h2>
                <br />
                <PeopleProfileList
                    categories={['ir_contacts']}
                    itemsPerPage="1"
                    notFound={$t('profile.noItemsFound')}
                    paginatorType={false}
                />
            </section>
        {/if}
    </div>
</div>
