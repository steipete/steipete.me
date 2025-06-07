---
title: "Migrating 1,000+ Tests to Swift Testing: A Real-World Experience"
pubDatetime: 2025-06-06T19:00:00+01:00
description: "How I migrated over 1,000 tests from XCTest to Swift Testing across two projects, with AI assistance and systematic refinement"
heroImage: /assets/img/2025/migrating-1000-tests-to-swift-testing/hero.png
heroImageAlt: "Swift Testing framework logo with test code in the background"
tags:
  - Swift
  - Testing
  - Swift-Testing
  - XCTest
  - AI
  - Migration
  - iOS
  - macOS
---

I've been migrating my test suites from XCTest to Swift Testing. Between [Vibe Meter](https://github.com/steipete/VibeMeter) and [Code Looper](https://github.com/steipete/CodeLooper), that's over 1,000 tests across 80+ files. Here's what I learned from letting AI help with the conversion and then systematically improving the results.

## The Initial Attempt

My first move? Pure laziness:

> Hey Claude Code, convert all these tests to swift-testing.  
> I'll go make coffee.

The initial results were... technically correct. The tests compiled. They even passed. But looking at the code, it was clear this was just XCTest wearing a Swift Testing costume.

When AI gives you lemons:
- `XCTestCase` classes became `@Suite` structs
- `XCTAssert` calls turned into `#expect` statements  
- `func testFoo()` transformed to `@Test func foo()`

But it missed the deeper opportunities that Swift Testing provides. The real work began after my coffee kicked in.

## Creating a Systematic Approach

After watching Apple's [WWDC 2024 session on Swift Testing](https://developer.apple.com/videos/play/wwdc2024/10195/) and reading various blog posts, I compiled everything into a comprehensive playbook. This [`swift-testing-playbook.md`](https://gist.github.com/steipete/84a5952c22e1ff9b6fe274ab079e3a95) became my guide for teaching AI how to write *idiomatic* Swift Testing code.

The key insight: AI needs concrete patterns and examples, not just documentation. The playbook provided:
- Migration patterns with before/after examples
- Best practices for each Swift Testing feature
- Common pitfalls and how to avoid them
- Specific guidance on when to use each feature

## The Refactoring Process

With the playbook in hand, I gave Claude Code new instructions:

> Read swift-testing-playbook.md and improve & refactor the tests. Periodically stop, compile, fix any build issues, commit, ensure everything is green locally and on CI, then continue until perfection.

This iterative approach revealed several patterns worth sharing:

### 1. Nested Suites Bring Order to Chaos

The biggest transformation came from consolidating scattered test files into organized hierarchies. Vibe Meter's CursorProvider tests went from this mess:

```
VibeMeterTests/
├── CursorProviderBasicTests.swift
├── CursorProviderDataTests.swift  
├── CursorProviderNoTeamTests.swift
├── CursorProviderTransitionTests.swift
└── CursorProviderValidationTests.swift
```

To this beauty:

```swift
@Suite("CursorProvider Tests", .tags(.provider, .unit))
struct CursorProviderTests {
    @Suite("Basic Functionality", .tags(.fast))
    struct BasicFunctionality {
        @Suite("Team Information")
        struct TeamInformation { /* tests here */ }
        
        @Suite("Authentication") 
        struct Authentication { /* tests here */ }
    }
    
    @Suite("Data Fetching", .tags(.integration))
    struct DataFetching { /* tests here */ }
    
    @Suite("Validation and Error Handling", .tags(.network))
    struct ValidationAndErrorHandling { /* tests here */ }
}
```

67% fewer files, infinitely better organization.

### 2. Parameterized Tests Eliminate Copy-Paste Syndrome

Remember writing the same test five times with different values? Those days are over:

```swift
// Before: The copy-paste special
func testProgressColorSafe() {
    let color = ProgressColorHelper.color(for: 0.1)
    XCTAssertEqual(color, .progressSafe)
}

func testProgressColorWarning() {
    let color = ProgressColorHelper.color(for: 0.6) 
    XCTAssertEqual(color, .progressWarning)
}

// After: One test to rule them all
@Test("Progress color thresholds", arguments: [
    (0.1, .progressSafe, "safe zone"),
    (0.6, .progressWarning, "warning zone"), 
    (0.9, .progressDanger, "danger zone")
])
func progressColorThresholds(progress: Double, expected: Color, zone: String) {
    let color = ProgressColorHelper.color(for: progress)
    #expect(color == expected)
}
```

