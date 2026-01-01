import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'cloudflare-node',
    },
  },
};

export default defineCloudflareConfig({
  /*
   * The incremental cache handler is used to store cached data in the KV namespace.
   * You can enable it by un-commenting the following line.
   */
  // incrementalCache: "dummy", 
});