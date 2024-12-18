<script lang="ts">
    import Faq from './components/Faq.svelte';
    import FactsFigures from './components/FactsFigures.svelte';
    import KeyFigures from './components/KeyFigures.svelte';
    import { t } from '$lib/translations';
    import Banner from '$components/Header/Banner.svelte';
    import Breadcrumb from '$components/Header/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import FactsFiguresFilter from '$routes/facts-and-figures/components/templates/FactsFiguresFilter.svelte';
    export let template: typeof FactsFiguresFilter = FactsFiguresFilter;
</script>

<svelte:head>
    <title>{$t('head.factsFigures.title')}</title>
    <meta name="description" content={$t('head.factsFigures.meta.description')} />
    <meta name="robots" content="index, follow" />
</svelte:head>
<div class="page">
    <Banner title={$t('head.factsFigures.title')} />
    <Breadcrumb path={$page.url.pathname} />
    <div class="page__content">
        <div class="container">
            <h1>{$t('facts.factsFiguresTitle')}</h1>
            <section>
                <h2>{$t('facts.figuresCounter')} (Run counter Once)</h2>
                <!-- Example 1: Run the increment counter once when element comes into view as the user scrolls the page. -->
                <KeyFigures
                    once={true}
                    figureMinColumn={0}
                    figureMaxColumn={1}
                    symbolColumn={2}
                    titleColumn={3}
                    labelColumn={4}
                    fractionDigits={[2, 0, 0, 1]}
                    notFound={$t('facts.noFactsFigures')}
                />
            </section>
            <!-- Example 2: Run the increment counter every time element comes into view as the user scrolls the page. -->
            <!--h2>{$t('facts.figuresCounter')}</h2>
			<KeyFigures
				slug="counter_landing_page_zur_rose"
				figureMinColumn={0}
				figureMaxColumn={1}
				symbolColumn={2}
				titleColumn={3}
				labelColumn={4}
				notFound={$t('facts.noFactsFigures')}
			/-->
            <section>
                <h2>{$t('facts.figuresCounter')}</h2>
                <KeyFigures
                    slug="counter_value"
                    figureMaxColumn={0}
                    titleColumn={1}
                    fractionDigits={[0, 0, 0]}
                    notFound={$t('facts.noFactsFigures')}
                />
            </section>
            <section>
                <h2>With Images</h2>
                <KeyFigures
                    slug="figures_with_image_mastertemplate"
                    noCounter={true}
                    figureMaxColumn={1}
                    titleColumn={2}
                    labelColumn={3}
                    imageColumn={0}
                    skipColumns={[0]}
                />
            </section>
            <section>
                <h2>With Images and Counter</h2>
                <KeyFigures
                    slug="figures_with_image_mastertemplate"
                    once={true}
                    figureMaxColumn={1}
                    titleColumn={2}
                    labelColumn={3}
                    imageColumn={0}
                    fractionDigits={[0, 1, 0, 2, 1, 0, 1, 0, 0, 0]}
                />
            </section>
            <!--KeyFigures slug="key_figures_landing_page_olb"  figureMaxColumn={0} titleColumn={1}  duration={5000}  />
				<KeyFigures slug="key_figures_landing_page_hornbach" noCounter={true} figureMaxColumn={0} titleColumn={1} labelColumn={2}  />
				<KeyFigures slug="key_figures" once={true} figureMinColumn={0} figureMaxColumn={1} symbolColumn={2} titleColumn={3} labelColumn={4}  />
				<KeyFigures slug="counter_value"  figureMaxColumn={0} titleColumn={1} />
				<KeyFigures slug="figures_with_image_mastertemplate" once={true} figureMaxColumn={1} titleColumn={2} labelColumn={3} imageColumn={0}/ -->
            <section>
                <h2>{$t('facts.faqTitle')}</h2>
                <!-- Slug is optional and defaults to 'faq' if not provided -->
                <Faq slug="faq" notFound={$t('facts.noFaq')} />
            </section>
            <section>
                <h2>{$t('facts.analystTitle')}</h2>
                <FactsFigures slug="analyst" notFound={$t('facts.noFactsFigures')} />
            </section>
            <section>
                <h2>{$t('facts.dividendsTitle')}</h2>
                <FactsFigures slug="dividens2" notFound={$t('facts.noFactsFigures')} />
            </section>
            <section>
                <h2>{$t('facts.dividendsTitleFilter')}</h2>
                <FactsFigures
                    {template}
                    slug="dividends_history"
                    filterColumn="Ex-Date"
                    notFound={$t('facts.noFactsFigures')}
                />
            </section>
        </div>
    </div>
</div>
