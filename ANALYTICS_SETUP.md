# Umami Analytics Setup for SketchPrompt

This guide will help you set up Umami analytics tracking for your SketchPrompt extension.

## Prerequisites

1. An Umami instance (self-hosted or cloud)
2. Your Umami API credentials

## Step 1: Create a Website in Umami

1. Log into your Umami Cloud dashboard at https://cloud.umami.is
2. Create a new website for your extension:
   - Name: "SketchPrompt Extension" (or similar)
   - Domain: `extension://` (or any placeholder)
3. Note down the **Website ID** (also called "Share ID" or "Site ID")

## Step 2: Configure Your Extension

1. Open `src/umamiConfig.ts`
2. Replace the placeholder values with your actual credentials:

```typescript
export const UMAMI_CONFIG = {
  // Replace with your actual Umami website ID
  WEBSITE_ID: 'your-actual-website-id-here',
  
  // Enable analytics tracking
  ENABLED: true,
  
  // Set to true to see tracking logs in console (for debugging)
  DEBUG_MODE: false,
};
```

**Note**: This configuration is for developers building the extension from source. Extension users who install from the marketplace will have analytics enabled by default.

## Step 3: Test Your Setup

1. Build your extension: `npm run vscode:prepublish`
2. Install the extension in Cursor IDE
3. Open the Developer Console (Help > Toggle Developer Tools)
4. Use the extension and check for tracking logs
5. Verify events appear in your Umami Cloud dashboard at https://cloud.umami.is

## Events Being Tracked

The extension tracks the following events:

- `extension_activated` - When the extension is loaded
- `extension_deactivated` - When the extension is unloaded
- `sketch_created` - When a new sketch is created
- `sketch_opened` - When a sketch file is opened
- `sketch_saved` - When a sketch is saved
- `copy_to_clipboard` - When sketch is copied to clipboard
- `help_viewed` - When help documentation is opened
- `sketch_error` - When sketch operations encounter errors
- `sketch_export` - When sketches are exported (future feature)

## Privacy Considerations

- All tracking is anonymous and doesn't collect personal data
- No user content or sketches are sent to Umami
- Only usage patterns and feature interactions are tracked
- **Extension Users**: Analytics are enabled by default for marketplace installations
- **Developers**: Can disable analytics by setting `ENABLED: false` in `src/umamiConfig.ts`

## Troubleshooting

### Events not appearing in Umami
1. Verify your website ID is correct
2. Enable `DEBUG_MODE: true` to see console logs
3. Check that your Umami Cloud instance is accessible
4. Verify the tracking script is working in your browser

### Extension not working
1. Ensure `ENABLED: true` in the config
2. Check the Developer Console for errors
3. Verify your Umami server is accessible

## Advanced Configuration

You can add custom properties to events by modifying the tracking calls in the source code. For example:

```typescript
await analytics.trackEvent('custom_event', {
  property1: 'value1',
  property2: 'value2'
});
```

## Support

If you need help with the analytics setup, please:
1. Check the Umami documentation: https://umami.is/docs
2. Review the console logs with `DEBUG_MODE: true`
3. Verify your Umami server configuration 