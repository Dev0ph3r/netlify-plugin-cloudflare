Cloudflare Cache Purge Plugin for Netlify
=========================================

This Netlify plugin allows you to automatically purge Cloudflare's cache for one or more zones after a successful build. It ensures your users always see the latest content without needing manual cache clearing.

* * *
Installation
------------

To install the plugin in your Netlify project, follow these steps:

1.  Navigate to your Netlify project directory.

2.  Install the plugin as a dependency using npm or yarn:

    ```sh
    npm install @dev0ph3r/netlify-plugin-cloudflare
    ```

    or

    ```sh
    yarn add @dev0ph3r/netlify-plugin-cloudflare
    ```

3.  Add the plugin to your `netlify.toml` configuration file:
```
    [[plugins]]
        package = "@dev0ph3r/netlify-plugin-cloudflare"
```


* * *

Configuration
-------------

To use this plugin, you need to configure two environment variables in your Netlify project:

### Required Environment Variables

1.  **CLOUDFLARE\_API\_TOKEN**

    *   A valid API token for accessing Cloudflare's API. [^1]
        [^1]: (How to create an API token in Cloudflare: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)


    *   Ensure the token has permission to purge the cache for the specified zones.

2.  **CLOUDFLARE\_ZONE\_IDS**

    *   A comma-separated list of Cloudflare Zone IDs for which the cache should be purged.

    *   Example: `zone_id_1,zone_id_2,zone_id_3`


### Adding Environment Variables

1.  Navigate to **Site configuration** > **Environment variables** in the Netlify UI.

2.  Add the following variables:

    *   `CLOUDFLARE_API_TOKEN`

    *   `CLOUDFLARE_ZONE_IDS`

3.  Save your changes.


* * *

How It Works
------------

1.  **Pre-Build Validation:**

    *   Before the build starts, the plugin checks if the required environment variables are configured correctly.

    *   If any variable is missing or invalid, the build fails with a descriptive error message.

2.  **Post-Build Cache Purge:**

    *   After a successful build, the plugin triggers a cache purge for each zone specified in `CLOUDFLARE_ZONE_IDS`.

    *   Logs provide details on the success or failure of the purge for each zone.


* * *

Example Logs
------------

### Successful Purge

Cloudflare configuration is valid. 2 zone(s) will be purged.

Triggering Cloudflare cache purge for 2 zone(s).

Cloudflare cache purged successfully for zone zone\_id\_1.

Cloudflare cache purged successfully for zone zone\_id\_2.

Cloudflare cache purged successfully for all zones.

### Failure Example

Cloudflare configuration is valid. 2 zone(s) will be purged.

Triggering Cloudflare cache purge for 2 zone(s).

Cloudflare cache couldn't be purged for zone zone\_id\_1. Status: 403 Forbidden. Details: {"success":false,"errors":\[{"code":10000,"message":"Invalid token"}\]}.

Cache purge failed for 1 zone(s): zone\_id\_1

* * *

Troubleshooting
---------------

1.  **Missing or Invalid API Token:**

    *   Ensure the `CLOUDFLARE_API_TOKEN` environment variable is set and valid.

    *   Verify the token has the required permissions to purge caches.

2.  **Invalid Zone IDs:**

    *   Check that `CLOUDFLARE_ZONE_IDS` contains valid Zone IDs separated by commas.

    *   Ensure the Zone IDs belong to the account associated with the API token.

3.  **Check Logs:**

    *   Use the logs provided during the build and purge process to identify issues.


* * *

License
-------

This plugin is licensed under the MIT License. See the LICENSE file for details.

* * *

Contributions
-------------

Contributions are welcome! Feel free to open an issue or submit a pull request with improvements or fixes.