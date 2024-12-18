import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import sassGlobImports from 'vite-plugin-sass-glob-import';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { copyFilesToRootBuildPlugin } from './copyFilesToRootBuildPlugin';

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
    /** @type import('vite').UserConfig */
    let config = {
        plugins: [
            sveltekit(),
            // to import scss files from directories with path resolver
            sassGlobImports(),
            copyFilesToRootBuildPlugin()
        ],
        resolve: {
            alias: [
                {
                    // this is required for the SCSS modules
                    find: /^~(.*)$/,
                    replacement: '$1'
                }
            ]
        },
        test: {
            include: ['src/**/*.{test,spec}.{js,ts}']
        }
    };

    const env = loadEnv(mode, process.cwd(), '');

    let copyStaticTargetsScripts = [{ src: 'node_modules/@eqs/dflip-lib/*', dest: 'dearflip' }];

    if (
        (command !== 'serve' && env?.NODE_ENV === 'production_preview') ||
        env?.LOCAL_LIVE_EDIT === '1'
    ) {
        copyStaticTargetsScripts.push({
            src: 'node_modules/@eqs/ckeditor-lib/*',
            dest: 'ckeditor'
        });
    }
    config.plugins?.push(
        viteStaticCopy({
            targets: copyStaticTargetsScripts
        })
    );

    if (command === 'serve') {
        // ONLY FOR LOCAL DEVELOPMENT
        const env = loadEnv(mode, process.cwd(), '');
        const TOOL_ENDPOINT = JSON.parse(JSON.stringify(env.LOCAL_TOOL_ENDPOINT));
        const MEDIA_ENDPOINT = JSON.parse(JSON.stringify(env.LOCAL_MEDIA_ENDPOINT));
        const TOOL_HOST = JSON.parse(JSON.stringify(env.LOCAL_WEBSITE_HOST));
        config['server'] = {
            proxy: {
                '/disclaimer/postal-code': {
                    target: `${TOOL_ENDPOINT}/tools/ir-website`,
                    changeOrigin: true,
                    secure: false,
                    configure: (proxy, _options) => {
                        proxy.on('proxyReq', (proxyReq, _req, _res, _options) => {
                            proxyReq.setHeader('x-forwarded-host', 'localhost');
                            proxyReq.setHeader('ir-website-client-host', TOOL_HOST);
                        });
                    }
                },
                '/media/': {
                    target: `${MEDIA_ENDPOINT}/`,
                    changeOrigin: true,
                    secure: false,
                    configure: (proxy, _options) => {
                        proxy.on('proxyReq', (proxyReq, _req, _res, _options) => {
                            proxyReq.setHeader('accept', 'application/json');
                            proxyReq.setHeader('x-forwarded-host', 'localhost');
                            proxyReq.setHeader('ir-website-client-host', TOOL_HOST);
                        });
                    }
                }
            }
        };
    }

    return config;
});
