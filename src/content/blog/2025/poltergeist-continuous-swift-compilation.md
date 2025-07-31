---
title: "Poltergeist: The Ghost That Keeps Your Builds Fresh"
pubDatetime: 2025-07-29T16:00:00.000+02:00
description: "How I built a universal file watcher that automatically rebuilds any project - TypeScript, Rust, Swift, or anything else - whenever you save a file"
heroImage: /assets/img/2025/poltergeist-continuous-swift-compilation/poltergeist-header.png
heroImageAlt: "Terminal showing Poltergeist rebuilding a Swift CLI with ghost emoji"
tags:
  - Development
  - Build Tools
  - TypeScript
  - npm
  - Open Source
  - AI Agents
  - Claude-Code
  - Automation
---

**TL;DR**: Tired of manually rebuilding your project every time you make a change? Meet [Poltergeist](https://github.com/steipete/poltergeist) - a universal file watcher that automatically rebuilds any project in the background. Now available as an npm package and fully open source!

I've been building [Peekaboo](https://peekaboo.dev/), a Swift project for macOS automation. Working with Claude Code has been great, but compilation times were killing the flow - whether I was working on the CLI tool or the Mac app. That's when I realized this wasn't just a Swift problem - it's a universal developer experience issue.

## The Problem: Build Times Are Agent Killers

When you're working with AI agents, the feedback loop is everything. Agents thrive on quick iterations - make a change, test it, adjust, repeat. But compile times were destroying this flow - whether it's Swift, TypeScript, Rust, or any compiled language.

Even worse, agents would sometimes forget to rebuild before testing, leading to confusing situations where we'd debug "issues" that were already fixed in the code but not in the binary. Or they'd rebuild unnecessarily, wasting precious time and context.

I needed something that would:
1. Automatically detect when source files change
2. Rebuild in the background without interrupting my workflow
3. Handle build failures gracefully
4. Work seamlessly with AI agents

## Enter Poltergeist 👻

Poltergeist is a universal file watcher that haunts your project, automatically rebuilding your code whenever source files change. It's built on Facebook's [Watchman](https://facebook.github.io/watchman/) - a file watching service that's battle-tested at scale. Now completely rewritten in TypeScript and available as an [npm package](https://www.npmjs.com/package/@steipete/poltergeist)!

What makes Poltergeist special is its **universal architecture** - it can watch and rebuild:
- **Any CLI tool** - TypeScript, Rust, Go, Swift, you name it
- **Desktop apps** - with auto-relaunch on macOS
- **Web projects** - webpack, Vite, or custom build systems
- **Literally anything** - if it has a build command, Poltergeist can watch it

Here's how it looks in action:

```bash
# Install globally
$ npm install -g @steipete/poltergeist

# Initialize in any project
$ poltergeist init

# Start watching
$ poltergeist haunt
👻 [Poltergeist] Summoning Poltergeist to watch your Swift files...
👻 [Poltergeist] Starting in ALL mode - watching both CLI and Mac app
👻 [Poltergeist] CLI trigger created: poltergeist-cli-rebuild
👻 [Poltergeist] Mac app trigger created: poltergeist-mac-rebuild

# When you save a file...
🔨 [cli] Building with: cargo build --release
✅ [cli] Build complete in 12.3s

# Or for a TypeScript project
🔨 [cli] Building with: npm run build
✅ [cli] Build complete in 2.1s
```

The beauty is that it runs completely in the background. You edit files, Poltergeist rebuilds. By the time you're ready to test, the fresh binary is waiting for you. For Mac apps, it even **automatically quits and relaunches** the app after a successful build - perfect for rapid UI iteration!

## The Smart Wrapper: Never Run Stale Code Again

But automatic rebuilding is only half the solution. What happens when you try to run the CLI while it's being rebuilt? Or worse, what if the build failed?

That's where the smart wrapper script comes in:

```
# Instead of: ./peekaboo
# You run: ./scripts/peekaboo-wait.sh

# The wrapper:
# 1. Checks if the binary is fresh
# 2. Waits for any ongoing builds
# 3. Detects build failures and tells you exactly what to do
```

For Mac apps, Poltergeist handles the entire lifecycle automatically - no wrapper needed!

When a build fails, instead of cryptic errors or stale binaries, you get:

```
❌ POLTERGEIST BUILD FAILED

Error: Cannot find 'someMethod' in scope

🔧 TO FIX: Run 'npm run build:swift' to see and fix the compilation errors.
```

## From Bash to TypeScript: A Complete Rewrite

The original Poltergeist was a collection of bash scripts. It worked, but it was getting complex. So I rewrote it in TypeScript, and now it's:

- **An npm package**: `npm install -g @steipete/poltergeist`
- **Configuration-driven**: One `poltergeist.config.json` per project
- **Language agnostic**: Works with any build system
- **Open source**: [github.com/steipete/poltergeist](https://github.com/steipete/poltergeist)

<details>
<summary>View example configurations for different languages</summary>

The system uses a **configuration-driven architecture** that makes it easy to adapt to any Swift project:

### TypeScript/Node.js Project

```json
{
  "cli": {
    "enabled": true,
    "buildCommand": "npm run build",
    "outputPath": "./dist/index.js",
    "statusFile": "/tmp/ts-build-status.json",
    "lockFile": "/tmp/ts-build.lock",
    "watchPaths": [
      "src/**/*.ts",
      "src/**/*.tsx",
      "package.json",
      "tsconfig.json"
    ],
    "settlingDelay": 500
  }
}
```

### Rust Project

```json
{
  "cli": {
    "enabled": true,
    "buildCommand": "cargo build --release",
    "outputPath": "./target/release/my-cli",
    "statusFile": "/tmp/rust-build-status.json",
    "lockFile": "/tmp/rust-build.lock",
    "watchPaths": [
      "src/**/*.rs",
      "Cargo.toml",
      "Cargo.lock"
    ],
    "settlingDelay": 1000
  }
}
```

### Swift Project

```json
{
  "cli": {
    "enabled": true,
    "buildCommand": "swift build -c release",
    "outputPath": "./.build/release/my-tool",
    "statusFile": "/tmp/swift-build-status.json",
    "lockFile": "/tmp/swift-build.lock",
    "watchPaths": [
      "Sources/**/*.swift",
      "Package.swift"
    ]
  },
  "macApp": {
    "enabled": true,
    "buildCommand": "xcodebuild -workspace MyApp.xcworkspace -scheme MyApp build",
    "bundleId": "com.example.myapp",
    "autoRelaunch": true,
    "watchPaths": [
      "MyApp/**/*.swift",
      "MyApp/**/*.storyboard"
    ]
  }
}
```

</details>

## The TypeScript Architecture

The new TypeScript implementation is modular and extensible:

```typescript
// Main orchestrator that coordinates everything
export class Poltergeist extends EventEmitter {
# A ghost that watches your Swift files and rebuilds when they change
# Supports both CLI tools and Mac apps with auto-relaunch

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CONFIG_FILE="$PROJECT_ROOT/poltergeist.config.json"

# Mode selection (cli, mac, or all)
MODE="all"
if [ "$1" = "--cli" ]; then
    MODE="cli"
    shift
elif [ "$1" = "--mac" ]; then
    MODE="mac"
    shift
elif [ "$1" = "--all" ]; then
    MODE="all"
    shift
fi

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Ghost emoji for fun
GHOST="👻"

function print_status() {
    echo -e "${GREEN}${GHOST} [Poltergeist]${NC} $1"
}

function print_error() {
    echo -e "${RED}${GHOST} [Poltergeist]${NC} $1" >&2
}

function print_warning() {
    echo -e "${YELLOW}${GHOST} [Poltergeist]${NC} $1"
}

function print_info() {
    echo -e "${CYAN}${GHOST} [Poltergeist]${NC} $1"
}

function check_watchman() {
    if ! command -v watchman &> /dev/null; then
        print_error "Watchman not found!"
        echo -e "${PURPLE}Install with:${NC} brew install watchman"
        exit 1
    fi
}

function start_watcher() {
    check_watchman
    
    # Check if already running
    if watchman watch-list 2>/dev/null | grep -q "$PROJECT_ROOT"; then
        print_warning "Poltergeist is already haunting this project!"
        return 0
    fi
    
    print_status "Summoning Poltergeist to watch your Swift files..."
    
    # Watch the project
    watchman watch-project "$PROJECT_ROOT" >/dev/null 2>&1
    
    # Create trigger for Swift files
    watchman -j <<-EOF
    ["trigger", "$PROJECT_ROOT", {
        "name": "$TRIGGER_NAME",
        "expression": ["allof",
            ["anyof",
                ["match", "Core/PeekabooCore/**/*.swift", "wholename"],
                ["match", "Core/AXorcist/**/*.swift", "wholename"],
                ["match", "Apps/CLI/**/*.swift", "wholename"],
                ["match", "**/Package.swift", "wholename"],
                ["match", "**/Package.resolved", "wholename"]
            ],
            ["not", ["match", "**/Version.swift", "wholename"]]
        ],
        "command": ["$PROJECT_ROOT/scripts/poltergeist/poltergeist-handler.sh"],
        "append_files": false,
        "stdin": ["name", "exists", "new", "size", "mode"],
        "settling_delay": 1000
    }]
EOF
    
    if [ $? -eq 0 ]; then
        print_status "Poltergeist is now haunting your Swift files!"
        print_info "Watching: Core/PeekabooCore, Core/AXorcist, Apps/CLI"
        
        # Create lock file
        echo $$ > "$LOCK_FILE"
    else
        print_error "Failed to summon Poltergeist!"
        exit 1
    fi
}

function stop_watcher() {
    check_watchman
    
    print_status "Sending Poltergeist to rest..."
    
    # Remove trigger first
    if watchman trigger-del "$PROJECT_ROOT" "$TRIGGER_NAME" 2>/dev/null; then
        print_info "Trigger removed successfully"
    else
        print_warning "No trigger found to remove"
    fi
    
    # Remove the watch entirely to ensure clean state
    if watchman watch-del "$PROJECT_ROOT" 2>/dev/null; then
        print_info "Watch removed successfully"
    else
        print_warning "No watch found to remove"
    fi
    
    # Remove lock file
    rm -f "$LOCK_FILE"
    
    print_status "Poltergeist is now at rest 💤"
}

function show_status() {
    check_watchman
    
    echo -e "\n${PURPLE}=== Poltergeist Status ===${NC}"
    
    # Check if watch exists
    if watchman watch-list 2>/dev/null | grep -q "$PROJECT_ROOT"; then
        echo -e "${GREEN}✓${NC} Project watch: ${GREEN}ACTIVE${NC}"
        
        # Check if trigger exists
        if watchman trigger-list "$PROJECT_ROOT" 2>/dev/null | grep -q "$TRIGGER_NAME"; then
            echo -e "${GREEN}✓${NC} Swift rebuild trigger: ${GREEN}HAUNTING${NC}"
            echo ""
            echo "Watching for changes in:"
            echo "  • Core/PeekabooCore/**/*.swift"
            echo "  • Core/AXorcist/**/*.swift"
            echo "  • Apps/CLI/**/*.swift"
            echo "  • **/Package.swift"
            echo "  • **/Package.resolved"
        else
            echo -e "${RED}✗${NC} Swift rebuild trigger: ${RED}NOT FOUND${NC}"
        fi
    else
        echo -e "${RED}✗${NC} Project watch: ${YELLOW}DORMANT${NC}"
    fi
    
    # Show recent trigger activity
    echo -e "\n${PURPLE}=== Recent Poltergeist Activity ===${NC}"
    if [ -f "$PROJECT_ROOT/.poltergeist.log" ]; then
        tail -n 5 "$PROJECT_ROOT/.poltergeist.log"
    else
        echo "No activity detected yet"
    fi
}

# Main command handling
case "${1:-help}" in
    start|haunt)
        start_watcher
        ;;
    stop|rest)
        stop_watcher
        ;;
    status)
        show_status
        ;;
    *)
        echo "Usage: poltergeist [haunt|rest|status]"
        ;;
esac
}

// Watchman client for efficient file watching
export class WatchmanClient extends EventEmitter {

```bash
#!/bin/bash
# Build handler triggered by Watchman

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BUILD_SCRIPT="$PROJECT_ROOT/scripts/build-swift-debug.sh"
BUILD_STATUS="/tmp/peekaboo-build-status.json"
BUILD_LOCK="/tmp/peekaboo-swift-build.lock"
LOG_FILE="$PROJECT_ROOT/.poltergeist.log"

# Write build status for the wrapper to read
write_build_status() {
    local status="$1"
    local error_summary="$2"
    local git_hash=$(cd "$PROJECT_ROOT" && git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    
    cat > "$BUILD_STATUS" <<EOF
{
    "status": "$status",
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "git_hash": "$git_hash",
    "error_summary": "$error_summary",
    "builder": "poltergeist"
}
EOF
}

# Capture the build PID
echo $$ > "$BUILD_LOCK"

# Build started
write_build_status "building" ""
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔨 Rebuilding Swift CLI (git: $(git rev-parse --short HEAD))..." | tee -a "$LOG_FILE"

# Run the build
if "$BUILD_SCRIPT" >> "$LOG_FILE" 2>&1; then
    build_time=$(tail -1 "$LOG_FILE" | grep -o '[0-9.]*s' || echo "unknown")
    write_build_status "success" ""
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Build complete in $build_time" | tee -a "$LOG_FILE"
else
    # Capture first few lines of error
    error_summary=$(tail -20 "$LOG_FILE" | grep -E "error:|Error:" | head -3 | tr '\n' ' ')
    write_build_status "failed" "$error_summary"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ Build failed" | tee -a "$LOG_FILE"
fi

# Remove lock
rm -f "$BUILD_LOCK"
```

}

// Pluggable builders for different targets
export abstract class Builder {

```bash
#!/bin/bash
# Smart CLI Wrapper for Peekaboo
# Automatically waits for Poltergeist rebuilds to complete before running

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BINARY_PATH="$PROJECT_ROOT/peekaboo"
BUILD_LOCK="/tmp/peekaboo-swift-build.lock"
BUILD_STATUS="/tmp/peekaboo-build-status.json"
MAX_WAIT=180  # Maximum seconds to wait for build

# Function to check if binary is newer than all Swift sources
is_binary_fresh() {
    if [ ! -f "$BINARY_PATH" ]; then
        return 1
    fi
    
    # Get binary modification time
    BINARY_TIME=$(stat -f "%m" "$BINARY_PATH" 2>/dev/null)
    
    # Find newest Swift file modification time
    NEWEST_SWIFT=0
    while IFS= read -r -d '' file; do
        FILE_TIME=$(stat -f "%m" "$file" 2>/dev/null)
        if [ "$FILE_TIME" -gt "$NEWEST_SWIFT" ]; then
            NEWEST_SWIFT=$FILE_TIME
        fi
    done < <(find "$PROJECT_ROOT/Core" "$PROJECT_ROOT/Apps/CLI" -name "*.swift" -type f -print0 2>/dev/null)
    
    # Binary is fresh if it's newer than all Swift files
    [ "$BINARY_TIME" -ge "$NEWEST_SWIFT" ]
}

# Check build status from status file
check_build_status_file() {
    if [ ! -f "$BUILD_STATUS" ]; then
        return 2  # Unknown status
    fi
    
    local status=$(grep '"status"' "$BUILD_STATUS" 2>/dev/null | cut -d'"' -f4)
    local error_summary=$(grep '"error_summary"' "$BUILD_STATUS" 2>/dev/null | cut -d'"' -f4)
    
    case "$status" in
        "building")
            return 3  # Building
            ;;
        "success")
            return 0  # Success
            ;;
        "failed")
            echo "❌ POLTERGEIST BUILD FAILED" >&2
            echo "" >&2
            if [ -n "$error_summary" ]; then
                echo "Error: $error_summary" >&2
            fi
            echo "" >&2
            echo "🔧 TO FIX: Run 'npm run build:swift' to see and fix the compilation errors." >&2
            echo "" >&2
            return 1  # Failed
            ;;
        *)
            return 2  # Unknown
            ;;
    esac
}

