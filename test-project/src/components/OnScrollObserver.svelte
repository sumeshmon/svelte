<script lang="ts">
    /**
     * This is a reusable component designed to facilitate the detection of when a specified element comes into view as the user scrolls the page.
     */
    import IntersectionObserver from 'svelte-intersection-observer';
    let element: HTMLElement | null = null;
    export let intersecting: boolean = false;
    export let threshold: number = 0;
    export let once: boolean = false;
</script>

<IntersectionObserver {once} {element} bind:intersecting {threshold}>
    <div bind:this={element}>
        <slot />
    </div>
</IntersectionObserver>
