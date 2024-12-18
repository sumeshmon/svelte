<script lang="ts">
  import { PUBLIC_APP_ENV, PUBLIC_ETRACKER_ANALYTICS_ID } from '$env/static/public';

</script>

<svelte:head>
  {#if PUBLIC_APP_ENV === 'production' && PUBLIC_ETRACKER_ANALYTICS_ID !== ''}
    {@html `<!-– Copyright (c) 2000-2021 etracker GmbH. All rights reserved. –->
            <!-– This material may not be reproduced, displayed, modified or distributed –->
            <!-– without the express prior written permission of the copyright holder. –->
            <!-– etracker tracklet 5.0 –->
            <script type="text/javascript">
            // var et_pagename = "";
            // var et_areas = "";
            // var et_tval = 0;
            // var et_tsale = 0;
            // var et_tonr = "";
            // var et_basket = "";
            </script>
            <script id="_etLoader" type="text/javascript" charset="UTF-8" data-block-cookies="true"
            data-respect-dnt="true" data-secure-code="${PUBLIC_ETRACKER_ANALYTICS_ID}"
            src="//code.etracker.com/code/e.js" async></script>
            <!-– etracker tracklet 5.0 end –->`
    }
  {/if}
</svelte:head>