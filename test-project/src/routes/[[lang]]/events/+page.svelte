<script lang="ts">
    import { t } from '$lib/translations';
    import EventsList from './components/EventsList.svelte';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import UpcomingTeaser from '$routes/events/components/templates/EventsTeaser.svelte';
    import { page } from '$app/stores';
    import { GroupByValues } from '$utils/constants';
    import { SelectorValues } from '$utils/constants';
</script>

<svelte:head>
    <title>{$t('head.events.title')}</title>
    <meta name="description" content={$t('head.events.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>

<div class="page events">
    <Banner title={$t('head.events.title')} />

    <Breadcrumb path={$page.url.pathname} />

    <div class="page__content">
        <section class="container">
            <section>
                <h2>Landing Page Teaser (Upcoming)</h2>
                <EventsList
                    template={UpcomingTeaser}
                    itemsPerPage="50"
                    timeline="upcoming"
                    paginatorType={false}
                />
            </section>
            <hr />
            <section>
                <h2>{$t('events.eventListingUpcoming')}</h2>
                <EventsList itemsPerPage="50" timeline="upcoming" paginatorType={false} />
            </section>
            <hr />
            <section>
                <h2>{$t('events.eventListingPast')}</h2>
                <EventsList
                    itemsPerPage="50"
                    timeline="past"
                    noOfYears={2}
                    archive={true}
                    yearSelector={SelectorValues.Tabs}
                    paginatorType={false}
                />
            </section>
            <hr />
            <section>
                <h2>
                    All Events year tab listing
                    <small
                        >If the current year has future events, show the current year as the active
                        year. If there are no future events, show the next available future year as
                        the active year. Otherwise, show the most recent past year as the active
                        year.
                    </small>
                </h2>
                <EventsList
                    itemsPerPage="50"
                    noOfYears={4}
                    archive={true}
                    yearSelector={SelectorValues.Tabs}
                    activeYear="currentYear"
                    paginatorType={false}
                />
            </section>
            <hr />
            <section>
                <h2>
                    Upcoming Events and years tab listing
                    <small
                        >If there are future events, show 'Upcoming events' as active tab. Else show
                        the most recent past year as the active tab.
                    </small>
                </h2>
                <EventsList
                    itemsPerPage="50"
                    noOfYears={4}
                    archive={true}
                    activeYear="currentYear"
                    yearSelector={SelectorValues.Tabs}
                    paginatorType={false}
                    groupBy={GroupByValues.UpcomingWithYears}
                />
            </section>
            <hr />
            <section>
                <h2>GroupBy Upcoming and Past</h2>
                <EventsList
                    itemsPerPage="50"
                    groupBy={GroupByValues.Timeline}
                    paginatorType={false}
                />
            </section>
            <hr />
            <section>
                <h2>
                    GroupBy Category
                    <small>Given categories 'test_events' and 'test_events_2' </small>
                </h2>
                <EventsList
                    itemsPerPage="50"
                    categories={['test_events', 'test_events_2']}
                    groupBy={GroupByValues.Category}
                />
            </section>
            <hr />
            <section>
                <h2>
                    GroupBy Category And Years
                    <small>Given categories 'test_events' and 'roadshow' </small>
                </h2>
                <EventsList
                    itemsPerPage="50"
                    categories={['test_events', 'roadshow']}
                    yearSelector={SelectorValues.Tabs}
                    categorySelector={SelectorValues.Tabs}
                />
            </section>
        </section>
    </div>
</div>
