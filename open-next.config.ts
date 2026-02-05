import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({
  // OpenNext will automatically handle prerendered pages
  // Cloudflare Pages will serve them from the assets directory
  // No special configuration needed - default behavior is correct
});