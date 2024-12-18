<script>
    import { onMount } from 'svelte';
    import Swiper from 'swiper';
    import { Navigation, Pagination } from 'swiper/modules';
    export let pagination = true;
    export let sliderArrows = true;
    export let options = {};
    export let className = 'ep-slider';

    onMount(() => {
        const swiper = new Swiper('.swiper', {
            direction: 'horizontal',
            loop: true,
            pagination: {
                el: '.' + className + '__swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.' + className + '__swiper-arrows-right',
                prevEl: '.' + className + '__swiper-arrows-left'
            },
            scrollbar: {
                el: '.swiper-scrollbar'
            },
            modules: [Navigation, Pagination],
            ...options
        });
    });
</script>

<div class={className}>
    <div class="{className}__swiper swiper">
        <div class="swiper-wrapper">
            <slot />
        </div>

        {#if sliderArrows}
            <div
                class="{className}__swiper-arrows {className}__swiper-arrows-left swiper-button-prev"
            />
            <div
                class="{className}__swiper-arrows {className}__swiper-arrows-right swiper-button-next"
            />
        {/if}
        <!--div class="swiper-scrollbar"></div-->
        {#if pagination}
            <div class="{className}__swiper-pagination swiper-pagination" />
        {/if}
    </div>
</div>
