---
title: "Code Signing and Notarization: Sparkle and Tears"
pubDatetime: 2025-06-05T08:00:00.000+01:00
description: "The brutal truth about implementing Sparkle auto-updates in sandboxed macOS apps - from 40 failed releases to enlightenment."
tags:
  - macOS
  - Development
  - Code Signing
  - Sparkle
  - Notarization
  - Swift
---

**TL;DR**: Implementing Sparkle in sandboxed macOS apps requires specific entitlements, careful code signing order, and respect for XPC services - skip the pain with my battle-tested scripts.

*Or: How I Learned to Stop Worrying and Love the XPC Services*

Two days ago, I was supposed to release Vibe Meter and I already wrote the blog post, but I spoke too soon. Turns out code signing and everything around it is still hard. So here's a helpful guide so you don't have to go through the same pain as I did.

If you've ever tried to implement automatic updates in a sandboxed macOS app using Sparkle, you know it can feel like trying to solve a Rubik's cube while wearing oven mitts. After creating **40 beta releases** and spending countless hours debugging "Failed to gain authorization" errors, I finally cracked the code. Here's my journey from frustration to enlightenment.

## The Setup: VibeMeter Meets Sparkle

[VibeMeter](https://github.com/steipete/VibeMeter) is a sandboxed macOS menu bar app that tracks AI service spending. When I decided to add automatic updates using Sparkle 2.x, I thought it would be straightforward. After all, Sparkle is the de facto standard for macOS app updates, right?

Oh, sweet summer child.

## Act 1: The Mysterious Authorization Failure

My first attempts seemed promising. The app built, signed, and notarized successfully. But when users tried to update, they were greeted with:

```
Error: Failed to gain authorization required to update target
```

This error is Sparkle's polite way of saying "I can't talk to my XPC services, and I have no idea why."

## Act 2: The Entitlements Enigma

After digging through Sparkle's documentation[^1] and Console logs, I discovered my first issue: missing mach-lookup entitlements. In a sandboxed app, Sparkle uses XPC services to perform privileged operations, and these services need special permissions to communicate.

### The Missing Piece

My entitlements file was missing a critical entry:

```xml
<key>com.apple.security.temporary-exception.mach-lookup.global-name</key>
<array>
    <string>com.steipete.vibemeter-spks</string>
    <string>com.steipete.vibemeter-spkd</string>
</array>
```

But here's the kicker - I initially only added `-spks`, thinking it stood for "Sparkle Server." Turns out, you need BOTH:
- `-spks`: Sparkle Server (for the Installer.xpc service)
- `-spkd`: Sparkle Downloader (for the Downloader.xpc service)

Missing either one results in the dreaded authorization error.

## Act 3: The Code Signing Circus

Next came the code signing adventures. My notarization script was doing what seemed logical:

```bash
codesign --deep --force --sign "Developer ID" VibeMeter.app
```

But Sparkle's documentation specifically warns against using `--deep`. Why? Because it can mess up the XPC services' signatures. Instead, you need to sign components in a specific order.

Here's the correct approach from my [codesign script](https://github.com/steipete/VibeMeter/blob/main/scripts/codesign-app.sh):

```bash
# Sign XPC services first
codesign -f -s "$SIGN_IDENTITY" -o runtime \
    "$APP_BUNDLE/Contents/Frameworks/Sparkle.framework/Versions/B/XPCServices/Installer.xpc"

# Preserve entitlements for Downloader.xpc (Sparkle 2.6+)
codesign -f -s "$SIGN_IDENTITY" -o runtime --preserve-metadata=entitlements \
    "$APP_BUNDLE/Contents/Frameworks/Sparkle.framework/Versions/B/XPCServices/Downloader.xpc"

# Sign other Sparkle components
codesign -f -s "$SIGN_IDENTITY" -o runtime \
    "$APP_BUNDLE/Contents/Frameworks/Sparkle.framework/Versions/B/Autoupdate"

# Then sign the framework
codesign -f -s "$SIGN_IDENTITY" -o runtime \
    "$APP_BUNDLE/Contents/Frameworks/Sparkle.framework"

# Finally, sign the app WITHOUT --deep
codesign --force --sign "$SIGN_IDENTITY" --entitlements VibeMeter.entitlements \
    --options runtime VibeMeter.app
```

## Act 4: The Bundle ID Bamboozle

At one point, I thought I was being clever by trying to change the XPC services' bundle identifiers to match my app's namespace. Big mistake. HUGE.

Sparkle's XPC services MUST keep their original bundle IDs:
- `org.sparkle-project.InstallerLauncher`
- `org.sparkle-project.DownloaderService`

Why? Because Sparkle is hardcoded to look for these specific bundle IDs. Change them, and you'll get cryptic XPC connection errors that will make you question your career choices.

## Act 5: The Build Number Blues

Even after fixing all the sandboxing issues, we hit another snag. Users were seeing "You're up to date!" when updates were clearly available. The culprit? Our appcast generation script was defaulting build numbers to "1".

Sparkle uses build numbers (CFBundleVersion), not version strings, to determine if an update is available. If your build numbers don't increment, Sparkle thinks there's nothing new.

Our [appcast generation script](https://github.com/steipete/VibeMeter/blob/main/scripts/generate-appcast.sh) now properly handles this:

```bash
# Extract build number from Info.plist
BUILD_NUMBER=$(plutil -extract CFBundleVersion raw "$INFO_PLIST")

# Ensure build numbers increment correctly
if [[ "$BUILD_NUMBER" -le "$PREVIOUS_BUILD_NUMBER" ]]; then
    echo "Error: Build number must be greater than previous release"
    exit 1
fi
```

## The Grand Finale: It Works!

After 40 beta releases (yes, forty!), I finally had a working setup. My complete automation pipeline is now rock-solid, with [comprehensive scripts](https://github.com/steipete/VibeMeter/tree/main/scripts) that handle every aspect of the process.

### The Magic Recipe

1. **Entitlements**: Include BOTH `-spks` and `-spkd` mach-lookup exceptions
2. **Bundle IDs**: Never change Sparkle's XPC service bundle IDs
3. **Code Signing**: Sign XPC services individually, never use `--deep`
4. **Build Numbers**: Always increment them, and verify your appcast
5. **Info.plist**: Set `SUEnableInstallerLauncherService = true` and `SUEnableDownloaderService = false`

### The Working Configuration

```xml
<!-- VibeMeter.entitlements -->
<key>com.apple.security.app-sandbox</key>
<true/>
<key>com.apple.security.network.client</key>
<true/>
<key>com.apple.security.temporary-exception.mach-lookup.global-name</key>
<array>
    <string>com.steipete.vibemeter-spks</string>
    <string>com.steipete.vibemeter-spkd</string>
</array>
```

## The Scripts That Saved Our Sanity

Our complete build pipeline consists of several specialized scripts:

- **[preflight-check.sh](https://github.com/steipete/VibeMeter/blob/main/scripts/preflight-check.sh)**: Validates environment and prerequisites
- **[codesign-app.sh](https://github.com/steipete/VibeMeter/blob/main/scripts/codesign-app.sh)**: Handles the complex code signing process
- **[notarize-app.sh](https://github.com/steipete/VibeMeter/blob/main/scripts/notarize-app.sh)**: Manages notarization and stapling
- **[create-dmg.sh](https://github.com/steipete/VibeMeter/blob/main/scripts/create-dmg.sh)**: Creates and signs distribution DMGs
- **[generate-appcast.sh](https://github.com/steipete/VibeMeter/blob/main/scripts/generate-appcast.sh)**: Generates Sparkle appcast files
- **[release.sh](https://github.com/steipete/VibeMeter/blob/main/scripts/release.sh)**: Orchestrates the entire release process

The beauty of this approach is that Claude can now create releases by simply running:

```bash
./scripts/release.sh 1.2.0 beta 1
```

And everything happens automatically - from building to GitHub release creation.

## The Notarization Nightmare

Apple's notarization process adds another layer of complexity. Our [notarization script](https://github.com/steipete/VibeMeter/blob/main/scripts/notarize-app.sh) uses the modern `notarytool` approach:

```bash
# Create ZIP for notarization (not DMG!)
ditto -c -k --keepParent "$APP_BUNDLE" "$ZIP_PATH"

# Submit for notarization
xcrun notarytool submit "$ZIP_PATH" \
    --key "$API_KEY_PATH" \
    --key-id "$API_KEY_ID" \
    --issuer "$ISSUER_ID" \
    --wait

# Staple the ticket
xcrun stapler staple "$APP_BUNDLE"

# Verify everything worked
spctl -a -t exec -vv "$APP_BUNDLE"
xcrun stapler validate "$APP_BUNDLE"
```

## Lessons Learned

1. **Read the documentation carefully** - But also know that it might not cover every edge case
2. **Console.app is your friend** - Filter by your process name and watch for XPC errors
3. **Don't be clever** - Follow Sparkle's conventions exactly
4. **Test updates, not just builds** - A successful build doesn't mean updates will work
5. **Automate everything** - Manual processes lead to human errors
6. **Version control your scripts** - Build automation is as important as your app code

## The Tools That Saved Our Sanity

- **Console.app**: For watching XPC connection attempts in real-time
- **codesign -dvv**: For verifying signatures and entitlements
- **plutil**: For validating plist files
- **GitHub Actions**: For consistent, reproducible builds
- **Claude Code**: For debugging and script automation

## Performance and Reliability

Our final pipeline includes sophisticated error handling and retry logic. The [notarization script](https://github.com/steipete/VibeMeter/blob/main/scripts/notarize-app.sh) can handle temporary Apple server issues, and our [preflight checks](https://github.com/steipete/VibeMeter/blob/main/scripts/preflight-check.sh) catch common mistakes before they become expensive failures.

The entire process, from clean build to GitHub release, takes about 10 minutes and rarely fails. When it does fail, the error messages are clear and actionable.

## Final Thoughts

Implementing Sparkle in a sandboxed app is like solving a puzzle where the pieces keep changing shape. But once you understand the rules - respect the XPC services, get your entitlements right, and sign everything properly - it works beautifully.

The irony? The final solution is actually quite simple. It's getting there that's the adventure.

Our [complete script collection](https://github.com/steipete/VibeMeter/tree/main/scripts) is open source and battle-tested. If you're implementing Sparkle updates, feel free to adapt our approach - it might save you from creating your own dozen beta releases.

## Resources

- [Sparkle Sandboxing Documentation](https://sparkle-project.org/documentation/sandboxing/)
- [Apple's Code Signing Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [VibeMeter Source Code](https://github.com/steipete/VibeMeter)
- [VibeMeter Build Scripts](https://github.com/steipete/VibeMeter/tree/main/scripts)

---

*Special thanks to the Sparkle team for creating such a robust framework, even if it did make me question my sanity for a while. Also, massive shoutout to Claude Code - without it, I probably wouldn't have bothered building this comprehensive automation pipeline.*

**P.S.** If you're reading this and thinking "I should add automatic updates to my sandboxed Mac app," just remember: I created 40 beta releases to figure this out. Budget your time accordingly, or better yet, just steal my scripts. ☕️

[^1]: Sparkle's [sandboxing documentation](https://sparkle-project.org/documentation/sandboxing/) is comprehensive but doesn't cover every edge case you'll encounter in practice.