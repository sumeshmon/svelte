<script lang="ts">
    import AdditionalInfo from '$routes/people-profile/components/AdditionalInfo.svelte';
    import Modal from '$components/Modal.svelte';
    import type { PeopleProfile } from '$utils/people-profile/types';
    import { getPeopleProfileDetailPageLink } from '$utils/people-profile/ops';
    import Accordion, { createAccordionContext } from '$components/Accordion.svelte';
    createAccordionContext();
    import { locale } from '$lib/translations';
    import { handleImageError } from '$utils/ops';
    export let profileList: PeopleProfile[] = [];
    let showModal: boolean = false;
    let modalProfile: PeopleProfile | null = null;
    const peopleProfileModal = (peopleProfile: PeopleProfile) => {
        showModal = true;
        modalProfile = peopleProfile;
    };
</script>

<div class="people-profile__wrapper">
    {#each profileList as profile}
        <div class="people-profile">
            <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        <div class="people-profile__image">
                            <img
                                src={profile?.imageUrl || '/images/dummy.jpg'}
                                alt={profile?.name}
                                on:error={(event) => handleImageError(event)}
                            />
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="people-profile__content">
                            <h4 class="people-profile__name">
                                {profile?.name}
                            </h4>
                            <div class="people-profile__title">
                                {profile?.title}
                            </div>
                            <ul class="people-profile__contact">
                                {#if profile?.email}
                                    <li class="people-profile__email">
                                        <a
                                            class="people-profile__contact-link people-profile__email--link"
                                            href="mailto:{profile.email}"
                                        >
                                            <i class="icon-master-mail" />
                                            {profile.email}
                                        </a>
                                    </li>
                                {/if}
                                {#if profile?.phone}
                                    <li class="people-profile__phone">
                                        <a
                                            class="people-profile__contact-link people-profile__phone--link"
                                            href="tel:{profile.phone}"
                                        >
                                            <i class="icon-master-phone-3" />
                                            {profile.phone}
                                        </a>
                                    </li>
                                {/if}
                                {#if profile?.link}
                                    <li class="people-profile__website">
                                        <a
                                            class="people-profile__contact-link people-profile__website--link"
                                            href={profile.link}
                                        >
                                            <i class="icon-master-link" />
                                            {profile.link}
                                        </a>
                                    </li>
                                {/if}
                            </ul>
                            <div class="people-profile__detail">
                                {@html profile?.description}
                            </div>
                            <div class="people-profile__additional-info">
                                <AdditionalInfo peopleProfile={profile} />
                            </div>
                            <div class="row">
                                <div class="col-12 col-sm-4">
                                    <!-- Detail page content in popup -->
                                    <div class="people-profile__detail-popup">
                                        <button
                                            class="people-profile__popup-button"
                                            on:click={() => peopleProfileModal(profile)}
                                            >Detail in Popup <i
                                                class="people-profile__popup-icon icon-master-expand"
                                            /></button
                                        >
                                    </div>
                                </div>
                                <div class="col-12 col-sm-4">
                                    <!-- Detail page content in Accordion -->
                                    <div class="people-profile__detail-accordion">
                                        <Accordion className="people-profile-accordion">
                                            <span slot="title"> Detail in Accordion </span>
                                            <div slot="content">
                                                <h4>{profile?.name}</h4>
                                                <h6>{profile?.title}</h6>
                                                <ul class="people-profile__contact">
                                                    {#if profile?.email}
                                                        <li class="people-profile__email">
                                                            <a
                                                                class="people-profile__contact-link people-profile__email--link"
                                                                href="mailto:{profile.email}"
                                                            >
                                                                <i class="icon-master-mail" />
                                                                {profile.email}
                                                            </a>
                                                        </li>
                                                    {/if}
                                                    {#if profile?.phone}
                                                        <li class="people-profile__phone">
                                                            <a
                                                                class="people-profile__contact-link people-profile__phone--link"
                                                                href="tel:{profile.phone}"
                                                            >
                                                                <i class="icon-master-phone-3" />
                                                                {profile.phone}
                                                            </a>
                                                        </li>
                                                    {/if}
                                                    {#if profile?.link}
                                                        <li class="people-profile__website">
                                                            <a
                                                                class="people-profile__contact-link people-profile__website--link"
                                                                href={profile.link}
                                                            >
                                                                <i class="icon-master-link" />
                                                                {profile.link}
                                                            </a>
                                                        </li>
                                                    {/if}
                                                </ul>
                                                <div class="people-profile__detail">
                                                    {@html profile?.description}
                                                </div>
                                                <AdditionalInfo peopleProfile={profile} />
                                            </div>
                                        </Accordion>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-4 float-right text-right">
                                    <!-- Detail page link -->
                                    <div class="people-profile__link">
                                        <a href={getPeopleProfileDetailPageLink(profile, $locale)}>
                                            <i class="icon-master-arrow-right-7" /> Detail page Link
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>
{#if showModal && modalProfile !== null}
    <Modal bind:showModal cssClass="people-profile__modal">
        <h2 slot="header">
            {@html modalProfile?.name + '<h6>' + modalProfile?.title + '</h6>'}
        </h2>
        <div>
            <ul class="people-profile__contact">
                {#if modalProfile?.email}
                    <li class="people-profile__email">
                        <a
                            class="people-profile__contact-link people-profile__email--link"
                            href="mailto:{modalProfile.email}"
                        >
                            <i class="icon-master-mail" />
                            {modalProfile.email}
                        </a>
                    </li>
                {/if}
                {#if modalProfile?.phone}
                    <li class="people-profile__phone">
                        <a
                            class="people-profile__contact-link people-profile__phone--link"
                            href="tel:{modalProfile.phone}"
                        >
                            <i class="icon-master-phone-3" />
                            {modalProfile.phone}
                        </a>
                    </li>
                {/if}
                {#if modalProfile?.link}
                    <li class="people-profile__website">
                        <a
                            class="people-profile__contact-link people-profile__website--link"
                            href={modalProfile.link}
                        >
                            <i class="icon-master-link" />
                            {modalProfile.link}
                        </a>
                    </li>
                {/if}
            </ul>
            <div class="people-profile__detail">
                {@html modalProfile?.description}
            </div>
            <AdditionalInfo peopleProfile={modalProfile} />
        </div>
    </Modal>
{/if}
