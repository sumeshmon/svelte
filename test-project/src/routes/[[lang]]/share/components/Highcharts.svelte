<script lang="ts">
    import { onMount } from 'svelte';
    import { locale, t } from '$lib/translations';
    import type { HighchartsData } from '$utils/share/types';
    import Highcharts from 'highcharts';
    import HighchartsAccessibility from 'highcharts/modules/accessibility';
    HighchartsAccessibility(Highcharts);
    const randomKey = Math.random().toString(36).substring(2, 10);
    let chart: Highcharts.Chart | undefined;
    export let data: HighchartsData;
    export let seriesName: string;
    $: if ($locale) {
        if (chart) {
            chart.update({
                plotOptions: {
                    pie: {
                        dataLabels: {
                            formatter: function () {
                                let y = this.y ?? 0;
                                return (
                                    '<b style="color: #00ccdf; font-size: 12px; font-weight: bold">' +
                                    Highcharts.numberFormat(y, 2, $t('common.decimalSeparator')) +
                                    ' % </b> ' +
                                    this.point.name
                                );
                            }
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    formatter: function () {
                        let y = this.y ?? 0;
                        return (
                            this.point.name +
                            '<br>' +
                            Highcharts.numberFormat(y, 2, $t('common.decimalSeparator')) +
                            '%'
                        );
                    }
                },
                series: [
                    {
                        type: 'pie',
                        name: seriesName,
                        data: data
                    }
                ]
            });
            chart.redraw();
        }
    }
    onMount(() => {
        // Initialize Highcharts chart
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'chart-container-' + randomKey,
                type: 'pie',
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
                plotBackgroundColor: 'none',
                plotBorderWidth: 0,
                plotShadow: false,
                style: {
                    fontSize: '14px',
                    lineHeight: '24px'
                }
            },
            accessibility: {
                enabled: true
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },

            tooltip: {
                enabled: true
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    borderWidth: 6,
                    showInLegend: false,
                    size: 240,
                    innerSize: 200,
                    dataLabels: {
                        enabled: true,
                        connectorColor: 'white',

                        style: {
                            color: '#333333',
                            fontSize: '12px',
                            lineHeight: '12px',
                            fontWeight: 'normal'
                        }
                    },
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            },
            legend: {
                enabled: true,
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical',
                x: 0,
                y: 0,
                borderColor: 'none',
                itemMarginBottom: 15,
                symbolHeight: 20,
                symbolWidth: 20,
                symbolRadius: 0,
                useHTML: true,
                itemStyle: {
                    fontSize: '14px',
                    fontWeight: 'normal'
                },
                itemHoverStyle: {
                    color: '#00ccdf'
                }
            },
            series: [
                {
                    type: 'pie',
                    name: seriesName,
                    data: data
                }
            ]
        });
    });
</script>

<div id="chart-container-{randomKey}" class="shareholder-chart" />
