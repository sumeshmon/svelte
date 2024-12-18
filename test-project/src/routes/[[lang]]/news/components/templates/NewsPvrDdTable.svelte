<script lang="ts">
    import Table from '$components/Table.svelte';
    import type { NewsType } from '$utils/news/types';
    import { getNewsFormattedDate } from '$utils/news/ops';
    import { t, locale } from '$lib/translations';
    export const handleDetailViewClick = async (event: MouseEvent, item: NewsType) => {};
    export let newsList: NewsType[] = [];
    const getThresholdDate = (news: NewsType) => {
        return news?.metaData[$locale]?.details?.pvr?.threshold_date || '';
    };
    const getLegalEntity = (news: NewsType) => {
        let name: string = '';
        if (news?.metaData[$locale]?.details?.pvr?.person?.legal_person?.name) {
            const legalPersonName = news.metaData[$locale].details.pvr.person.legal_person.name;
            if (typeof legalPersonName === 'string') {
                name = legalPersonName;
            } else {
                name += legalPersonName?.first_name || '';
                name += ' ' + legalPersonName?.last_name || '';
            }
        }
        if (news?.metaData[$locale]?.details?.pvr?.person?.natural_person?.name) {
            const naturalPersonName = news.metaData[$locale].details.pvr.person.natural_person.name;
            if (typeof naturalPersonName === 'string') {
                name = naturalPersonName;
            } else {
                name += naturalPersonName?.first_name || '';
                name += ' ' + naturalPersonName?.last_name || '';
            }
        }
        return name;
    };
    const getLocation = (news: NewsType) => {
        let location = '';
        if (news?.metaData[$locale]?.details?.pvr?.person?.legal_person) {
            location += news.metaData[$locale].details.pvr.person.legal_person.location.city || '';
            location +=
                ' ' + news.metaData[$locale].details.pvr.person.legal_person.location.country || '';
        }
        return location;
    };
    const getTotalPositions = (news: NewsType) => {
        let positions = '';
        if (news?.metaData[$locale]?.details?.pvr?.total_positions) {
            for (const key in news.metaData[$locale].details.pvr.total_positions) {
                if (
                    Object.hasOwnProperty.call(
                        news.metaData[$locale].details.pvr.total_positions,
                        key
                    )
                ) {
                    const totalPositions = news.metaData[$locale].details.pvr.total_positions[key];
                    positions += totalPositions.percentage_total_of_both + ' %' || '';
                    positions += totalPositions.total_number_of_voting_rights || '';
                }
            }
        }
        return positions;
    };
</script>

<Table>
    <thead slot="thead">
        <tr>
            <th>{$t('news.dateOfPublication')}</th>
            <th>{$t('news.thresholdDate')}</th>
            <th>{$t('news.legalEntity')}</th>
            <th>{$t('news.registeredOffice')}</th>
            <th>{$t('news.totalPositions')}</th>
        </tr>
    </thead>
    <tbody>
        {#each newsList as news}
            <tr>
                <td>{getNewsFormattedDate(news.newsDateLocal)}</td>

                <td>
                    {getThresholdDate(news)}
                </td>
                <td>
                    {getLegalEntity(news)}
                </td>
                <td>
                    {getLocation(news)}
                </td>
                <td>
                    {getTotalPositions(news)}
                </td>
            </tr>
        {/each}
    </tbody>
</Table>
