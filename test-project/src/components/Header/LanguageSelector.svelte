<script lang="ts">
    import { t, locale, supportedLocales } from '$lib/translations';
    import { getLocalizedUrl, langCodeFormatter, hideIfLangNotFound } from '$utils/ops';
    import { page } from '$app/stores';
    let hideOnLangs: { redirect: boolean; hideOnLang: string[] };
    $: {
        hideOnLangs = hideIfLangNotFound($page.url);
    }
</script>

<ul class="language-selector">
    {#each supportedLocales as code}
        {#if !hideOnLangs.hideOnLang.includes(code)}
            <li class="language-selector__item" data-lang={code}>
                <a
                    class="language-selector__link {langCodeFormatter($locale) === code
                        ? 'active'
                        : ''}"
                    href={getLocalizedUrl($page.url, code).toString()}
                >
                    {$t(`lang.code.${code}`)}
                </a>
            </li>
        {/if}
    {/each}
</ul>
