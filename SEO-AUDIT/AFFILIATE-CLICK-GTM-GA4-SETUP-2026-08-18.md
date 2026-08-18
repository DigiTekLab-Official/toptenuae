# Affiliate Click GTM + GA4 Setup — 18 August 2026

## What the site sends

The website pushes one `affiliate_click` object to `window.dataLayer` for a user click on an `amazon.ae` or `amzn.to` link. It does not delay navigation and contains no personal information.

```js
{
  event: 'affiliate_click',
  affiliate_network: 'amazon_ae',
  page_path: '/top-ten/best-electric-shaver-uae',
  affiliate_product: 'Braun Series 9 PRO+ Electric Shaver with SmartCare Center',
  affiliate_cta: 'product_card',
  affiliate_destination: 'https://amzn.to/...',
  affiliate_category: 'electric_shaver',
  affiliate_position: '1',
  affiliate_tracking_id: ''
}
```

`affiliate_tracking_id` is intentionally blank for shortened links unless a tracking ID is explicitly exposed in link metadata. For a direct Amazon URL containing `?tag=...`, the listener reads the `tag` parameter. It does not guess the ID hidden behind an `amzn.to` redirect.

## 1. GTM data-layer variables

In the existing TopTenUAE web container, create these Data Layer Variables using Data Layer Version 2:

| GTM variable name | Data Layer Variable Name |
|---|---|
| DLV - page_path | `page_path` |
| DLV - affiliate_product | `affiliate_product` |
| DLV - affiliate_cta | `affiliate_cta` |
| DLV - affiliate_destination | `affiliate_destination` |
| DLV - affiliate_category | `affiliate_category` |
| DLV - affiliate_position | `affiliate_position` |
| DLV - affiliate_tracking_id | `affiliate_tracking_id` |
| DLV - affiliate_network | `affiliate_network` |

Do not create a second page-level click listener in GTM. The website already performs Amazon-host validation and sends the custom event.

## 2. GTM trigger

Create a trigger with:

- Type: **Custom Event**
- Event name: `affiliate_click`
- Trigger fires on: **All Custom Events**
- Suggested name: `CE - affiliate_click`

Do not use an All Links trigger for this event; doing so would risk duplicate measurement.

## 3. GA4 Event tag

Create a GA4 Event tag using the site's existing Google tag / GA4 configuration. Do not create or replace a Measurement ID.

- Event name: `affiliate_click`
- Trigger: `CE - affiliate_click`
- Event parameters:

| Event parameter | Value |
|---|---|
| `page_path` | `{{DLV - page_path}}` |
| `affiliate_product` | `{{DLV - affiliate_product}}` |
| `affiliate_cta` | `{{DLV - affiliate_cta}}` |
| `affiliate_destination` | `{{DLV - affiliate_destination}}` |
| `affiliate_category` | `{{DLV - affiliate_category}}` |
| `affiliate_position` | `{{DLV - affiliate_position}}` |
| `affiliate_tracking_id` | `{{DLV - affiliate_tracking_id}}` |
| `affiliate_network` | `{{DLV - affiliate_network}}` |

After validation, publish the GTM container version with a descriptive note such as `Add Amazon affiliate_click measurement`.

## 4. GTM Preview test

1. Deploy the website changes to a preview or production URL.
2. Open GTM Preview and connect to that URL.
3. Visit an optimized buying guide.
4. CMD/CTRL-click one Amazon button. Confirm exactly one `affiliate_click` event appears.
5. Confirm product, CTA, category and position values match the clicked element.
6. Middle-click a different Amazon link and confirm normal tab behaviour plus one event.
7. Click an internal review link and a non-Amazon external link; neither should create `affiliate_click`.
8. Test both an `amzn.to` link and, if the site has one, a direct `amazon.ae` affiliate URL.

## 5. GA4 DebugView

With GTM Preview still connected:

1. Open **GA4 → Admin → Data display → DebugView**.
2. Select the current debug device.
3. Click an Amazon CTA on the site.
4. Open the `affiliate_click` event and verify all available parameters.
5. Confirm only one event was received for the click.

The authenticated GA4 home checked on 18 August 2026 did not surface an existing `affiliate_click` report; that is expected because the local listener has not been deployed and the GTM event tag has not been configured.

## 6. GA4 custom dimensions

After GA4 receives the first event, register event-scoped custom dimensions for:

- `affiliate_product`
- `affiliate_cta`
- `affiliate_category`
- `affiliate_position`
- `affiliate_tracking_id`
- `affiliate_network`

`page_path` is already available through standard page dimensions. Avoid registering `affiliate_destination` as a custom dimension unless full destination-level reporting is genuinely needed; complete URLs can create unnecessary cardinality.

Mark `affiliate_click` as a key event only if the business wants outbound Amazon clicks treated as a conversion proxy. Amazon Associates—not GA4—remains the source of truth for ordered items and commission.

## 7. Recommended Exploration

Create a Free Form exploration named **Amazon affiliate funnel**:

- Rows: Landing page + query string, `affiliate_category`, `affiliate_product`
- Columns: `affiliate_cta`
- Values: Sessions, Active users, Event count, Key events
- Filter: Event name exactly matches `affiliate_click`
- Optional breakdown: Device category

Use the report to identify pages and CTA positions generating Amazon clicks. Compare the same period with Amazon Associates tracking-ID/order reporting; never infer an Amazon sale from GA4 alone.
