<script lang="ts">
    import { fetchEventBox } from '$utils/events/api';
    import EventsBoxTeaser from '$routes/events/components/templates/EventsBoxTeaser.svelte';
    import { t, locale } from '$lib/translations';
    import Loader from '$components/Loader.svelte';

    export let template: typeof EventsBoxTeaser = EventsBoxTeaser;
    export let notFound: string = $t('events.noItemsFound');
    export let categories: Array<string> | null = null;
    export let tags: Array<string> | null = null;
    export let startOrder: string | null = 'DESC';
    export let sortOrder: string | null = null;
    export let dateOrder: string | null = null;
    export let timeOrder: string | null = null;
    let events: any = [];
    const params = new URLSearchParams();
    let eventBoxLoader: boolean = true;
    if (categories) {
        categories.forEach((category) => {
            params.append('category.slug[]', category.toString());
        });
    }
    if (tags) {
        tags.forEach((tag) => {
            params.append('tags.slug[]', tag.toString());
        });
    }
    sortOrder && params.set('sortOrder', sortOrder);
    timeOrder && params.set('timeOrder', timeOrder);
    dateOrder && params.set('dateOrder', dateOrder);
    startOrder && params.set('order[start]', startOrder);
    const fetchEventBoxListing = async (params: URLSearchParams) => {
        eventBoxLoader = true;
        try {
            fetchEventBox(params).then(async (res) => {
                events = res['hydra:member'];
                eventBoxLoader = false;
            });
        } catch (error) {
            console.error('Error fetching Events:', error);
        }
    };

    $: if ($locale) {
        fetchEventBoxListing(params);
    }
</script>

<Loader align="center" animation={true} bind:loader={eventBoxLoader}>
    {#if events && events.length > 0}
        {#if template}
            <svelte:component this={template} {events} />
        {/if}
    {:else if events && events.length === 0}
        <p>{notFound}</p>
    {/if}
</Loader>
