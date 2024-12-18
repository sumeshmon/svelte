<script lang="ts">
    import { tick } from 'svelte';
    import { locale } from '$lib/translations';
    import type { chartApi } from '$utils/share/types';
    import Loader from '$components/Loader.svelte';
    import { debounce } from '$utils/ops';
    export let chartSlug: string = '';
    let loader: boolean = true;
    let chartData: chartApi;
    let changeRelative: number;
    let lastPriceFormatted: string;
    let changeRelativeFormatted: string;
    const getData = debounce(async () => {
        loader = true;
        await tick();
        let chartAPI: string = 'https://charts3.equitystory.com/api-json/';
        if (chartSlug) {
            let lang: string = '/English/';
            if (locale.get() == 'de') {
                lang = '/German/';
            }
            chartAPI += chartSlug + lang;
            fetch(chartAPI)
                .then((response) => response.json())
                .then((data) => {
                    chartData = data;
                    changeRelative = parseFloat(chartData.change_relative.replace(/[+%]/g, ''));
                })
                .catch((error) => console.error('Error fetching chartAPI:', error))
                .finally(() => {
                    loader = false;
                });
        }
    });

    $: $locale && getData();
</script>

<Loader {loader}>
    {#if chartData}
        <div class="price-ticker__container">
            <span class="price-ticker__currency">{chartData.currency}</span>
            <span class="price-ticker__last-price">{chartData.last_price}</span>
            <span class="price-ticker__separator"> | </span>
            <span
                class="price-ticker__change_relative {changeRelative > 0
                    ? 'price-ticker__up'
                    : 'price-ticker__down'}"
                >{changeRelative > 0 ? '+' : ''}{chartData.change_relative}%
                <span
                    class="price-ticker__icon icon-master-arrow-{changeRelative > 0
                        ? 'up-6'
                        : 'down-6'}"
                />
            </span>
        </div>
    {/if}
</Loader>
