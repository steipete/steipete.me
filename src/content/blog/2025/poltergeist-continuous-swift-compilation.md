---
title: "Poltergeist: The Ghost That Keeps Your Swift CLI Fresh"
pubDatetime: 2025-07-29T16:00:00.000+02:00
description: "How I built a file watcher that haunts my Swift CLI, rebuilding it automatically whenever I save a file - and why it's been a game-changer for AI agent workflows"
heroImage: /assets/img/2025/poltergeist-continuous-swift-compilation/header.png
heroImageAlt: "Terminal showing Poltergeist rebuilding a Swift CLI with ghost emoji"
tags:
  - Swift
  - CLI
  - Development
  - Build Tools
  - AI Agents
  - Claude-Code
  - Automation
---

**TL;DR**: Tired of manually rebuilding your Swift CLI every time you make a change? Meet Poltergeist - a file watcher that automatically rebuilds your CLI in the background, making development with AI agents much smoother.

I've been building [Peekaboo](https://peekaboo.dev/), a Swift CLI for macOS screenshots. Working with Claude Code has been great, but Swift compilation times were killing the flow.

## The Problem: Swift Build Times Are Agent Killers

When you're working with AI agents, the feedback loop is everything. Agents thrive on quick iterations - make a change, test it, adjust, repeat. But Swift's compile times were destroying this flow.

Even worse, agents would sometimes forget to rebuild before testing, leading to confusing situations where we'd debug "issues" that were already fixed in the code but not in the binary. Or they'd rebuild unnecessarily, wasting precious time and context.

I needed something that would:
1. Automatically detect when Swift files change
2. Rebuild in the background without interrupting my workflow
3. Handle build failures gracefully
4. Work seamlessly with AI agents

## Enter Poltergeist 👻

Poltergeist is a file watcher that haunts your Swift project, automatically rebuilding your CLI whenever source files change. It's built on Facebook's [Watchman](https://facebook.github.io/watchman/) - a file watching service that's battle-tested at scale.

Here's how it looks in action:

```bash
$ npm run poltergeist:haunt
👻 [Poltergeist] Summoning Poltergeist to watch your Swift files...
👻 [Poltergeist] Poltergeist is now haunting your Swift files!
👻 [Poltergeist] Watching: Core/PeekabooCore, Core/AXorcist, Apps/CLI

# Now when you save a Swift file...
🔨 Rebuilding Swift CLI (git: abc123)...
✅ Build complete in 12.3s
```

The beauty is that it runs completely in the background. You edit files, Poltergeist rebuilds. By the time you're ready to test, the fresh binary is waiting for you.

## The Smart Wrapper: Never Run Stale Code Again

But automatic rebuilding is only half the solution. What happens when you try to run the CLI while it's being rebuilt? Or worse, what if the build failed?

That's where the smart wrapper script comes in:

```bash
# Instead of: ./peekaboo
# You run: ./scripts/peekaboo-wait.sh

# The wrapper:
# 1. Checks if the binary is fresh
# 2. Waits for any ongoing builds
# 3. Detects build failures and tells you exactly what to do
```

When a build fails, instead of cryptic errors or stale binaries, you get:

```
❌ POLTERGEIST BUILD FAILED

Error: Cannot find 'someMethod' in scope

🔧 TO FIX: Run 'npm run build:swift' to see and fix the compilation errors.
```

## The Architecture: How It All Fits Together

<details>
<summary>View the complete Poltergeist implementation</summary>

The system consists of four main components:

### 1. The Watcher Script (poltergeist.sh)

```bash
#!/bin/bash
# Poltergeist - The Swift CLI File Watcher
# A ghost that watches your Swift files and rebuilds when they change

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TRIGGER_NAME="poltergeist-swift-rebuild"
LOCK_FILE="/tmp/peekaboo-poltergeist.lock"

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
```

### 2. The Build Handler (poltergeist-handler.sh)

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

### 3. The Smart Wrapper (peekaboo-wait.sh)

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

### 4. Recovery Signal Script

```bash
#!/bin/bash
# Signal Poltergeist to reset its backoff timer after fixing build errors
RECOVERY_SIGNAL="/tmp/peekaboo-build-recovery"
touch "$RECOVERY_SIGNAL"
echo "✅ Recovery signal sent to Poltergeist"
```

</details>

## Build Failure Recovery

The trickiest part was handling build failures gracefully. The solution:

1. **Exit Code 42**: When the wrapper detects a build failure, it exits with code 42
2. **Clear Instructions**: The error message tells agents exactly what to do
3. **Exponential Backoff**: Poltergeist backs off after repeated failures (1min → 2min → 5min)
4. **Recovery Signal**: After fixing errors, agents can signal Poltergeist to reset the backoff

This ensures agents never get stuck - they either get a working binary or clear instructions on how to fix the problem.

## The Results: Faster Development

With Poltergeist running, the development experience is transformed:

- **No manual builds**: Save file, binary is ready
- **No stale binaries**: The wrapper ensures you're always running fresh code
- **Clear error handling**: Build failures are detected and communicated clearly
- **Perfect for AI agents**: Agents can focus on writing code, not managing builds

The best part? It's completely transparent. Whether you're a human developer or an AI agent, you just use the wrapper script and everything works.

## Try It Yourself

Want to add Poltergeist to your own Swift CLI project? The implementation above is everything you need. Just:

1. Install Watchman: `brew install watchman`
2. Copy the scripts to your project
3. Adjust the paths in the watcher configuration
4. Start haunting: `./poltergeist.sh haunt`

Or if you're feeling adventurous, just show this blog post to Claude Code and ask it to set up Poltergeist for your project. The ghost is very friendly to AI agents!

Happy haunting! 👻

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