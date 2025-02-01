<script lang="ts">
    import { tick } from 'svelte';
    import { getCompanyProfile } from '$utils/share/ops';
    import { locale, t } from '$lib/translations';
    import Loader from '$components/Loader.svelte';
    import { debounce } from '$utils/ops';
    let companyProfile: string = '';
    let loader: boolean = true;
    let isMounted = false;
    const getData = debounce(async () => {
        loader = true;
        await tick();
        try {
            companyProfile = await getCompanyProfile();
        } catch (error) {
            console.error('Error fetching Company Profile:', error);
        } finally {
            loader = false;
        }
    });

    $: $locale && getData();
</script>

<Loader {loader}>
    <div>
        {#if companyProfile}
            {@html companyProfile}
        {:else}
            <p>{$t('share.notFound')}</p>
        {/if}
    </div>
</Loader>
