const {CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_IDS} = process.env;

module.exports = {
  onPreBuild: async ({utils}) => {
    if (!CLOUDFLARE_API_TOKEN) {
      utils.build.failBuild(
        'CLOUDFLARE_API_TOKEN is missing. Please provide a valid API token.',
      );
    }

    if (!CLOUDFLARE_ZONE_IDS) {
      utils.build.failBuild(
        'CLOUDFLARE_ZONE_IDS is missing. Please provide at least one zone ID.',
      );
    }

    const zoneIds = CLOUDFLARE_ZONE_IDS.split(',').map(zoneId =>
      zoneId.trim(),
    );
    if (
      zoneIds.length === 0 ||
      zoneIds.some(zoneId => !zoneId)
    ) {
      utils.build.failBuild(
        'CLOUDFLARE_ZONE_IDS is invalid. Ensure it contains valid zone IDs separated by commas.',
      );
    }

    console.log(
      `Cloudflare configuration is valid. ${zoneIds.length} zone(s) will be purged.`,
    );
  },

  onSuccess: async () => {
    const zoneIds = CLOUDFLARE_ZONE_IDS.split(',').map(zoneId =>
      zoneId.trim(),
    );
    const headers = {
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({purge_everything: true});

    console.log(
      `Triggering Cloudflare cache purge for ${zoneIds.length} zone(s).`,
    );

    try {
      const results = await Promise.all(
        zoneIds.map(async zoneId => {
          const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`;
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers,
              body,
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(
                `Cloudflare cache couldn't be purged for zone ${zoneId}. Status: ${response.status} ${response.statusText}. Details: ${errorText}`,
              );
              return {zoneId, success: false};
            }

            console.log(
              `Cloudflare cache purged successfully for zone ${zoneId}.`,
            );
            return {zoneId, success: true};
          } catch (error) {
            console.error(
              `Failed to purge cache for zone ${zoneId}: ${error.message}`,
            );
            return {zoneId, success: false};
          }
        }),
      );

      const failedZones = results.filter(
        result => !result.success,
      );
      if (failedZones.length > 0) {
        console.error(
          `Cache purge failed for ${failedZones.length} zone(s): ${failedZones
            .map(zone => zone.zoneId)
            .join(', ')}`,
        );
      } else {
        console.log(
          'Cloudflare cache purged successfully for all zones.',
        );
      }
    } catch (error) {
      console.error(
        'An unexpected error occurred during cache purge.',
        error,
      );
    }
  },
};
