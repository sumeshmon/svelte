<script lang="ts">
    import Slider from '$components/Header/Slider.svelte';
    import Slide from '$components/Header/Slide.svelte';
    import NewsSlide from '$components/Header/NewsSlide.svelte';
    import Documents from '$routes/documents/components/Documents.svelte';
    import BannerTeaserTemplate from '$routes/documents/components/templates/DocumentsBannerTeaser.svelte';
    export let page: string | null = null;
    export let image: string | null = null;
    export let title: string | null = 'INVESTOR RELATIONS';
</script>

{#if image}
    <div class="banner">
        <Slide backgroundImage={image}>
            <div class="ep-slider__header">
                <h1 class="ep-slider__title">{title}</h1>
            </div>
        </Slide>
    </div>
{:else if page == 'home'}
    <!-- Banner for Home Page -->
    <div class="banner">
        <Slide backgroundImage="https://www.eqs.com/assets/2024/02/Approvals-HeroBanner.jpg">
            <div class="ep-slider__header">
                <h1 class="ep-slider__title">{title}</h1>
            </div>
        </Slide>
    </div>
{:else if page == 'slider-demo'}
    <!-- Slider Demo -->
    <Slider>
        <Slide backgroundImage="https://www.eqs.com/assets/2024/02/Approvals-HeroBanner.jpg">
            <div class="ep-slider__header">
                <h1 class="ep-slider__title">{title}</h1>
            </div>
        </Slide>

        <Slide
            backgroundImage="https://lionemobility.com/assets/2024/01/LION-poster.jpg"
            video="https://lionemobility.com/assets/2024/01/65311c6865cffd1e407b4c70_LION-transcode.mp4"
        >
            <Documents
                itemsPerPage="1"
                years={['2021']}
                categories={['corporate_governance', 'annual_reports', 'presentations']}
                template={BannerTeaserTemplate}
                paginatorType={false}
                notFound=""
            />
        </Slide>
        <Slide backgroundImage="https://www.eqs.com/assets/2024/02/ThirdParties-HeroBanner.jpg">
            <div class="ep-slider__news-image">
                <img
                    src="https://www.eqs.com/assets/2023/01/eqs-group-blog-compliance-website-768x432.jpg"
                    alt=""
                />
            </div>
        </Slide>
        <Slide
            backgroundImage="https://www.eqs.com/assets/2024/02/ThirdParties-HeroBanner.jpg"
            video="https://www.youtube.com/watch?v=6wB5Cc7x_SA"
        >
            <div class="ep-slider__content position-absolute bg-light sticky-top">
                Youtube Video
            </div>
        </Slide>
        <NewsSlide
            backgroundImage="https://www.eqs.com/assets/2024/02/Approvals-HeroBanner.jpg"
            categories={['adhoc']}
            newsOffset="0"
        >
            <div class="ep-slider__news-image w-auto" />
        </NewsSlide>
        <NewsSlide categories={['adhoc']} newsOffset="1">
            <div class="ep-slider__news-image">
                <img
                    src="https://www.eqs.com/assets/2023/12/eqs-blog-cultural-gift-giving.jpg"
                    alt=""
                />
            </div>
        </NewsSlide>
        <NewsSlide categories={['adhoc']} newsOffset="2" />
    </Slider>
{:else}
    <!-- Common Banner -->
    <div class="banner">
        <Slide backgroundImage="https://www.eqs.com/assets/2024/02/ThirdParties-HeroBanner.jpg">
            <div class="ep-slider__header">
                <h1 class="ep-slider__title">{title}</h1>
            </div>
        </Slide>
    </div>
{/if}
