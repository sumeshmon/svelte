import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { supportedLocales } from './src/lib/translations/index.js';
import 'dotenv/config';

const basePath = process.env.BASE_PATH || '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter({
            // default options are shown. On some platforms
            // these options are set automatically — see below
            pages: `build${basePath}`,
            assets: `build${basePath}`,
            fallback: 'index.html',
            precompress: false,
            strict: false
        }),
        alias: {
            'scripts/*': './scripts/*',
            'styles/*': './styles/*',
            $components: 'src/components',
            $utils: 'src/utils',
            $api: 'src/api',
            $routes: 'src/routes/[[lang]]/'
        },
        paths: {
            base: basePath,
            relative: false
        },
        prerender: {
            // NOTE: You can modify your exported error pages here.
            entries: supportedLocales.reduce(
                (acc, locale) => [
                    ...acc,
                    `/${locale}`,
                    `/${locale}/401`,
                    `/${locale}/403`,
                    `/${locale}/404`,
                    `/${locale}/500`,
                    `/${locale}/contact`,
                    `/${locale}/contact/alert`,
                    `/${locale}/contact/email`,
                    `/${locale}/contact/event_reminder`,
                    `/${locale}/documents`,
                    `/${locale}/documents/agm`,
                    `/${locale}/events`,
                    `/${locale}/events/box`,
                    `/${locale}/events/filter`,
                    `/${locale}/facts-and-figures`,
                    `/${locale}/people-profile`,
                    `/${locale}/custom-company-data`,
                    `/${locale}/custom-company-contact`,
                    `/${locale}/shareholder`
                ],
                ['*']
            )
        }
    }
};

export default config;
