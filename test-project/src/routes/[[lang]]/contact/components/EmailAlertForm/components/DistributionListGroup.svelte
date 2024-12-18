<script lang="ts" context="module">
    import { locale } from '$lib/translations';
    export type CheckboxOptionType = { name: string; value: string };
    let counter = 0;
</script>

<script lang="ts">
    import { t } from '$lib/translations';
    import type { Validator } from '@eqs/cms-svelte-irtools';
    import { combineValidators } from '@eqs/cms-svelte-irtools';
    import CheckboxInput from '$components/form/components/CheckboxInput.svelte';

    type DlObject = {
        name: string;
        value: string;
        parent: string;
    };

    let generalOptions: Array<DlObject> = [];

    let secFilingsOptions: Array<DlObject> = [];

    let ukRegNewsOptions: Array<DlObject> = [];

    let hkNewsOptions: Array<DlObject> = [];

    export let checkboxGroup: string[] = [];
    export let supportedDist: string[] = [];
    export let error: string | null = null;
    export let validators: Validator[] = [];
    export const validate = async () => {
        try {
            await combineValidators(...validators)('', checkboxGroup);
            error = null;
        } catch (e: unknown) {
            const errorObject = e as Error;
            error = errorObject.message || 'Unknown error';
            throw e;
        }
    };

    const removeChildDLs = (selectedDLs: string[], dls: Array<DlObject>) => {
        const dlMap = new Map(dls.map((dl) => [dl.value, dl]));
        return selectedDLs.filter((dlname) => {
            const dl = dlMap.get(dlname);
            return dl && !selectedDLs.includes(dl.parent);
        });
    };

    const setOptions = () => {
        generalOptions = [
            {
                name: $t('forms.category_list.general.us-press-releases'),
                value: 'us-press-releases',
                parent: ''
            },
            {
                name: $t('forms.category_list.general.events'),
                value: 'events',
                parent: ''
            },
            {
                name: $t('forms.category_list.general.eod-stock-price'),
                value: 'eod-stock-price',
                parent: ''
            },
            {
                name: $t('forms.category_list.general.weekly-stock-price'),
                value: 'weekly-stock-price',
                parent: ''
            },
            {
                name: $t('forms.category_list.general.cockpit-news'),
                value: 'cockpit-news',
                parent: ''
            },
            {
                name: $t('forms.category_list.general.custom-news'),
                value: 'custom-news',
                parent: ''
            }
        ];
        secFilingsOptions = [
            {
                name: $t('forms.category_list.sec_filings.sec_all'),
                value: 'us-sec-filing',
                parent: ''
            },
            {
                name: $t('forms.category_list.sec_filings.annual_report'),
                value: 'us-sec-filing-annual-report',
                parent: 'us-sec-filing'
            },
            {
                name: $t('forms.category_list.sec_filings.proxies'),
                value: 'us-sec-filing-proxies',
                parent: 'us-sec-filing'
            },
            {
                name: $t('forms.category_list.sec_filings.quarterly_reports'),
                value: 'us-sec-filing-quarterly-reports',
                parent: 'us-sec-filing'
            },
            {
                name: $t('forms.category_list.sec_filings.insider_trading'),
                value: 'us-sec-filing-insider-trading',
                parent: 'us-sec-filing'
            },
            {
                name: $t('forms.category_list.sec_filings.8_k'),
                value: 'us-sec-filing-8-k',
                parent: 'us-sec-filing'
            }
        ];
        ukRegNewsOptions = [
            {
                name: $t('forms.category_list.uk_reg_news.uk_reg_news'),
                value: 'uk-reg-news',
                parent: ''
            },
            {
                name: $t(
                    'forms.category_list.uk_reg_news.uk_reg_news_company_announcement_general'
                ),
                value: 'uk-reg-news-company-announcement-general',
                parent: 'uk-reg-news'
            },
            {
                name: $t(
                    'forms.category_list.uk_reg_news.uk_reg_news_mergers_acquisitions_and_disposals'
                ),
                value: 'uk-reg-news-mergers-acquisitions-and-disposals',
                parent: 'uk-reg-news'
            },
            {
                name: $t('forms.category_list.uk_reg_news.uk_reg_news_results_and_trading_reports'),
                value: 'uk-reg-news-results-and-trading-reports',
                parent: 'uk-reg-news'
            },
            {
                name: $t('forms.category_list.uk_reg_news.uk_reg_news_executive_changes'),
                value: 'uk-reg-news-executive-changes',
                parent: 'uk-reg-news'
            },
            {
                name: $t('forms.category_list.uk_reg_news.uk_reg_news_directors_dealings'),
                value: 'uk-reg-news-directors-dealings',
                parent: 'uk-reg-news'
            },
            {
                name: $t('forms.category_list.uk_reg_news.uk_reg_news_advance_notice_of_results'),
                value: 'uk-reg-news-advance-notice-of-results',
                parent: 'uk-reg-news'
            },
            {
                name: $t('forms.category_list.uk_reg_news.uk_reg_news_transaction_in_own_shares'),
                value: 'uk-reg-news-transaction-in-own-shares',
                parent: 'uk-reg-news'
            },
            {
                name: $t('forms.category_list.uk_reg_news.uk_reg_news_holdings_in_company'),
                value: 'uk-reg-news-holding-s-in-company',
                parent: 'uk-reg-news'
            },
            {
                name: $t('forms.category_list.uk_reg_news.uk_reg_news_dividends'),
                value: 'uk-reg-news-dividends',
                parent: 'uk-reg-news'
            }
        ];
        hkNewsOptions = [
            {
                name: $t('forms.category_list.hk_news.hk_news_all'),
                value: 'hk-news',
                parent: ''
            },
            {
                name: $t('forms.category_list.hk_news.hk_news_announcements_circulars'),
                value: 'hk-news-announcements-circulars',
                parent: 'hk-news'
            },
            {
                name: $t('forms.category_list.hk_news.hk_news_financial_reports'),
                value: 'hk-news-financial-reports',
                parent: 'hk-news'
            }
        ];
        supportedDist = [
            ...generalOptions.map((option) => option.value),
            ...secFilingsOptions.map((option) => option.value),
            ...ukRegNewsOptions.map((option) => option.value),
            ...hkNewsOptions.map((option) => option.value)
        ];
    };

    const generateUniqueId = () => {
        counter++;
        return `dls-checkbox-${counter}`;
    };

    $: {
        if ($locale) {
            setOptions();
        }
    }

    $: if (checkboxGroup) {
        checkboxGroup = removeChildDLs(checkboxGroup, [
            ...hkNewsOptions,
            ...ukRegNewsOptions,
            ...secFilingsOptions,
            ...generalOptions
        ]);
    }
