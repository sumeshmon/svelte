<script lang="ts">
    import html2pdf from 'html2pdf.js';
    import { t } from '$lib/translations';
    import Pdf from '$lib/templates/Pdf.svelte';
    import type { SvelteComponent } from 'svelte';
    import { PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX } from '$env/static/public';
    import { joinUrlPath, sendGet } from '@eqs/cms-svelte-irtools';

    export let id: string;
    export let item: string;
    export let disposition: string | null = null;
    export let template: typeof Pdf = Pdf;
    let loader = false;

    const generatePdf = async (id: string, itemId: string, disposition: any) => {
        if (loader) {
            return;
        }

        loader = true;

        const url = new URL(
            joinUrlPath(PUBLIC_API_ENDPOINT, PUBLIC_API_PREFIX, 'content/generalized_news/', itemId)
        );

        const response = await sendGet(url, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status !== 200) {
            return;
        }

        let itemAsJson = await response.json();

        let { html, destroy } = mountComponent(template, { itemData: itemAsJson });

        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');

        // destroy component
        destroy();

        // append the hidden container to fetch the news detail into it
        const element = document.createElement('div');
        element.id = id;
        element.className = 'page news-detail';
        element.style.display = 'none';
        document.body.appendChild(element);

        if (element) {
            element.innerHTML = doc.documentElement.innerHTML;

            let elementsToShow = Array.from(element.querySelectorAll('.show-element-for-pdf'));
            elementsToShow.forEach((el: any) => {
                el.style.display = 'block';
            });

            let elementsToHide = Array.from(element.querySelectorAll('.hide-element-for-pdf'));
            elementsToHide.forEach((el: any) => {
                el.style.display = 'none';
            });
        }

        let opt = {
            margin: 1,
            filename: itemId + '.pdf',
            image: { type: 'jpeg', quality: 0.8 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' }
        };

        try {
            if (disposition === 'inline') {
                html2pdf()
                    .set(opt)
                    .from(element.firstChild)
                    .toPdf()
                    .output('blob')
                    .then(function (pdfBlob: Blob) {
                        const blobUrl = URL.createObjectURL(pdfBlob);
                        const pdfWindow = window.open('', '_blank');

                        if (pdfWindow) {
                            const favicon = document
                                .querySelector("link[rel*='icon']")
                                ?.getAttribute('href');
                            pdfWindow.document.write(`
                            <html>
                              <head>
                                <title>PDF Document</title>
                              </head>
                              <body>
                                <iframe src="${blobUrl}" width="100%" height="100%" style="border: none;"></iframe>
                              </body>
                            </html>
                          `);

                            // close to manipulate favicon header
                            pdfWindow.document.close();
                            // timeout needed to render it
                            setTimeout(() => {
                                if (favicon) {
                                    const link = pdfWindow.document.createElement('link');
                                    link.rel = 'icon';
                                    link.href = favicon;
                                    pdfWindow.document.head.appendChild(link);
                                }
                            }, 100);
                        }
                    });
            } else {
                await html2pdf().set(opt).from(element.firstChild).save();
            }

            // remove hidden container
            let hiddenDetailContainer = document.getElementById(id);
            if (hiddenDetailContainer && hiddenDetailContainer.parentNode) {
                hiddenDetailContainer.parentNode.removeChild(hiddenDetailContainer);
            }
            loader = false;
        } catch (error) {
            console.error('Error creating pdf:', error);
        }
    };

    function mountComponent(Component: new (...args: any[]) => SvelteComponent, props: object) {
        const target = document.createElement('div');
        const component = new Component({ target, props });
        const html = target.innerHTML;
        return {
            html,
            destroy: () => component.$destroy()
        };
    }
</script>

{#if id}
    <div class="hide-element-for-pdf pdf-export-button">
        <button on:click={() => generatePdf(id, item, disposition)}>
            <div>
                {#if !loader}
                    {$t('pdf.download_list')}
                {:else}
                    {$t('common.loading')}
                {/if}
            </div>
        </button>
    </div>
{:else}
    <slot />
{/if}
