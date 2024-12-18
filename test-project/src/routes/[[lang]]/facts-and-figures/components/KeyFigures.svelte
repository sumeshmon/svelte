<script lang="ts">
    import { t, locale } from '$lib/translations';
    import { getKeyFiguresData } from '$utils/facts-figures/ops';
    import type { figuresData } from '$utils/facts-figures/types';
    import IncrementCounter from '$components/IncrementCounter.svelte';
    import OnScrollObserver from '$components/OnScrollObserver.svelte';
    import Loader from '$components/Loader.svelte';
    import { debounce } from '$utils/ops';
    export let notFound: string = $t('facts.noFactsFigures');
    export let once: boolean = false; // Whether to animate the counter only once
    export let slug: string = 'key_figures';
    export let duration: number = 3000; // The duration of the animation in milliseconds
    export let figureMinColumn: number = -1; // The column index of the minimum value for the counter (If there is no specific column for the minimum value in the CMS, the counter will start from 0)
    export let figureMaxColumn: number = -1; // The column index of the maximum value for the counter
    export let symbolColumn: number = -1; // The column index of the symbol
    export let titleColumn: number = -1; // The column index of the title
    export let labelColumn: number = -1; // The column index of the label
    export let imageColumn: number = -1; // The column index of the image url
    export let noCounter: boolean = false; // Whether to show counter animation for the figures
    export let fractionDigits: number[] = []; //Number of fractional digits to show on each counter
    export let skipColumns: number[] = [];
    const randomKey: string = Math.random().toString(36).substring(2, 10);
    let loader = true;
    let keyFigures: figuresData = [];
    let footNotes: string[] = [];
    let intersecting: { [key: string]: boolean } = { [randomKey]: false };
    const getData = debounce(async () => {
        loader = true;
        try {
            const keyFiguresData = await getKeyFiguresData(
                slug,
                noCounter,
                figureMinColumn,
                figureMaxColumn,
                symbolColumn,
                titleColumn,
                labelColumn,
                imageColumn
            );
            keyFigures = keyFiguresData.figuresData;
            footNotes = keyFiguresData.footNotes;
        } catch (error) {
            console.error('Error fetching Figures (' + slug + '):', error);
        } finally {
            loader = false;
        }
    });
    $: if ($locale) {
        getData();
    }
    const extractValues = (data: string | number) => {
        let extractedValue = '';
        let extractedNumber = 0;
        if (typeof data === 'string') {
            const number = parseInt(data.replace(/[^0-9]/g, ''), 10);
            extractedValue = data.replace(/[0-9,]/g, '').trim();
            if (!isNaN(number)) {
                extractedNumber = number;
            }
        } else {
            extractedNumber = data;
        }

        return { value: extractedValue, number: extractedNumber };
    };
</script>

<Loader {loader}>
    {#if keyFigures && keyFigures.length > 0}
        <OnScrollObserver {once} bind:intersecting={intersecting[randomKey]}>
            <div class="row my-5">
                {#each keyFigures as item, itemsIndex}
                    {#if !skipColumns.includes(itemsIndex)}
                        <div class="col-12 col-sm-3 mb-5">
                            {#if item[5]}
                                <div class="facts-key-figures__counter--icon mb-3">
                                    <img width="50" alt="" decoding="async" src={item[5]} />
                                </div>
                            {/if}
                            <div class="key-figures-counter__number">
                                {#if item[2]}
                                    <span class="key-figures-counter__symbol">{@html item[2]}</span>
                                {/if}
                                {#if !noCounter}
                                    <span class="key-figures-counter__value">
                                        {extractValues(item[1]).value}
                                        <IncrementCounter
                                            intersecting={intersecting[randomKey]}
                                            minValue={parseFloat(item[0])}
                                            maxValue={extractValues(item[1]).number}
                                            fractionDigits={fractionDigits[itemsIndex] ?? 2}
                                            {duration}
                                        />
                                    </span>
                                {/if}
                            </div>
                            {#if noCounter}
                                <h4 class="facts-key-figures__counter--text--title">
                                    {@html item[1]}
                                </h4>
                            {/if}
                            <div class="key-figures-counter__text">
                                {#if item[3]}
                                    <span class="key-figures-counter__titles">{@html item[3]}</span>
                                {/if}
                                {#if item[4]}
                                    <p class="key-figures-counter__label">{@html item[4]}</p>
                                {/if}
                            </div>
                        </div>
                    {/if}
                {/each}
                <div class="col-12">
                    {@html footNotes.join(' ')}
                </div>
            </div>
        </OnScrollObserver>
    {:else}
        <p>{notFound}</p>
    {/if}
</Loader>