### 3. Instance Isolation Simplifies State Management

Swift Testing creates a fresh instance for each test, eliminating shared state issues:

```swift
@Suite struct DatabaseTests {
    let db: TestDatabase
    let tempDir: URL
    
    init() throws {
        tempDir = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString)
        try FileManager.default.createDirectory(at: tempDir)
        db = TestDatabase(path: tempDir)
    }
    
    deinit {
        try? FileManager.default.removeItem(at: tempDir)
    }
}
```

No more worrying about test order or cleanup between tests. Each test gets its own clean instance.

### 4. Better Error Handling

Swift Testing's error handling is more expressive than XCTest:

```swift
// Validate specific error types
#expect(throws: NetworkError.self) {
    try await api.fetchWithoutAuth()
}

// Ensure no errors
#expect(throws: Never.self) {
    try parseValidJSON(data)
}
```

### 5. Time Limits Prevent CI Hangs

One particularly useful feature is `.timeLimit`:

```swift
@Suite("Network Tests", .timeLimit(.seconds(30)))
struct NetworkTests {
    @Test("Fast endpoint", .timeLimit(.seconds(2)))
    func quickAPICall() async { /* ... */ }
}
```

This prevents runaway tests from blocking CI pipelines - something I've dealt with too many times in XCTest.

## The Challenges

The migration wasn't without issues:

### Swift 6 Concurrency

Code Looper's KeyboardShortcuts package required significant updates for Swift 6's strict concurrency. The AI initially made property setters async, which breaks the expected behavior:

```swift
// This doesn't work - setters can't be async
nonmutating set {
    Task { @MainActor in
        KeyboardShortcuts.setShortcut(newValue, for: self)
    }
}
```

### CI Environment Differences

Several tests that worked locally failed in CI:
- ApplicationMover tests trying to mount disk images
- Tests attempting to show UI dialogs
- Login item tests trying to modify system settings

The solution was to detect the CI environment and skip these tests when appropriate.

### Performance Test Noise

The initial conversion kept performance tests that generated hundreds of log messages. These weren't providing value and made CI output unreadable. Sometimes the best refactoring is deletion.

## The Results

Looking at the final pull requests ([Vibe Meter PR #28](https://github.com/steipete/VibeMeter/pull/28), [Code Looper PR #8](https://github.com/steipete/CodeLooper/pull/8)), the transformation is dramatic:

- **67% fewer test files** through intelligent consolidation
- **Zero test duplication** thanks to parameterized tests  
- **Hierarchical organization** that actually makes sense in Xcode's navigator
- **Bulletproof error handling** with specific exception types
- **CI that doesn't hang** with proper timeouts on every async test

## Key Takeaways

1. **AI needs guidance**: The initial blind conversion was just the starting point. The real value came from providing structured patterns through the playbook.

2. **Iterative refinement works**: The approach of compile-test-commit-repeat caught issues early and made debugging easier.

3. **Swift Testing encourages better patterns**: Features like parameterized tests and instance isolation naturally lead to cleaner test design.

4. **Migration reveals test quality issues**: This wasn't just a syntax conversion - it was an opportunity to improve test architecture.

## Your Migration Strategy

If you're considering migrating to Swift Testing:

1. Start with new tests to get familiar with the patterns
2. Create or adapt a playbook for your team's needs
3. Use AI for the mechanical conversion, then refine systematically
4. Treat it as a test quality audit, not just a syntax update
5. Be prepared to handle Swift 6 concurrency requirements

The combination of AI assistance and systematic refinement made this large-scale migration manageable. While the initial AI conversion provided a foundation, the real value came from applying Swift Testing's features thoughtfully to create a more maintainable test suite.

---

*The playbook and full migration history are available in the linked pull requests for those interested in the details.*

**P.S.** - If you're still manually converting XCTestExpectation to confirmations, stop. Make AI do it. Just give it better instructions than I did.