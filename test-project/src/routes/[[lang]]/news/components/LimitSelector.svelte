<script lang="ts">
    import DropDown from '$components/DropDown.svelte';
    import type { OptionType } from '@eqs/cms-svelte-irtools';
    export let selectedLimit: string = '';
    let limitOptions: OptionType[] = [];

    let setOptions = () => {
        limitOptions = [
            { name: '5', value: '5' },
            { name: '10', value: '10' },
            { name: '20', value: '20' },
            { name: '50', value: '50' }
        ];
    };

    $: {
        setOptions();
    }
</script>

<div class="mb-2 d-inline-block">
    <DropDown options={limitOptions} bind:value={selectedLimit} />
</div>
