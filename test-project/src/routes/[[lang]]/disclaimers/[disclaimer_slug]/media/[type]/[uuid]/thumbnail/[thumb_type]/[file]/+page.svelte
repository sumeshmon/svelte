<script lang="ts">
    import {
        DISCLAIMER_QUERY,
        DISCLAIMER_STORAGE_KEY,
        disclaimerStore,
        isDisclaimerAgreed,
        setDisclaimerToAgreed,
        tokenGenerater
    } from '$utils/disclaimer';
    import { DISCLAIMER_TO_COMPONENT_MAP, DISCLAIMERS } from '$components/disclaimer/constants';
    import { generateMediaUrl, openLinkInSameTab } from '$utils/ops';
    import Banner from '$components/Header/Banner.svelte';
    import type { DocumentThumbnailsKeys, DocumentThumbnails } from '$utils/documents/types';
    import { PUBLIC_PAGE_NOT_FOUND } from '$env/static/public';
    import { goto } from '$app/navigation';
    import Loader from '$components/Loader.svelte';
    import { page } from '$app/stores';
    import { saveDisclaimerToStorage } from '$utils/disclaimer-storage';
    import { onDestroy } from 'svelte';

    export let data: {
        item: {
            disclaimer: DISCLAIMERS;
            id: string;
            thumbnails: DocumentThumbnails;
        };
        thumbType: DocumentThumbnailsKeys;
    };

    let { disclaimer, thumbnails } = data.item;
    let link: string | null = null;

    if (data.thumbType in thumbnails) {
        link = generateMediaUrl(thumbnails[data.thumbType].url);
    }

    if (!link) {
        goto(`/${PUBLIC_PAGE_NOT_FOUND}`);
    }

    let loader: boolean = true;
    let isAgree: boolean | null = null;
    const persistNoAccess: boolean = false;
    const DisclaimerComponent = DISCLAIMER_TO_COMPONENT_MAP[disclaimer];
    const urlParams = new URLSearchParams($page.url.searchParams);
    const isDiscMediaTokenFound = $page.url.searchParams.has(DISCLAIMER_QUERY);

    let showDisclaimer = false;

    if (!urlParams.has('disposition')) {
        urlParams.set('disposition', 'inline');
    }

    const unSubscribeDisclaimerStore = disclaimerStore.subscribe((v) => {
        saveDisclaimerToStorage(DISCLAIMER_STORAGE_KEY, v);
    });

    const handleAgree = async () => {
        setDisclaimerToAgreed({ disclaimer });
        loader = true;
        if (link) {
            urlParams.set(DISCLAIMER_QUERY, tokenGenerater(disclaimer));
            openLinkInSameTab(link, urlParams);
            loader = false;
        }
    };

    if (isDisclaimerAgreed({ disclaimer })) {
        isAgree = true;
        showDisclaimer = false;
        urlParams.set(DISCLAIMER_QUERY, tokenGenerater(disclaimer));
    } else {
        showDisclaimer = true;
    }

    if (isDiscMediaTokenFound) {
        isAgree = true;
    }

    loader = (disclaimer && !showDisclaimer) || isDiscMediaTokenFound;
    $: if (isAgree || !disclaimer || isDiscMediaTokenFound) {
        link && openLinkInSameTab(link, urlParams);
        loader = false;
    }
    onDestroy(() => unSubscribeDisclaimerStore());
</script>

<div class="page disclaimer">
    <Banner />
    <div class="page__content">
        <div class="container">
            <Loader {loader} animation={true}>
                {#if !isAgree}
                    <DisclaimerComponent {persistNoAccess} on:agree={() => handleAgree()} />
                {:else}
                    Your dowload will start now. Please <a
                        href={$page.url.toString()}
                        on:click={() => {
                            link && openLinkInSameTab(link, urlParams);
                        }}>click here</a
                    > if it failed.
                {/if}
            </Loader>
        </div>
    </div>
</div>
