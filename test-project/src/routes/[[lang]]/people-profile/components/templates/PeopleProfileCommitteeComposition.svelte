<script lang="ts">
    import type { PeopleProfile } from '$utils/people-profile/types';
    import { getPeopleProfileName } from '$utils/people-profile/ops';
    export let profileList: PeopleProfile[] = [];
</script>

<table class="table table-hover">
    <thead>
        <th />
        <th />
        <th>Compensation Committee</th>
        <th>Nominating &amp;<br /> Governance Committee</th>
        <th>Audit Committee</th>
    </thead>
    <tbody>
        {#each profileList as item}
            <tr>
                <td>
                    {getPeopleProfileName(item)}
                </td>
                {#if item.tags && item.tags.length > 0}
                    <td>
                        {#if item.tags.some((tag) => tag.slug === 'independent_director')}
                            <i class="icon-independent">I</i>
                        {/if}
                    </td>
                    <td>
                        {#if item.tags.some((tag) => tag.slug === 'compensation_committee_chairperson')}
                            <i class="icon-user">C</i>
                        {:else if item.tags.some((tag) => tag.slug === 'compensation_committee_member')}
                            <i class="icon-user-21">M</i>
                        {/if}
                    </td>
                    <td>
                        {#if item.tags.some((tag) => tag.slug === 'nominating_committee_chairperson')}
                            <i class="icon-user">C</i>
                        {:else if item.tags.some((tag) => tag.slug === 'nominating_committee_member')}
                            <i class="icon-user-21">/M</i>
                        {/if}
                    </td>
                    <td>
                        {#if item.tags.some((tag) => tag.slug === 'audit_committee_chairperson')}
                            <i class="icon-user">C</i>
                        {:else if item.tags.some((tag) => tag.slug === 'audit_committee_member')}
                            <i class="icon-user-21">M</i>
                        {/if}
                    </td>
                {:else}
                    <td />
                    <td />
                    <td />
                    <td />
                {/if}
            </tr>
        {/each}
    </tbody>
</table>
<div class="cms__composition-info">
    <div><i class="icon-independent">I</i> = Independent Director</div>
    <div><i class="icon-user">C</i> = Chairperson</div>
    <div><i class="icon-user-21">M</i> = Member</div>
</div>
