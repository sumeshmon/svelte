<script lang="ts">
    import type { PeopleProfile } from '$utils/people-profile/types';
    import { getPeopleProfileMeta } from '$utils/people-profile/ops';
    import Modal from '$components/Modal.svelte';
    import Accordion, { createAccordionContext } from '$components/Accordion.svelte';
    createAccordionContext();
    export let peopleProfile: PeopleProfile | null = null;
    let showModal: boolean = false;
    let modalHeading: string = '';
    let modalContent: string = '';
</script>

{#if peopleProfile !== null}
    {#each getPeopleProfileMeta(peopleProfile) as metaValue}
        {#if /accordi[oae]n/i.test(metaValue?.key)}
            <!-- Accordion -->
            <div class="people-profile__accordion">
                <Accordion className="people-profile-accordion">
                    <span slot="title">{metaValue?.name}</span>
                    <div slot="content">
                        {@html metaValue?.value}
                    </div>
                </Accordion>
            </div>
        {:else if /profile_popup/i.test(metaValue?.key)}
            <!-- Modal/Popup -->
            <div class="people-profile__popup">
                <button
                    class="people-profile__popup-button"
                    on:click={() => {
                        showModal = true;
                        modalHeading = metaValue?.name;
                        modalContent = metaValue?.value;
                    }}
                >
                    {metaValue?.name}
                    <i class="people-profile__popup-icon icon-master-expand" />
                </button>
            </div>
        {:else}
            <div class="people-profile__additional">
                {#if metaValue?.name}
                    <h5 class="people-profile__additional-heading">
                        {metaValue.name}
                    </h5>
                {/if}
                {#if metaValue?.value}
                    <div class="people-profile__additional-content">
                        {@html metaValue.value}
                    </div>
                {/if}
            </div>
        {/if}
    {/each}
{/if}
<Modal bind:showModal cssClass="people-profile__modal">
    <h2 slot="header">
        {@html modalHeading}
    </h2>
    <p>
        {@html modalContent}
    </p>
</Modal>
