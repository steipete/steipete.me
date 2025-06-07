---
title: "Migrating 1,000+ Tests to Swift Testing: A Real-World Experience"
pubDatetime: 2025-06-06T19:00:00+01:00
description: "How I migrated over 1,000 tests from XCTest to Swift Testing across two projects, with AI assistance and systematic refinement"
heroImage: /assets/img/2025/migrating-1000-tests-to-swift-testing/hero.png
heroImageAlt: "Xcode showing Swift Testing code with nested test suites and parameterized tests"
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

I've been migrating my test suites from XCTest to Swift Testing. Between [Vibe Meter](https://github.com/steipete/VibeMeter) and [Code Looper](https://github.com/steipete/CodeLooper), that's over 1,000 tests across 80+ files. Here's what I learned from letting AI help with the conversion and then systematically improving the results using my [Swift Testing playbook](https://gist.github.com/steipete/84a5952c22e1ff9b6fe274ab079e3a95).

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

Instead of manually fixing 1,000 tests, I did what any reasonable developer would do: I procrastinated by watching WWDC videos. The [Go further with Swift Testing](https://developer.apple.com/videos/play/wwdc2024/10195/) session was eye-opening.

After absorbing Apple's wisdom and reading various blog posts, I compiled everything into a comprehensive playbook that became my guide for teaching AI how to write *idiomatic* Swift Testing code.

The key insight: AI needs concrete patterns and examples, not just documentation. The playbook provided:
- Migration patterns with before/after examples
- Best practices for each Swift Testing feature
- Common pitfalls and how to avoid them
- Specific guidance on when to use each feature

## Round Two: AI Redemption Arc

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

Remember writing the same test five times with different values? Vibe Meter had exactly this problem with currency conversions:

```swift
// Before: The copy-paste special  
func testConvert_SmallAmount() {
    let result = CurrencyConversionHelper.convert(amount: 100.0, rate: 0.85)
    XCTAssertEqual(result, 85.0, accuracy: 0.01)
}

func testConvert_LargeAmount() {
    let result = CurrencyConversionHelper.convert(amount: 1_000_000.0, rate: 0.85) 
    XCTAssertEqual(result, 850_000.0, accuracy: 0.01)
}

func testConvert_PrecisionAmount() {
    let result = CurrencyConversionHelper.convert(amount: 999.99, rate: 1.2345)
    XCTAssertEqual(result, 1234.488, accuracy: 0.001)
}

// After: One test to rule them all
@Test("Currency conversion calculations", arguments: [
    ConversionTestCase(100.0, rate: 0.85, expected: 85.0, "basic conversion"),
    ConversionTestCase(1_000_000.0, rate: 0.85, expected: 850_000.0, "large amount conversion"), 
    ConversionTestCase(0.01, rate: 0.85, expected: 0.0085, "small amount conversion"),
    ConversionTestCase(999.99, rate: 1.2345, expected: 1234.488, "precision conversion")
])
func conversionCalculations(testCase: ConversionTestCase) async {
    let result = await MainActor.run {
        CurrencyConversionHelper.convert(amount: testCase.amount, rate: testCase.rate)
    }
    
    let tolerance = testCase.expected.magnitude < 1.0 ? 0.0001 : 0.01
    #expect(abs(result - testCase.expected) < tolerance)
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

Performance tests were scattered across multiple files with no protection against runaway execution:

```swift
// Before: Individual scattered performance tests
func testCurrencyConversionPerformance() {
    measure {
        for _ in 0..<1000 {
            _ = CurrencyHelper.convert(100.0, rate: 0.85)
        }
    }
}

// After: Organized performance suite with time limits
@Suite("Performance Benchmarks", .tags(.performance))
struct PerformanceBenchmarks {
    @Suite("Currency Conversion", .tags(.currency))
    struct CurrencyConversion {
        @Test("Bulk currency conversion performance", .timeLimit(.minutes(1)))
        func bulkCurrencyConversionPerformance() {
            // Given
            let amounts = Array(stride(from: 0.01, through: 10000.0, by: 0.01))
            let exchangeRates = ["EUR": 0.92, "GBP": 0.82, "JPY": 110.0]
            
            // When
            let startTime = Date()
            for amount in amounts {
                for (_, rate) in exchangeRates {
                    _ = CurrencyConversionHelper.convert(amount: amount, rate: rate)
                }
            }
            let duration = Date().timeIntervalSince(startTime)
            
            // Then
            print("Converted \(amounts.count * exchangeRates.count) values in \(duration)s")
            #expect(duration < 10.0) // Should complete in under 10 seconds
        }
    }
}
```

This prevents runaway tests from blocking CI pipelines - something I've dealt with too many times in XCTest.

## Beyond Basic Conversion: Real Improvements

The mechanical migration was just the beginning. Here's where Swift Testing really shines:

### Meaningful Error Testing with #expect(throws:)

Stop settling for "it didn't crash" assertions:

```swift
// Before: Wishful thinking
do {
    try await manager.startListener()
} catch {
    #expect(error != nil) // Well, yes... that's why we're in catch
}

// After: Actual validation
#expect(throws: URLError.self) {
    try await api.fetchWithoutAuth()
}

// Even better: Test the specific error properties
do {
    try await api.fetchWithoutAuth()
    Issue.record("Expected URLError to be thrown")
} catch let error as URLError {
    #expect(error.code == .notConnectedToInternet)
}
```

### Eliminating Meaningless Assertions

Found a lot of these gems during migration:

```swift
// Before: The "please don't crash" test
@Test("Sound engine play user alert sound")
func soundEnginePlayUserAlertSound() async throws {
    SoundEngine.play(.userAlert)
    #expect(true) // If we get here, the call didn't crash
}

// After: Actually test something useful
@Test("System sound enum pattern matching")
func systemSoundEnumCases() async throws {
    let userAlert = SystemSound.userAlert
    
    switch userAlert {
    case .userAlert:
        #expect(Bool(true)) // Explicit bool to silence warnings
    case .named:
        Issue.record("Expected userAlert case, got named case")
    }
}
```

### Memory Leak Detection Built Right In

Swift Testing's instance isolation makes leak detection elegant:

```swift
@Test("ThreadSafeBox instances are properly deallocated")
func threadSafeBoxMemoryLeaks() async throws {
    weak var weakBox: ThreadSafeBox<String>?
    
    do {
        let box = ThreadSafeBox("test-value")
        weakBox = box
        #expect(weakBox != nil, "Box should be alive within scope")
    }
    
    await Task.yield() // Allow deallocation
    #expect(weakBox == nil, "Box should be deallocated after scope ends")
}
```

### Descriptive Test Names That Tell Stories

No more cryptic function names:

```swift
// Before: What does this even test?
@Test("windowControllerManagement")

// After: Crystal clear intent
@Test("Window controller management handles creation and lifecycle")
@Test("Position saving and restoration persists window states")
@Test("AppleScript support methods provide automation capabilities")
```

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

**P.S.** - If you're still manually converting XCTestExpectation to confirmations, stop. Make AI do it. Just give it better instructions than I did.