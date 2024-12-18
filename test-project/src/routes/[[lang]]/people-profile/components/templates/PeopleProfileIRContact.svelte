<script lang="ts">
    import AdditionalInfo from '$routes/people-profile/components/AdditionalInfo.svelte';
    import Modal from '$components/Modal.svelte';
    import type { PeopleProfile } from '$utils/people-profile/types';
    import { handleImageError } from '$utils/ops';
    export let profileList: PeopleProfile[] = [];
    export let showImage: boolean = true;
    let showModal: boolean = false;
    let modalProfile: PeopleProfile | null = null;
</script>

<div class="ir-contact">
    {#each profileList as profile}
        <div class="row">
            {#if showImage}
                <div class="col-12 col-md-4">
                    <div class="ir-contact__image">
                        <img
                            class="ir-contact__image-img"
                            src={profile?.imageUrl || '/images/dummy.jpg'}
                            alt={profile?.name}
                            on:error={(event) => handleImageError(event)}
                        />
                    </div>
                </div>
            {/if}
            <div class="col-12 col-md-8">
                <div class="ir-contact__content">
                    <strong class="ir-contact__name">
                        {profile?.name}
                    </strong>
                    <div class="ir-contact__title">
                        {profile?.title}
                    </div>
                    <ul class="ir-contact__contact">
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
                    <div class="ir-contact__detail">
                        {@html profile?.description}
                    </div>
                    <div class="ir-contact__additional-info">
                        <AdditionalInfo peopleProfile={profile} />
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>
<!-- {#if showModal && modalProfile !== null}
    <Modal bind:showModal cssClass="people-profile__modal">
        <h2 slot="header">
            {@html modalProfile?.name + '<h6>' + modalProfile?.title + '</h6>'}
        </h2>
        <div>
            <ul class="ir-contact__contact">
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
            <div class="ir-contact__detail">
                {@html modalProfile?.description}
            </div>
            <AdditionalInfo peopleProfile={modalProfile} />
        </div>
    </Modal>
{/if} -->
