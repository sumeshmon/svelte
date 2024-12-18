<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { locale } from '$lib/translations';
    import { formatNumber } from '$utils/ops';
    export let minValue: number = 0; //Initial min value of the counter
    export let maxValue: number = 0; //Initial max value of the counter
    export let duration: number = 3000; //Duration (in milliseconds) for the counter animation
    export let delay: number = 0; //Delay (in milliseconds) before starting the counter animation
    export let intersecting: boolean = false;
    export let fractionDigits: number = 0;
    const counter = tweened(0);
    const options = { minimumFractionDigits: 0, maximumFractionDigits: fractionDigits };

    $: if ($locale || intersecting) {
        if (!isNaN(maxValue)) {
            counter.set(minValue, { delay: 0, duration: 0 });
            counter.set(maxValue, { delay: delay, duration: duration });
        }
    }
</script>

<span>{formatNumber($counter, options)}</span>
