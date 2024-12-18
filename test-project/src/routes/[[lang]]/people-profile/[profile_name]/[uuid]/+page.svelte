<script lang="ts">
    import Banner from '$components/Header/Banner.svelte';
    import AdditionalInfo from '$routes/people-profile/components/AdditionalInfo.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { handleImageError } from '$utils/ops';
    import { page } from '$app/stores';
    import { locale, t } from '$lib/translations';
    import { getPeopleProfileDetailPageLink } from '$utils/people-profile/ops.js';
    import { goto } from '$app/navigation';
    export let data: any;

    $: {
        // force the correct translation of url
        const localizedPath = getPeopleProfileDetailPageLink(data.peopleProfile, $locale);
        if (localizedPath !== $page.url.pathname) {
            goto(localizedPath);
        }
    }
</script>

<svelte:head>
    {#if data?.peopleProfile?.name}
        <title>{data.peopleProfile.name}</title>
        <meta name="description" content={data?.peopleProfile?.description} />
    {/if}
    <meta name="robots" content="index, follow" />
</svelte:head>
<div class="page">
    <Banner title={$t('head.peopleProfile.title')} />
    <Breadcrumb path={$page.url.pathname} title={data?.peopleProfile?.name} />
    <div class="container">
        {#await data}
            <p>Loading...</p>
        {:then data}
            <section>
                <div class="people-profile__detail">
                    <div class="row">
                        <div class="col col-3">
                            <div class="people-profile__detail-image">
                                <img
                                    src={data?.peopleProfile?.imageUrl
                                        ? data.peopleProfile.imageUrl
                                        : '/images/dummy.jpg'}
                                    alt={data?.peopleProfile?.name}
                                    on:error={(event) => handleImageError(event)}
                                />
                            </div>
                        </div>
                        <div class="col col-9">
                            {#if data?.peopleProfile?.name}
                                <h2 class="people-profile__detail-name">
                                    {data.peopleProfile.name}
                                </h2>
                            {/if}
                            <div class="people-profile__title mb-3">
                                {data?.peopleProfile?.title}
                            </div>
                            <ul class="people-profile__contact">
                                {#if data?.peopleProfile?.email}
                                    <li class="people-profile__email">
                                        <a
                                            class="people-profile__contact-link people-profile__email--link"
                                            href="mailto:{data.peopleProfile.email}"
                                        >
                                            <i class="icon-master-mail" />
                                            {data.peopleProfile.email}
                                        </a>
                                    </li>
                                {/if}
                                {#if data?.peopleProfile?.phone}
                                    <li class="people-profile__phone">
                                        <a
                                            class="people-profile__contact-link people-profile__phone--link"
                                            href="tel:{data.peopleProfile.phone}"
                                        >
                                            <i class="icon-master-phone-3" />
                                            {data.peopleProfile.phone}
                                        </a>
                                    </li>
                                {/if}
                                {#if data?.peopleProfile?.link}
                                    <li class="people-profile__website">
                                        <a
                                            class="people-profile__contact-link people-profile__website--link"
                                            href={data.peopleProfile.link}
                                        >
                                            <i class="icon-master-link" />
                                            {data.peopleProfile.link}
                                        </a>
                                    </li>
                                {/if}
                            </ul>
                            {#if data?.peopleProfile?.description}
                                <div class="people-profile__detail-description">
                                    {@html data.peopleProfile.description}
                                </div>
                            {/if}
                            <div class="people-profile__detail-info">
                                <AdditionalInfo peopleProfile={data?.peopleProfile} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        {/await}
    </div>
</div>
