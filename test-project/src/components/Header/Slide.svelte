<script lang="ts">
    export let backgroundImage: string = '';
    export let video: string = '';
    export let autoplay: boolean = true;
    export let loop: boolean = true;
    export let muted: boolean = true;
    export let playsinline: boolean = true;
    export let style: string = '';
    export let className: string = 'ep-slider';

    let youtubeVideo: string = '';
    backgroundImage && (style += 'background-image:url(' + backgroundImage + ')');

    const youtubePattern =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\\s]{11})$/;
    const match = video.match(youtubePattern);
    if (match) {
        youtubeVideo = 'https://www.youtube.com/embed/' + match[1] + '?';
        autoplay && (youtubeVideo += 'autoplay=1&');
        loop && (youtubeVideo += 'loop=1&');
        muted && (youtubeVideo += 'mute=1&');
        playsinline && (youtubeVideo += 'playsinline=1&');
    }
</script>

<div class="{className}__slide swiper-slide {className}" {style}>
    {#if youtubeVideo}
        <div class="{className}__video-youtube-container">
            <iframe
                class="{className}__video-youtube"
                src={youtubeVideo}
                frameborder="0"
                allow="autoplay; fullscreen"
                title=""
                allowfullscreen
            />
        </div>
    {:else if video}
        <div class="{className}__video-container">
            <video
                class="{className}__video"
                {autoplay}
                {loop}
                {muted}
                {playsinline}
                poster={backgroundImage}
            >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    {/if}
    <slot />
</div>
