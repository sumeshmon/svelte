<script lang="ts">
    import type { TableData } from '$utils/facts-figures/types';
    import { extractGlossaryData } from '$utils/facts-figures/ops';
    import { slide } from 'svelte/transition';
    import Slider from '$components/Header/Slider.svelte';
    import Slide from '$components/Header/Slide.svelte';
    import { locale } from '$lib/translations';
    import { browser } from '$app/environment';

    export let tableData: TableData;
    export const slug: string = '';
    export const filterColumn: string = '';
    const scrollDelay = 300;
    const allowMultipleOpen: boolean = false;
    const defaultOpenItemIndex: number | null = 0; // if nothing to open by default pass null
    let glossaryData: any, glossaryList: any;

    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    const headerSection = document.querySelector('.header') as HTMLElement;

    let swiperOptions = {
        slidesPerView: 'auto',
        spaceBetween: 4,
        loop: false,
        centeredSlides: false,
        autoplayStopOnLast: true,
        navigation: {
            nextEl: '.glossary-letter__nav .swiper-button-next',
            prevEl: '.glossary-letter__nav .swiper-button-prev'
        },
        On: {
            slideChange: function () {
                calculateDynamicWidth(this);
            },
            resize: function () {
                calculateDynamicWidth(this);
            }
        }
    };

    const calculateDynamicWidth = (swiper: any) => {
        const slides = swiper.slides;
        const containerWidth = swiper.width;

        // Calculate width dynamically based on screen size or any other logic
        slides.forEach((slide: any) => {
            const dynamicWidth = containerWidth / 4; // Example: Set slide width to 1/3 of container
            slide.style.width = `${dynamicWidth.toFixed(0)}px`;
        });

        // Update Swiper after setting widths
        swiper.update();
    };

    const getActiveGlossaryLinks = (letter: string) => {
        return glossaryData[letter] ? ' active' : '';
    };

    const navigateToGlossary = (e: Event, letter: string) => {
        const section = document.getElementById(`glossary_${letter}`);

        if (section && headerSection) {
            scrollToPosition(section);
        }
        e.preventDefault();
    };

    const scrollToPosition = (section: HTMLElement) => {
        if (!browser) {
            return false;
        }
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const scrollToPosition = sectionTop - headerSection.offsetHeight;
        window.scrollTo({
            top: scrollToPosition,
            behavior: 'smooth'
        });
    };

    const toggleAccordion = (e: Event, glossaryIndex: number, itemIndex: number) => {
        glossaryList = glossaryList.map((glossary: any, cIndex: number) => {
            if (cIndex === glossaryIndex) {
                const updatedItems = glossary[1]?.map((item: any, iIndex: number) => {
                    if (iIndex === itemIndex) {
                        // Toggle the clicked item
                        return { ...item, isOpen: !item.isOpen };
                    }
                    // If multiple accordions are not allowed, close other items
                    return allowMultipleOpen ? item : { ...item, isOpen: false };
                });
                return [glossary[0], updatedItems];
            }
            // If multiple accordions are not allowed, close items in other categories
            return allowMultipleOpen
                ? glossary
                : [glossary[0], glossary[1]?.map((item: any) => ({ ...item, isOpen: false }))];
        });

        const section = e.target as HTMLElement;
        setTimeout(() => {
            const isActive = section.getAttribute('aria-expanded');
            if (section && isActive == 'true') {
                scrollToPosition(section);
            }
        }, scrollDelay);

        e.preventDefault();
    };

    $: if ($locale) {
        glossaryData = extractGlossaryData(tableData, defaultOpenItemIndex);
        glossaryList = Object.entries(glossaryData);
    }
</script>

<div class="glossary">
    <div class="glossary-letter">
        <Slider options={swiperOptions} className="glossary-slider" pagination={false}>
            {#each letters as letter}
                <Slide className={'glossary-slider__item'}>
                    <a
                        on:click={(e) => navigateToGlossary(e, letter)}
                        href={`#glossary_${letter}`}
                        class={`glossary-letter__links${getActiveGlossaryLinks(letter)}`}
                        >{letter}</a
                    >
                </Slide>
            {/each}
        </Slider>
        <div class="glossary-letter__nav">
            <div
                class="glossary-letter__swiper-arrows glossary-letter__swiper-arrows-left swiper-button-prev"
            />
            <div
                class="glossary-letter__swiper-arrows glossary-letter__swiper-arrows-right swiper-button-next"
            />
        </div>
    </div>
    <div class="glossary-list">
        <div class="glossary-list__item">
            {#each glossaryList as [glossaryLetter, glossaryItems], glossaryIndex}
                <div class="glossary-list__title" id={`glossary_${glossaryLetter}`}>
                    {glossaryLetter}
                </div>
                {#each glossaryItems as glossaryItem, itemIndex}
                    <div class="glossary-list__accordion">
                        <div class="glossary-list__accordion-heading">
                            <div class="glossary-list__accordion-title">
                                <a
                                    href={'#'}
                                    class="panel-accordion-link"
                                    data-index={glossaryItem.index}
                                    on:click={(e) => toggleAccordion(e, glossaryIndex, itemIndex)}
                                    aria-expanded={glossaryItem.isOpen}
                                >
                                    {glossaryItem.title}
                                    <span class="glossary-list__arrow icon-master-arrow-up-4" />
                                </a>
                            </div>
                        </div>
                        {#if glossaryItem.isOpen}
                            <div class="glossary-list__accordion-body" transition:slide>
                                {@html glossaryItem.desc}
                            </div>
                        {/if}
                    </div>
                {/each}
            {/each}
        </div>
    </div>
</div>
