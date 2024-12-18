<script lang="ts">
    export let className: string = '';
</script>

<div class="table-container">
    <table class="{className ? className + ' ' : ''}table">
        <slot name="thead" />
        <slot />
        <slot name="tfoot" />
    </table>
</div>
