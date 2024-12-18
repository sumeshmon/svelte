<script lang="ts">
  import { PUBLIC_APP_ENV, PUBLIC_GOOGLE_ANALYTICS_ID } from '$env/static/public';

  $: {
    if (typeof gtag !== 'undefined') {
      gtag('config', `${PUBLIC_GOOGLE_ANALYTICS_ID}`, {

      })
    }
  }
</script>

<svelte:head>
  {#if PUBLIC_APP_ENV === 'production' && PUBLIC_GOOGLE_ANALYTICS_ID !== ''}
    {@html `<script async
          src="//www.googletagmanager.com/gtag/js?id=${PUBLIC_GOOGLE_ANALYTICS_ID}">
            </script>
            <script>
              window.dataLayer = window.dataLayer || []

              function gtag() {
            let dataLayer;
                dataLayer.push(arguments)
              }

              gtag('js', new Date())
              gtag('config', '${PUBLIC_GOOGLE_ANALYTICS_ID}')
            </script>`
    }
  {/if}
</svelte:head>