import fs from 'fs-extra';
import path from 'path';
import type { Plugin, ResolvedConfig } from 'vite';

/**
 * this plugin copies files to the root build
 * folder. This works only when base path is set.
 *
 * Because when base path is set the whole build
 * goes under the sub folder in "build" folder
 * (e.g "build/investor-relations" when base
 * path is /investor-relations). But we
 * need some files only under the "build" folder.
 *
 * when base path is not set the whole build is under
 * "build" folder then there is no need and this plugin
 * will not do anything in this case.
 * @returns
 */
export function copyFilesToRootBuildPlugin(): Plugin {
    let enabled = false;
    let publicDir = '';
    let rootDir = '';
    let buildDir = '';

    return {
        name: 'copy-files-to-root-build',
        configResolved(config: ResolvedConfig) {
            enabled = !!(config.base && config.base !== '/');
            publicDir = config.publicDir;
            rootDir = config.root;
            buildDir = path.resolve(rootDir, 'build');
        },
        closeBundle: {
            handler: async function () {
                if (!enabled) {
                    console.log(
                        'Skipping file copy to root build folder: base path not set or empty so there is no need to copy'
                    );
                    return;
                }

                const filesToCopy = [
                    path.join(publicDir, 'headers.json'),
                    path.join(publicDir, 'robots.txt'),
                    path.join(publicDir, 'sitemap.xml')
                    // Add more files as needed
                ];

                for (const file of filesToCopy) {
                    try {
                        const fileName = path.basename(file);
                        const destPath = path.join(buildDir, fileName);
                        await fs.copy(file, destPath);
                        console.log(`Copied ${fileName} to build directory`);
                    } catch (error: any) {
                        console.error(`Failed to copy ${file}: ${error?.message}`);
                    }
                }
            },
            order: 'post' as const,
            sequential: true
        }
    };
}
