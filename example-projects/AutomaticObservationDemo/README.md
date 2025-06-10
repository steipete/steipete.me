# Automatic Observation Demo

This project demonstrates the new automatic observation tracking feature in iOS 18+ and macOS 15+.

## Features

- Basic property observation with `@Observable`
- Complex nested observable objects
- Performance comparisons between manual and automatic updates
- Custom trait propagation patterns
- Migration examples from traditional UIKit patterns

## Requirements

- iOS 18.0+ / macOS 15.0+
- Xcode 15.0+
- Swift 5.9+

## Setup

1. Clone this repository
2. Open `AutomaticObservationDemo.xcodeproj` in Xcode
3. Build and run on iOS 18+ device or simulator

## Key Examples

### Basic Observation

See `MessageCounterViewController.swift` for a simple example of automatic UI updates with an observable message store.

### Trait Propagation

Check out `TraitPropagationExample.swift` to see how observable objects can be propagated through the view hierarchy using custom traits.

### Performance Comparison

Run the app and tap "Performance Test" to see a side-by-side comparison of manual updates vs automatic observation tracking.

## Blog Post

For a detailed explanation of these patterns, read the accompanying blog post: [Automatic Observation Tracking in UIKit: The Feature Apple Forgot to Mention](https://steipete.com/posts/automatic-observation-tracking-uikit-appkit/)

## License

MIT License - see LICENSE file for details.