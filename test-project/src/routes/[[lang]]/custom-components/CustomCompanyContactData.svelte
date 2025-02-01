<script lang="ts">
    import { onMount } from 'svelte';
    import Loader from '$components/Loader.svelte';
    import type { CompanyContactData } from '$utils/company-contact/types';
    import { t } from '$lib/translations';
    import { getCompanyContactData } from '$utils/company-contact/ops';
    import Table from '$components/Table.svelte';
    let loader: boolean = true;
    let data: CompanyContactData | null = null;

    onMount(async () => {
        try {
            data = await getCompanyContactData();
            console.log(data.name);
        } catch (error) {
            console.error('Error fetching company contact data:', error);
        } finally {
            loader = false;
        }
    });
    
    
</script>

<Loader bind:loader animation={true} align="center">
    {#if data}
        <Table className="table-hover table-cell-separated">
            <tbody>
                <tr>
                    <th>{$t('common.name')}</th>
                    <td>{data.name}</td>
                </tr>
                <tr>
                    <th>{$t('common.isin')}</th>
                    <td>{data.isin}</td>
                </tr>
                <tr>
                    <th>{$t('common.wkn')}</th>
                    <td>{data.wkn}</td>
                </tr>
                <tr>
                    <th>{$t('common.sector')}</th>
                    <td>
                        {#each data.sector as sector}
                            {sector.name}
                        {/each}
                    </td>
                </tr>
                <tr>
                    <th>{$t('common.city')}</th>
                    <td>{data.cockpitCompanyData.city}</td>
                </tr>
                <tr>
                    <th>{$t('common.country')}</th>
                    <td>{data.cockpitCompanyData.country}</td>
                </tr>
                <tr>
                    <th>{$t('common.email')}</th>
                    <td>{data.cockpitCompanyData.email}</td>
                </tr>
                <tr>
                    <th>{$t('common.fax')}</th>
                    <td>{data.cockpitCompanyData.fax}</td>
                </tr>
                <tr>
                    <th>{$t('common.street')}</th>
                    <td>{data.cockpitCompanyData.street}</td>
                </tr>
                <tr>
                    <th>{$t('common.tel')}</th>
                    <td>{data.cockpitCompanyData.tel}</td>
                </tr>
                <tr>
                    <th>{$t('common.url')}</th>
                    <td>
                        <a href={data.cockpitCompanyData.url} target="_blank">
                            {data.cockpitCompanyData.url}</a
                        >
                    </td>
                </tr>
                <tr>
                    <th>{$t('common.zip')}</th>
                    <td>{data.cockpitCompanyData.zip}</td>
                </tr>
            </tbody>
        </Table>
    {:else}
        {$t('common.noItemsFound')}
    {/if}
</Loader>
