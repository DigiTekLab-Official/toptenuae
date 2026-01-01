import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  /*
   * The incremental cache handler is used to store cached data in the KV namespace.
   * You can enable it by un-commenting the following line.
   */
  // incrementalCache: "dummy", 
});