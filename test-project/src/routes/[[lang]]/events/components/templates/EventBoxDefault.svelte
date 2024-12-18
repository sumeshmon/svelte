<script lang="ts">
    import Table from '$components/Table.svelte';
    import type { Event, BoxCategories } from '$utils/events/types';
    import { getEventTitle, getEventFormattedDate, getEventBoxLinkData } from '$utils/events/ops';
    import { getNewsDetailPageLink, getPdfNewsLink } from '$utils/news/ops';
    import { t, locale } from '$lib/translations';
    import { handleClick } from '$components/disclaimer/handleClick';
    export let eventsList: Event[] = [];
    export let boxCategories: BoxCategories[] = [];
    const getBoxCategoryHeading = (category: BoxCategories) => {
        return Array.isArray(category) ? category.join('-') : category;
    };
</script>

<div class="events">
    <Table className="events table table-hover">
        <thead slot="thead">
            <tr>
                <th class="events__box-head">{$t(`events.box.heading.date`)}</th>
                <th class="events__box-head">{$t(`events.box.heading.title`)}</th>
                {#if boxCategories.length > 0}
                    {#each boxCategories as category}
                        <th class="events__box-head"
                            >{$t(`events.box.heading.${getBoxCategoryHeading(category)}`) ||
                                getBoxCategoryHeading(category)}</th
                        >
                    {/each}
                {/if}
            </tr>
        </thead>
        <tbody>
            {#each eventsList as event}
                <tr>
                    <td width="10%">
                        {getEventFormattedDate(event)}
                    </td>
                    <td width="30%">
                        {@html getEventTitle(event)}
                    </td>
                    {#if boxCategories.length > 0}
                        {#each boxCategories as boxCategory}
                            <td align="center">
                                {#if event.boxItems}
                                    {#each event.boxItems as boxItem}
                                        {#each boxItem.category as category}
                                            {#if boxCategory.includes(category.slug)}
                                                <a
                                                    class="d-block events__box-link"
                                                    href={getEventBoxLinkData(boxItem, boxCategory)
                                                        .url}
                                                    title={getEventBoxLinkData(boxItem, boxCategory)
                                                        .title}
                                                    on:click={(event) =>
                                                        handleClick(event, boxItem)}
                                                    data-disclaimer={boxItem.disclaimer}
                                                    data-uuid={boxItem.id}
                                                >
                                                    <span
                                                        class="icon-master-events events__icon-{boxItem.documentType.toLowerCase()}"
                                                    />
                                                </a>
                                            {:else if boxCategory.includes(boxItem.typeName)}
                                                {#if getPdfNewsLink(boxItem, $locale)}
                                                    <a
                                                        title={boxItem.headline?.[locale.get()]}
                                                        class="d-block events__box-link"
                                                        target="_blank"
                                                        href={getPdfNewsLink(boxItem, locale.get())}
                                                        ><span
                                                            class="icon-master-events events__icon-news"
                                                        /></a
                                                    >
                                                {:else}
                                                    <a
                                                        title={boxItem.headline[locale.get()]}
                                                        class="d-block events__box-link"
                                                        target="_blank"
                                                        href={getNewsDetailPageLink(
                                                            boxItem,
                                                            locale.get()
                                                        )}
                                                        ><span
                                                            class="icon-master-events events__icon-news"
                                                        /></a
                                                    >
                                                {/if}
                                            {/if}
                                        {/each}
                                    {/each}
                                {/if}
                            </td>
                        {/each}
                    {/if}
                </tr>
            {/each}
        </tbody>
    </Table>
</div>
