---
title: "Adding Logging to Crash Reports"
description: "Understanding crash reports is often difficult without extra context. Learn how we attach application logs to crash reports via Google's Firebase Crashlytics in the free PDF Viewer for iOS app."
preview_image: /images/blog/2019/logs-for-your-crash-reports/article-header.png
section: blog
author:
  - Peter Steinberger
author_url:
  - https://twitter.com/steipete
date: 2019-03-06 8:00 UTC
tags: iOS, Development
published: true
secret: false
---

A great way to address critical issues in production applications is to analyze the symbolicated crash log. However, understanding crash reports is often difficult without extra context detailing how and why a crash happened in the first place.

In this post, we’ll outline how we customized our crash reporting strategy so that the logs we get from our users contain enough information for us to be able to diagnose issues more effectively.

## Using a File-Based Logger

[PDF Viewer for iOS][], our free, PSPDFKit-powered application for viewing and editing PDFs, uses Google’s [Firebase][] crash reporting service, [Crashlytics][].

Ideally, we’d love to fully switch to Apple’s [os_log][] API. However, it has one major downside: There’s still no way to access the rolling log to add to the reports that get sent back to us. Multiple radars have been submitted to Apple, requesting this feature be added ([rdar://40853863][], [rdar://30444429][]), but in the meantime, developers are forced to implement their own solutions if they wish to include logging in a crash’s backtrace.

Fortunately, [Crashlytics includes the helper functions `CLSLogv` and `CLSNSLogv`][] to automatically take over the work of a rolling log for us:

```swift
/// This class is used to log events to Crashlytics.
/// The log size of a session is limited to 64 KB. Older entries are deleted.
class CrashlyticsLogger: DDAbstractLogger {

    override init() {
        super.init()
        self.logFormatter = DDLogFileFormatterDefault()
    }

    override func log(message: DDLogMessage) {
        guard let formatter = self.value(forKey: "_logFormatter") as? DDLogFormatter,
            let logText = formatter.format(message: message) else { return }

        CLSLogv("%@", getVaList([logText]))
    }
}
```

For our specific use case, we’ve decided to integrate Crashlytics’ `CLSLogv` function as a custom logger that we use with [CocoaLumberjack][], a framework that offers many other useful features, such as adding macOS logging capabilities.

By simply customizing our log handler to include a call to `CLSLogv`, we get a rolling log that’s limited to 64KB for free.

## Hooking into PSPDFKit’s Log Handler

[PSPDFKit offers logging out of the box][], and because these logs are printed to the console and nothing is sent to a remote location, we need to explicitly hook into the log firehose to retrieve the logs and be able to include them in our crash reports.

We also track critical events via Google Analytics for Firebase for conditions that “should never happen but are recoverable/aren’t critical enough to crash.”

We accomplish this by setting a custom log handler on the global `PSPDFKit.sharedInstance`, as follows:

```swift
// Replace the PSPDFKit logging with a custom one.
PSPDFKit.sharedInstance.setLogHandler { [unowned self] level, tag, message, _, function, line in
	if !PSPDFKit.sharedInstance.logLevel.contains(level) {
		return
	}

	let logMessage = self.formatMessage(forTag: tag, function: function, line: line, message: message)

	let sendLogToAnalytics = { (eventName: PSPDFAnalyticsEventName) -> Void in
		let attributes = [
			"function_name": function,
			"line_number": line,
			"message": message()
			] as [String: Any]
		Analytics.shared.logEvent(eventName, attributes: attributes)
		FirebaseAnalyticsClient.recordErrorEvent(event: eventName.rawValue, attributes: attributes)
	}

	switch level {
	case let value where value == .verbose:
		DDLogVerbose(logMessage)
	case let value where value == .debug:
		DDLogDebug(logMessage)
	case let value where value == .info:
		DDLogInfo(logMessage)
	case let value where value == .warning:
		DDLogWarn(logMessage)
	case let value where value == .error:
		DDLogError(logMessage)
	case let value where value == .critical:
		DDLogError(logMessage)
		sendLogToAnalytics(.criticalEvent)
	default:
		DDLogInfo(logMessage)
	}
}
```

**Reminder:** When logging data, keep user privacy in mind and exclude sensitive data, such as document file names and unlock passwords. Apple’s `os_log` considers all dynamic strings to be user data and redacts them by default.

Here’s a screenshot of the logs attached to one of our crash reports on Crashlytics. When we go over our crash reports, these logs prove to be invaluable tools in providing us with a better perspective of what the user was doing when the application crashed. Additionally, the level of detail makes our jobs easier.

![Screenshot of Console.app showing an example of the logs attached to a Crashlytics crash report.](/images/blog/2019/logs-for-your-crash-reports/crash_log_example.png)

## Conclusion

With modern third-party crash reporting services such as Google’s Firebase Crashlytics, collecting log statements is both easy and extremely helpful in allowing us to better understand and debug the conditions leading to issues — something every app on the App Store can benefit from.

[pdf viewer for ios]: https://pdfviewer.io
[firebase]: https://firebase.google.com
[crashlytics]: https://firebase.google.com/products/crashlytics
[os_log]: https://developer.apple.com/documentation/os/logging
[cocoalumberjack]: http://cocoadocs.org/docsets/CocoaLumberjack/index.html
[pspdfkit offers logging out of the box]: https://pspdfkit.com/guides/ios/current/features/logging/
[crashlytics includes the helper functions `clslogv` and `clsnslogv`]: https://firebase.google.com/docs/crashlytics/customize-crash-reports
[rdar://40853863]: http://ileyf.cn.openradar.appspot.com/40853863
[rdar://30444429]: http://www.openradar.me/30444429
