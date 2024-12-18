<script lang="ts">
    import type { DISCLAIMERS } from '$components/disclaimer/constants';

    import { t } from '$lib/translations';
    import { setDisclaimerToDisagreed } from '$utils/disclaimer';

    export let selectedCountry: string;
    export let disclaimer: DISCLAIMERS;

    setDisclaimerToDisagreed({
        disclaimer,
        persistNoAccess: true
    });
</script>

<div class="disclaimer__no-access">
    {@html $t(`disclaimers.${disclaimer}.${selectedCountry}.no_access_phase.content`) ||
        $t(`disclaimers.${disclaimer}.default.no_access_phase.content`)}
</div>
<!--button class="btn"
	on:click={() => {
		if (!browser) {
			return;
		}
		history.back();
	}}
	>Go Back
</button-->
