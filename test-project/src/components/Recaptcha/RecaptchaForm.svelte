<script lang="ts">
    import type { GoogleRecaptchaConfig } from '$utils/forms/types';
    export let googleRecaptchaConfig: GoogleRecaptchaConfig;
    export let recaptchaSelectorId: string | null = null;
</script>

<div
    data-sitekey={googleRecaptchaConfig.sitekey}
    id={recaptchaSelectorId}
    data-size="invisible"
    data-hl={googleRecaptchaConfig.locale}
/>
