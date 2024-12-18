<script lang="ts">
    import Table from '$components/Table.svelte';
    import Modal from '$components/Modal.svelte';
    import type { Event } from '$utils/events/types';
    import {
        getEventTitle,
        getEventFormattedDate,
        checkEventIcs,
        createIcsFilename,
        getEventMetaDataLinks,
        generateEventIcsFile,
        //eventToYahooCalendarEvent,
        eventToGoogleCalendarEvent
    } from '$utils/events/ops';
    import { t } from '$lib/translations';
    export let eventsList: Event[] = [];
    export let timeline: string | null = null;
    let showModal: boolean = false;
    let modalHeading: string = '';
    let googleLink: string = '';
    //let yahooLink: string = '';
    let eventItemIcs: Event;
    let icsFilename: string = '';
    const icsAllFileName: string = 'allEvent.ics';
    const addToCalendarModal = (event: Event) => {
        showModal = true;
        modalHeading = $t('events.modalTitle');
        googleLink = eventToGoogleCalendarEvent(event);
        //yahooLink = eventToYahooCalendarEvent(event);
        icsFilename = createIcsFilename(event);
        eventItemIcs = event;
    };

    const handleEventIcs = () => {
        generateEventIcsFile(eventItemIcs, icsFilename);
    };
    const handleAllEventIcs = () => {
        generateEventIcsFile(eventsList, icsAllFileName, timeline);
    };
</script>

<div class="events">
    <Table>
        <thead slot="thead">
            <tr>
                <th>{$t('events.date')}</th>
                <th>{$t('events.title')}</th>
                {#if timeline !== 'past'}<th class="text-center">{$t('events.addToCalendar')}</th>
                {/if}
            </tr>
        </thead>
        <tbody>
            {#each eventsList as event}
                <tr class={event.isFutureEvent ? 'events__future' : 'events__past'}>
                    <td>{getEventFormattedDate(event)}</td>
                    <td>
                        {@html getEventTitle(event)}{@html event.location
                            ? `, <span class="icon-master-pion-big"></span>` + event.location
                            : ''}
                        <div>
                            {@html event.titleUrl
                                ? `<a href="${event.titleUrl}">${event.titleUrl}</a>`
                                : ''}
                        </div>
                        <div>{event.subheadline}</div>
                        <div>{@html event.note}</div>
                        <div>
                            {@html event?.irManagerEmail
                                ? `<a href="mailto:${event.irManagerEmail}">${event.irManagerEmail}</a>`
                                : ''}
                        </div>
                        {@html getEventMetaDataLinks(event)}
                    </td>
                    {#if timeline !== 'past'}
                        <td class="text-center">
                            {#if checkEventIcs(event)}
                                <button
                                    class="events__add"
                                    on:click={() => addToCalendarModal(event)}
                                    title={$t('events.addToCalendar')}
                                    ><span class="icon-master-calendar-plus-o" /></button
                                >
                            {/if}
                        </td>
                    {/if}
                </tr>
            {/each}
        </tbody>
    </Table>
    {#if timeline !== 'past'}
        <button on:click={handleAllEventIcs} class="btn btn-link">
            {$t('common.generate_all_ics')}
        </button>
    {/if}
</div>
{#if showModal}
    <Modal bind:showModal cssClass="events__modal">
        <h4 slot="header" class="mb-3">
            {@html modalHeading}
        </h4>
        <div class="row">
            <div class="col col-sm-6">
                <a
                    class="btn btn-secondary d-block mb-3"
                    rel="nofollow"
                    target="_blank"
                    href={googleLink}>Google</a
                >
            </div>
            <!--div class="col col-sm-6">
                <a
                    class="btn btn-secondary d-block mb-3"
                    rel="nofollow"
                    target="_blank"
                    href={yahooLink}>Yahoo</a
                >
            </div-->
            <div class="col col-sm-6">
                <button on:click={handleEventIcs} class="btn btn-secondary d-block mb-3 w-100">
                    ICS
                </button>
            </div>
        </div>
    </Modal>
{/if}
