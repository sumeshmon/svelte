## Developing (Use node version 18)

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
#to load env files
npm run config:env

npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deploying

````

It has different env files for different environment. Names of these env files are like this, ` .env.<NODE_ENV>`

Here `<NODE_ENV>` can be anything like `local`, `stage` or `production`. Currently, `.env.local` is for local environment, `.env.production` is for production environment and `.env.staging` is for staging environment. You can control them by setting `NODE_ENV` environment variable before building for running this. e.g

``` bash
NODE_ENV=production npm run build # build with proudction environemnt (Connected production tool - https://tools.cms-eqs.com)
NODE_ENV=staging npm run build # build with proudction environemnt (Connected dev tool - https://portal-cms.eqs.dev)
NODE_ENV=local npm run build # build with local environemnt

Note: Inside config folder, .env.production is using public data and .env.production_preview is using preview data from CMS api endpoints. (Only difference for now is the JWT keys)
````

**NOTE**: default value of `NODE_ENV` is local. So, if `NODE_ENV is not setup`, it will fallback to local.

## Handling env

https://kit.svelte.dev/docs/modules#$env-static-public

## HowTo

### Storage filter

MyComponentList.svelte:

```
<script lang="ts">
...

/* Storage functions */
    import { saveSnapshot, restoreSnapshot } from '$utils/component-states/state-storage';
    import { generateMD5Hash } from '$utils/component-states/hash';
    import { page } from '$app/stores';

    // this will create a hash out of used variables and url to have unique hashs to use as an id for your component
    let md5Hash = generateMD5Hash(
      $page.url.pathname,
      {
          // here you should add some variables which are used by you component
          itemsPerPage,
          years,
          categories,
          template,
          groupBy,
          yearSelector,
          noOfYears,
          categorySelector,
          fiscalYearEndMD,
          fiscalYearBeginMD,
          archiveTill,
          showAllYears,
          showAllCategory,
          archive,
          activeYear,
          timeline
      }
    );

    // this key is the unique identifier of your rendered component
    let eventListStoreKey = 'eventListStore-' + md5Hash;

    onMount(() => {

        // this will restore the stored variables
        let eventListStore = restoreSnapshot(eventListStoreKey);

        if (eventListStore) {
            // and assign it if it is included in eventListStore
            selectedCategory = eventListStore.selectedCategory || selectedCategory;
            years[0] = eventListStore.selectedYear || years[0];
            search = eventListStore.search || search;
            timeline = eventListStore.timeline || timeline;
        }

        // if you leave the page it will store current values of your variables
        return () => {
            saveSnapshot(eventListStoreKey, {
                selectedCategory: selectedCategory,
                selectedYear: years[0],
                timeline: timeline,
                search: search,
            });
        }
    });
    /* Storage functions */

...
</script>
```

### Add Language Codes with '-'

```
example lang code :zh-hans

in src/lib/translations

create a folder zh-hans

in src/lib/translations/index.js

in import section import like this
import zhHansRoutes from './zh-hans/routes.json' assert { type: 'json' };

in supportedLocales
export const supportedLocales = ['en', 'de' , 'zh-hans'];

in ROUTES_STATIC_TRANSLATIONS make sure the lang code added with quotes

export const ROUTES_STATIC_TRANSLATIONS = {
    en: enRoutes,
    de: deRoutes,
    'zh-hans': zhHansRoutes
};

and add this lang codes in  src/lib/translations/[lang codes]/lang.json

And when we call the dateformats make sure to use lang codes are same as in
https://gitlab.eqs.tools/investor-relations/ir-products/cms/api/airport-access/-/blob/master/config/airport_languages.yaml?ref_type=heads

{
                          en: {
                              year: 'numeric-',
                              month: '2-digit-',
                              day: '2-digit'
                          },
                          de: {
                              year: 'numeric-',
                              month: '2-digit-',
                              day: '2-digit'
                          },
                          'zh-Hans': {
                              year: 'numeric-',
                              month: '2-digit-',
                              day: '2-digit'
                          }
                      }

```

### Run 'Live Edit' in local

MR: https://gitlab.eqs.tools/investor-relations/ir-products/cms/websites/mastertemplate/-/merge_requests/263/diffs

```bash
npm run test-live-edit

Open http://localhost:3900/

```

### Instructions for Enforcing a Trailing Slash '-'

1.Set Environment Variable: Add `PUBLIC_TRAILING_SLASH=true` to env.global to enable the trailing slash functionality across your application.

2.Add `export const trailingSlash = 'always';` to src/routes/+layout.js

3.Update hooks.js: Add the following conditional logic above the translatedPath definition in hooks.js.

MR:https://gitlab.eqs.tools/investor-relations/ir-products/cms/websites/the-platform-group/-/commit/ca21b085139b71bef2763f75295a386823958931

```
 if (PUBLIC_TRAILING_SLASH === 'true' && !path.endsWith('/')) {
            path = `${path}/`;
        }
        const translatedPath = getPathTranslation(path, locale);
```