# Main logic
if is_binary_fresh; then
    exec "$BINARY_PATH" "$@"
fi

# Check if there's a recent build failure
check_build_status_file
status_result=$?

if [ $status_result -eq 1 ]; then
    exit 42  # Special exit code for build failure
fi

# Wait for any ongoing build
wait_count=0
while [ -f "$BUILD_LOCK" ] && [ $wait_count -lt $MAX_WAIT ]; do
    if [ $wait_count -eq 0 ]; then
        echo "🔨 Poltergeist is rebuilding the Swift CLI..." >&2
    fi
    sleep 1
    ((wait_count++))
done

# Execute the binary
exec "$BINARY_PATH" "$@"
```

}

// And specialized builders
export class CLIBuilder extends Builder {

```bash
}

export class MacAppBuilder extends Builder {
```

</details>

## Build Failure Recovery

The trickiest part was handling build failures gracefully. The solution ensures agents never get stuck:

1. **Exit Code 42**: When the wrapper detects a build failure, it exits with code 42
2. **Clear Instructions**: The error message tells agents exactly what to do
3. **Exponential Backoff**: Poltergeist backs off after repeated failures (1min → 2min → 5min)
4. **Recovery Signal**: After fixing errors, agents can signal Poltergeist to reset the backoff

With Poltergeist running, the development experience is transformed - save a file and the binary is ready. The wrapper ensures you're always running fresh code, and build failures are detected and communicated clearly.

The best part? It's completely transparent. Whether you're a human developer or an AI agent, you just use the wrapper script and everything works. Agents can focus on writing code, not managing builds.

## Try It Yourself

Want to add Poltergeist to your project? It's now easier than ever:

```bash
# Install globally
npm install -g @steipete/poltergeist

# In your project directory
poltergeist init

# Edit poltergeist.config.json to match your project

# Start watching
poltergeist haunt
```

Check out the [GitHub repository](https://github.com/steipete/poltergeist) for more examples and documentation. The ghost is very friendly to all languages and build systems!

## What's Next?

Poltergeist is just getting started. Some ideas for the future:

- **Multiple build targets**: Watch frontend and backend simultaneously
- **Build notifications**: Desktop notifications when builds complete
- **Performance metrics**: Track build times and optimize
- **Plugin system**: Extend Poltergeist with custom behaviors

Contributions are welcome! The project is MIT licensed and open for collaboration.

Happy haunting! 👻

_Check out [Poltergeist on GitHub](https://github.com/steipete/poltergeist) or install it from [npm](https://www.npmjs.com/package/@steipete/poltergeist)._

<style>
  details {
    margin: 1.5em 0;
    padding: 1em;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
  }
  
  details summary {
    cursor: pointer;
    font-weight: 600;
    color: var(--color-accent);
    margin-bottom: 1em;
  }
  
  details summary:hover {
    text-decoration: underline;
  }
  
  details[open] summary {
    margin-bottom: 1.5em;
  }
  
  details pre {
    overflow-x: auto;
  }
</style>