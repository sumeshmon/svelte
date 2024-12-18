<script lang="ts">
    import { t } from '$lib/translations';
    function goBack() {
        window.history.back();
    }
</script>

<button on:click={goBack}>{$t('common.goBack')}</button>