</script>

<div class="row">
    <div class="col-sm-12">
        {#if error}
            <p class="error">{error}</p>
        {/if}
    </div>
</div>

<div class="row">
    <div class="col-sm-12">
        <h4>{$t('forms.category_list.general.headline')}</h4>
        {#each generalOptions as general}
            <CheckboxInput
                bind:bindGroup={checkboxGroup}
                label={general.name}
                value={general.value}
                id={generateUniqueId()}
                disabled={checkboxGroup.includes(general.parent)}
                on:change={validate}
            />
        {/each}
    </div>
</div>

<div class="row">
    <div class="col-sm-12">
        <h4>{$t('forms.category_list.sec_filings.headline')}</h4>
        {#each secFilingsOptions as secFilings}
            <CheckboxInput
                bind:bindGroup={checkboxGroup}
                label={secFilings.name}
                value={secFilings.value}
                id={generateUniqueId()}
                disabled={checkboxGroup.includes(secFilings.parent)}
                on:change={validate}
            />
        {/each}
    </div>
</div>

<div class="row">
    <div class="col-sm-12">
        <h4>{$t('forms.category_list.uk_reg_news.headline')}</h4>
        {#each ukRegNewsOptions as ukRegNews}
            <CheckboxInput
                bind:bindGroup={checkboxGroup}
                label={ukRegNews.name}
                value={ukRegNews.value}
                id={generateUniqueId()}
                disabled={checkboxGroup.includes(ukRegNews.parent)}
                on:change={validate}
            />
        {/each}
    </div>
</div>

<div class="form__form-checkboxGroup">
    <div class="row">
        <div class="col-sm-12">
            <h4>{$t('forms.category_list.hk_news.headline')}</h4>
            {#each hkNewsOptions as hkNews}
                <CheckboxInput
                    bind:bindGroup={checkboxGroup}
                    label={hkNews.name}
                    value={hkNews.value}
                    id={generateUniqueId()}
                    disabled={checkboxGroup.includes(hkNews.parent)}
                    on:change={validate}
                />
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    :global(.form__form-group) {
        margin-bottom: 1rem;
        width: 100%;
        display: block;
    }
    :global(.error) {
        color: red;
    }
</style>
