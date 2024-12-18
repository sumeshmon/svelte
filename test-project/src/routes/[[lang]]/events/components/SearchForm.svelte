<script lang="ts">
    import { t } from '$lib/translations';
    import { fetchEventCategories, fetchEventUniqueYears } from '$utils/events/api';
    import { getEventCategoryName } from '$utils/events/ops';
    import { category, itemsPerPage, year } from '$utils/events/filterState';
    import SelectInput from '$components/form/components/SelectInput.svelte';
    import { type OptionType } from '@eqs/cms-svelte-irtools';
    let yearOptions: OptionType[] = [{ name: 'All', value: '' }];
    let categoryOptions: OptionType[] = [{ name: 'All', value: '' }];
    let itemPerPageOptions: OptionType[] = [
        { name: '5', value: '5' },
        { name: '10', value: '10' },
        { name: '20', value: '20' },
        { name: '50', value: '50' },
        { name: '100', value: '100' }
    ];
    $: {
        fetchEventUniqueYears().then((res) => {
            const years = res['hydra:member'];
            yearOptions = [
                { name: 'All', value: '' },
                ...years.map((y: any) => ({ value: y.year, name: y.year })),
                {
                    name: 'Upcoming',
                    value: 'upcoming'
                },
                {
                    name: 'Past',
                    value: 'past'
                }
            ];
        });
        fetchEventCategories()
            .then((res) => {
                const categories = res['hydra:member'];
                categoryOptions = [
                    { name: 'All', value: '' },
                    ...categories.map((c: any) => ({
                        value: c.slug,
                        name: getEventCategoryName(c)
                    }))
                ];
            })
            .catch(console.error);
    }
</script>

<form on:submit|preventDefault class="form">
    <div class="row">
        <div class="col-md-4">
            <SelectInput
                cssClass="form-control"
                options={yearOptions}
                name="years"
                bind:value={$year}
                label={$t('events.years')}
            />
        </div>
        <div class="col-md-4">
            <SelectInput
                cssClass="form-control"
                options={categoryOptions}
                bind:value={$category}
                name="category"
                label={$t('events.category')}
            />
        </div>
        <div class="col-md-4">
            <SelectInput
                cssClass="form-control"
                options={itemPerPageOptions}
                bind:value={$itemsPerPage}
                name="limit"
                label={$t('events.item_per_page')}
            />
        </div>
    </div>
</form>
