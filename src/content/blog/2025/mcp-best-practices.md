---
title: MCP Best Practices
pubDatetime: 2025-06-01T15:00:00.000+01:00
description: "My comprehensive guide outlining best practices for building reliable, user-friendly Model Context Protocol (MCP) tools with proper configuration, testing, and release management."
tags:
  - MCP
  - Best-Practices
  - Development
  - Tools
  - TypeScript
  - Testing
---

Building high-quality Model Context Protocol (MCP) tools requires attention to detail across many dimensions. After developing several MCP tools, I've compiled this comprehensive guide to best practices that ensure your tools are reliable, user-friendly, and maintainable.

## My MCP Tools

Here are the MCP tools I've built following these practices:

- 👻 [Peekaboo](https://github.com/steipete/Peekaboo): Enables your IDE to make screenshots and ask questions about images.
- 🤖 [Terminator](https://github.com/steipete/Terminator): Manages a Terminal outside of the loop, so processes that might get stuck don't break the loop.
- 🧠 [Claude Code](https://github.com/steipete/claude-code-mcp): A buddy for your IDE that your agent can ask if he's stuck. Can do coding task and offer "a pair of fresh eyes" that often un-stucks the loop.
- 🐱 [Conduit](https://github.com/steipete/conduit-mcp): Advanced file manipulation for faster refactoring.
- 🎯 [Automator](https://github.com/steipete/macos-automator-mcp): AppleScript for your IDE.

## I. General Tool Configuration & Behavior

### Sensible Defaults

All environment variables must have sensible defaults for easy out-of-the-box usage. Users should be able to get started without extensive configuration.

### Dynamic Versioning

The tool's version is emitted in its description. This version must be read dynamically (e.g., from `package.json`) and not hardcoded. This ensures version consistency and eliminates manual update errors.

### Tool & Parameter Descriptions

- **Tool Titles:** Use descriptive, human-friendly titles for tools
- **Parameter Descriptions:** All parameters must offer a clear description
- **Optional/Required Parameters:** Parameters must be explicitly noted as "optional" or "required"
- **Default Values:** If a parameter is optional, its default value must be explained

These details should be verifiable by hovering over the tool in clients like Cursor or using the MCP inspector.

### Parameter Parsing

Parameter parsing should be lenient (e.g., accept `path` if `project_path` is formally defined). Generally, advertise stricter schemas but be more lenient in execution to accommodate variations from agents.

### Error Handling

- **Runtime Error Handling:** In case of an error, emit a helpful message to the caller with information to potentially recover
- **Configuration Error Handling:** Misconfigurations (e.g., wrongly set environment variables) must not crash the tool. Instead, provide a useful explanation when the tool is run, enabling the user to self-correct their setup

### Output Control

There should be no output to `stdio` during normal tool operation, as this can disrupt MCP clients. File-based logging is the designated method for operational output.

### The `info` Command

At least one tool must offer an `info` sub command. This command shall list:

- The version of the MCP tool
- The status of any required native dependencies (if applicable), including tests for their presence and functionality
- Any detected configuration issues or missing environment variables (e.g., problems with the logger path)

## II. Logging (Pino)

### Default File Logger

Pino is used for logging with a default file logger in the system's log directory (e.g., `~/Library/Logs/`). The log file path is configurable via the `[ProjectName]_LOG_FILE` environment variable.

### Log Path Resilience

- Pino logic must automatically create missing parent directories for the specified log file path
- If pino cannot write to the `[ProjectName]_LOG_FILE` path, it must fall back to logging to the default temporary directory path

### Configuration

- **Configurable Log Level:** The log level is set using the `[ProjectName]_LOG_LEVEL` environment variable (accepts upper, lower, or mixed case values)
- **Optional Console Logging:** An environment variable, `[ProjectName]_CONSOLE_LOGGING=true`, enables logging to the console in addition to the pino file logger
- **Logger Flush:** The logger must be flushed before the process exits to ensure all log messages are written

## III. Code, Dependencies & Build

### Code Quality Standards

- **Dependency Management:** All dependencies should be kept at their latest stable versions. The release script will warn for outdated dependencies
- **Static Analysis:** There must be no linter (e.g., ESLint) or TypeScript errors
- **File Size:** No single file should exceed 500 lines of code (LOC); aim for below 300 LOC

### Build Configuration

- **Execution with Compiled Code:** The startup logic and all tool operations must always use the compiled JavaScript output (e.g., from the `dist` folder)
- **Shebangs:** Compiled JavaScript files intended for direct execution must have the correct shebang (e.g., `#!/usr/bin/env node`)
- **NPM Package Contents:** The published npm package must contain only the absolute minimum files: the `dist/` folder, any potential native components, the `README.md`, and a `LICENSE` file

## IV. Testing

### Test Framework

Tests must use `vitest` for consistency and modern testing capabilities.

### Test Coverage

- **TypeScript Test Suite:** A comprehensive test suite for the TypeScript layer is required
- **End-to-End (E2E) Tests:** E2E tests that validate the complete setup are necessary. These might be run as release preparation if CI execution is challenging due to permissions like macOS access

### NPM Scripts

- `npm run prepare-release` executes a comprehensive test suite (detailed in Section VI)
- `npm run inspector` executes `npx @modelcontextprotocol/inspector node path/to/server/index.js`

## V. Native Binary Rules (If Applicable)

### Platform Compatibility

- **macOS Compatibility:** The binary must be universal (Apple Silicon & Intel) and support the current macOS version and the previous major version (n-1, e.g., macOS >= 14 if current is 15)
- **Build Optimization:** Compiler and linker flags must be set to achieve a minimal binary file size

### Native Code Quality

- **Native Test Suite:** A comprehensive test suite using Swift's native testing tools (e.g., `swift-test` or XCTest) is required
- The CLI must have no linter issues (e.g., SwiftLint for Swift)
- A formatter must be applied (e.g., SwiftFormat for Swift)
- The CLI must show no analyzer issues

### Integration Requirements

- **Custom Path Configuration:** An environment variable must allow setting a custom absolute path to run the native binary
- **Error Communication:** If the tool uses a native library, `errno` (or an equivalent mechanism) must be used to pass error and execution issues to the TypeScript logger and back to the tool
- **Version Synchronization:** The native CLI and the MCP tool (TypeScript package) must have the same version number. This version must be injected during the build process, not hardcoded

### Communication Protocol

- **JSON Communication:** The native binary part of the tool must have a mode to communicate in JSON back to the TypeScript server for easier parsing. JSON responses should include debug logs if requested
- **CLI Help Command:** The binary must respond to `--help` with a helpful command explaining its use and all options
- **Argument Parsing Framework:** The binary must use a robust argument parser framework (e.g., `swift-argument-parser` for Swift)

### Distribution

Consider options for distributing as a single, statically linked binary if feasible and beneficial for simpler installation by end-users who might use the CLI directly.

## VI. Rules to Check Before a Release (`scripts/prepare-release.js`)

There is a `scripts/prepare-release.js` that runs an extensive test suite. The script runs these checks sequentially and stops at the first failure.

### Git & Version Control

1. Check current branch (warns if not on main or designated release branch)
2. Check for uncommitted changes
3. Check if synced with origin/main (or designated release branch)
4. Version availability check (ensures version isn't already published)
5. Version consistency between `package.json` and `package-lock.json`
6. **Changelog Check:** Check for a changelog entry corresponding to the current version

### Code Quality & Security

1. Dependency installation check
2. Outdated dependencies check (warning only)
3. Security audit (fails on critical/high vulnerabilities)
4. TypeScript compilation
5. TypeScript tests
6. TypeScript declaration files generation
7. Delete any build folders and reset package caches before building
8. _If native binary exists:_ Swift analyze
9. _If native binary exists:_ Swift formatting (SwiftFormat)
10. _If native binary exists:_ Swift linting (SwiftLint)
11. _If native binary exists:_ Swift tests
12. No build warnings

### Binary & CLI Validation (If Applicable)

1. _If native binary exists:_ Swift CLI command tests (help, version, and other key functionalities)
2. _If native binary exists:_ Swift CLI error handling tests (invalid commands, missing args, invalid window index, etc.)
3. _If native binary exists:_ Swift CLI JSON output validation
4. _If native binary exists:_ Binary exists and is executable
5. _If native binary exists:_ Binary contains both architectures (arm64 + x86_64, verifiable via `lipo -info`)
6. _If native binary exists:_ Binary responds correctly to `--help`

### Package Validation

1. Required fields in `package.json`
2. Package size check (warns if >2MB, configurable threshold)
3. Executable permission check in `postinstall` (if a CLI is present)
4. Critical files included (e.g., `dist/index.js`, native binary name, `README.md`, `LICENSE`)
5. MCP server smoke test (JSON-RPC request/response)
6. Full integration tests

### Beta Release Strategy

Releases are first done with a `beta` tag to the npm registry so they can be tested via the `npx [packageName]@beta install` method.

## Conclusion

Following these best practices ensures that your MCP tools are professional, reliable, and user-friendly. They represent lessons learned from real-world development and deployment of production MCP tools. As the MCP ecosystem evolves, these practices will continue to be refined and expanded.
