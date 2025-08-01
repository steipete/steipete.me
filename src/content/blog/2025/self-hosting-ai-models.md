---
title: "Self-Hosting AI Models After Claude's Usage Limits"
description: "After Claude Pro changed to weekly limits, I explored self-hosting Qwen3-Coder-480B with 400k context windows. Here's what I learned about costs, alternatives, and why Claude Code still dominates the landscape."
pubDatetime: 2025-07-31T10:00:00+01:00
heroImage: "/assets/img/2025/self-hosting-ai-models/hero.png"
tags: ["ai", "self-hosting", "llm", "claude", "qwen", "vast.ai", "gpu"]
---

When Anthropic changed Claude Max's subscription model from a 5-hour usage window to weekly limits, [it hit me hard](https://x.com/steipete/status/1949901121998508119).

**TL;DR:** Claude Code is still king, Qwen 3 Coder + opencode is a strong contender tho. Have high hopes for Gemini cli and Crush.

## Claude Code Anonymous

I'm definitely part of the 1% that has got [**a ton**](https://x.com/steipete/status/1948549916604989706) of benefit out of their payment model, and I'm not entirely surprised that they're changing the deal, given the incredible demand for Claude Code. Much like [Cursor's recent pricing changes](https://www.reddit.com/r/cursor/comments/1lrc7q8/cursor_pricing_changed_after_12_days/), this caused a lot of anger in the community, and it also triggered my curiosity on what other options are out there.

Just to set the record straight tho: While I often worked 16h-days, I never automated Claude Code and was well within their Terms of Service. My Anthropic bill for July is at [~6000$](https://x.com/steipete/status/1949908573452193866), since I've been using their GitHub Review bot, and while some people have been extracting the Max API Token to run on GitHub in the background, I opted to not break the rules and pay up... so Anthropic, we cool?

## Evaluating The Landscape

So what are the alternatives? I spend some time testing every promising tool I could find. Claude Code is insofar hard to replace, as it's this genius blend of amazing model & tooling. But the landscape is changing fast! There's quite a few contenders out there that are worth a look:

- [opencode](https://opencode.ai/)
In my tests, opencode is the [most promising](https://x.com/steipete/status/1951288839814725862) alternative currently. It supports pretty much all providers and gets better every day. It has an optimized prompt for Qwen 3 Coder, and produces good results. I'll definitely be using this more.

- [charm crush](https://github.com/charmbracelet/crush)
I *really* want to love this one. It's gorgeous and fun to use. No surprise, it's backed by a company that makes fun cli tools and that shows. Crush was released just yesterday and it's still early. [It has problems with the edit tool and sometimes just gets stuck](https://x.com/steipete/status/1951288839814725862), at least when using it with Qwen 3 Coder. I had to [send a PR](https://github.com/charmbracelet/crush/pull/414) to make it work with self hosted inference. There's a whole team working on it so my hopes are up. If you use Anthropic's models, I'm sure it performs much better. Personal deal-breaker: The non-working text selection. You can't click on links either. I use this a lot so it'd really disruptive for my workflow.

- [Claude Code with claude-code-router](https://github.com/musistudio/claude-code-router)
Clever hack that patches Claude Code to use different models. Since CC is optimized for Anthropic's models, tool use and overall results aren't as good as with Sonnet or Opus. I didn't explore this further.

- [Cline](https://github.com/cline/cline)
I used Cline for testing the model, but since it's a VS Code extension and not a cli, it doesn't fit my workflow, and generally [I haven't been impressed by it](https://x.com/steipete/status/1951062013913727332).

- [amp](https://ampcode.com/)
Amp is a very opinionated CLI. It uses Claude Sonnet and has a tool that can invoke OpenAI's o3. Pricing is forwarded without markup. You can't use your subscription here, so until now, it wasn't interesting. It's hyped, in my tests [it didn't impress me tho](https://x.com/steipete/status/1951059420193968581). Some people swear by it tho, and it's certaily more token efficient than Claude Code.

- [Gemini CLI](https://github.com/google-gemini/gemini-cli) / [Qwen Code](https://github.com/QwenLM/qwen-code)
I have high hopes for Gemini CLI, and with it, the [Qwen Code fork](https://x.com/steipete/status/1951058436030079159). Gemini is REALLY FAST. I use it to debug tricky issues that need a large context space. Tool calling is still [very broken "I'm just a file"](https://x.com/steipete/status/1942113964231442876) and [it can be really lazy](https://x.com/steipete/status/1951301660950581709), however it's open source and a lot of folks are working on making it better. As for the Quen Code fork, we'll see if they keep up with the fast-paced development of Gemini or abandon it. I worry it'll be the latter, at least from looking at the current pace of updates.

There are [so](https://github.com/RooCodeInc/Roo-Code) [many](https://kiro.dev/) [more](https://www.augmentcode.com/changelog/auggie-cli) tools out there in all colors and sizes, and it's really impressive how important tooling & the right system prompt are (e.g. [RooCode drawing diagrams!](https://x.com/steipete/status/1951080437188624564)). IMO that's Claude Code's strength: it's optimized for just one model, and it shows.

## The Infrastructure Journey

My main goals for this exploration are twofold: I don't wanna be too dependent on one company & tool (Anthropic), and I want to have a less costy solution for my heavy use.

A few months ago I bought a Mac Studio with 512GB ram, top of the line, to experiment with models (and because it's prettyyh). Turns out, back then there just wasn't anything great out there that could compete with Opus & Gemini. And then came Deepseek, and with that the realization that even the 512GB won't get me very far.

Yes, I can run Deepseek Coder V2 at ~25 tok/s or a quantified version of R1 at ~8–15 tok/s, but that's not fun, and 128k context size is quite a bit of a downgrade compared to Claude's 200k or Gemini's 1Mio context. There's ways to connect multiple Studio's for more performance and/or less compressed models, but then we're talking 30k$+ for the setup.

Hardware is one thing - we also need capable models. These days, chinese labs releases better and more capable models on an almost weekly basis. The release of [Qwen3-Coder-480B](https://qwenlm.github.io/blog/qwen3-coder/) got my attention, as it's the first model that achieves a similar score on SWE-bench as Claude Sonnet 4. Plus, it has a native 256k token context window that can stretch to 1M tokens with YaRN.

Running this needs some beefy hardware. NVidia's H200 (Hopper refresh) is currently the best top-of-the-line choice. There's also B200 (Blackwell), but they are usually even more expensive to rent, and software support is still quite weak.

I've been experimenting with [Prime Intellect](https://www.primeintellect.ai/), [Vast.ai](https://vast.ai/) and [DataCrunch](https://datacrunch.io/). Prices for 8xH200 machines range from $5-30/hour, depending on location, availability and if you rent a spot instance or a regular one. Now spot instances are instances that are available temporarily. Whenever data centers need more capacity, they will simply deprovision it and use it again.

In my tests, if you get a H200 spot instance it'll likely disappear before you are finished setting it up. They can be incredibly cheap, but it aint fun when you suddenly have to stop working and set up a new rack because of peak demand. We're talking $6/h for spot instances vs $14/h for a regular 8xH200 rack, at least on DataCrunch, which seems to be one of the cheapest (while still reliable in my tests) options out there. On vast.ai, a similar setup is more like ~$26/h, and double that again if you look at AWS.

The setup I'm currently running:

```bash
8x H200 (1128GB GPU VRAM)
176 CPU, 1450GB RAM
Ubuntu 24.04, CUDA 12.8
$15/h
```

With my rig I could set up the FP8[^1]-version of Qwen3 Coder 480B with a 400k context. FP8 means smaller float's, so you lose a few percent accuracy compared to the FP16-version, which is used for the benchmarks. For the Qwen model these losses are insignificant though, and it's a big performance win, plus squeezing in the FP16 model would leave us with maybe 32k tokens of context.

Memory is absolutely everything at this scale. The KV cache[^2] (that's what stores the conversation context) eats about 4.2MB per token when using FP16 precision. If you want a 1M token context window, you'd need 17-30 H200 GPUs. That's why I "only" got 400k tokens with 8 GPUs.

Setup is tricky, but since [Claude Code is my computer](/posts/2025/claude-code-is-my-computer), it was mostly a bit of prompting and about half an hour waiting until the rig was ready - at least for H200.

Currently sparse instances of B200 are an incredibly good deal (~$4/h) and they also been extremely stable in my tests. I also understand why: this hardware is so new that you'll unlikely succeed running models efficiently on it. [I spent all day on this and got it partially running](https://x.com/steipete/status/1951217528161567193), but at no point was it faster than a 8xH200 rig. That will change in a few weeks tho as software catches up.

Insane if you think about it: The 3 8xB200 rack hardware I rented here is worth about 2 Mio Dollar.

## Cost Analysis

With the technical setup sorted, let's get to the question everyone's really asking about: Money.

Running this setup costs $15/h per hour. That's ~$360 per day if you run it 24/7, or about $11,000/month. You could recreate the machine every day to save money, but setting this up also takes 30-60 minutes each morning. That would drive cost down to ~$120 a day and ~$2,600 a month (if we just count work days, but who doesn't work on the weekends?)

Those numbers probably made you wince. So here's the honest assessment after burning through all that cash:

## Is It Worth It?

Simple answer: No. You can't stop and easily restart instances, at least not with the hardware provider I tested. Restarted instances will be scheduled, but there's no guarantee you get a spot in that data center, so it might take days or weeks until your setup reboots.

What about performance? I naively thought that I'd get better performance with my personal 8xH200 rig, so I ran some tests. And since I couldn't find a simple benchmark tool, [I vibed one in go](https://x.com/steipete/status/1951288839814725862). Turns out, Alibaba is slightly faster than my best optimized 8xH200 rig. Maybe that changes once someone gets the B200 racks working.

If you want REAL performance and also a damn good deal, check out [Cerebra's new offering](https://www.cerebras.ai/blog/qwen3-coder-480b-is-live-on-cerebras) that came out today. Cerebras Code Max, 5000 messages per day for $200/month. About 20x faster than Claude 4 Sonnet.

You can rent the 1 Mio-context version of Qwen 3 Coder on Alibaba for [$1-$6 In / $5-$60 Out per Million tokens](https://www.alibabacloud.com/help/en/model-studio/models#8e453767fbkka), depending how much context you're using. That's a lot of tokens you have to burn to make self-hosting cost effective. And yes, a self-hosted runner could be shared, but the economics are still against you, and you quickly run into bottlenecks if more than one person accesses your server concurrently.

Compare to Anthropic: [$15 / $75 for Opus, $3 / $15 for Sonnet](https://www.anthropic.com/pricing#api)

Google's Gemini 2.5 Pro: [$1.25-$2.50 / $10-$15](https://ai.google.dev/gemini-api/docs/pricing)

To give you an idea, on an intense day I need maybe 500 Mio tokens. Calculating the price is difficult tho, since many tokens are cached as you work through a session. The cost for that, when using Opus, would be about $1000; for Sonnet about $200 - that's similar to running my rig for 8h. Using other models is significantly cheaper.

Realistically, using Qwen 3 Coder with opencode is now a very usable and cost effective alternative today. And in a month when the subscription nerving takes effect, things will look different again.

It's great to know that open-source models are a merely 6-12 month behind the best commercial ones, and that it's absolutely possible to host them yourself. Commercially tho, paying per token is the economically saner choice.

**Verdict:** Claude Code as terminal + coding, opencode + Qwen on Alibaba (or Cerebas for speeeeeed!) as alternative coding agent for simpler tasks (or when the subscription is used up) and Gemini for debugging.

<details>
<summary>🤖 Setup Guide for AI Agents to Self-Hosting Qwen3-Coder-480B on 8xH200</summary>

## Complete Setup Instructions for Self-Hosting Qwen3-Coder-480B

This guide provides step-by-step instructions for AI agents to set up Qwen3-Coder-480B on Vast.ai with maximum context window.

### Prerequisites
- Vast.ai account with billing configured
- SSH client installed
- 2-3 hours for initial setup

### Step 1: Create Vast.ai Instance

1. Go to [Vast.ai](https://vast.ai)
2. Search for instances with:
   - 8x H200 GPUs (minimum 4x H200)
   - vLLM template pre-installed
   - 1TB+ disk space
   - Good DLPerf score (>80)

3. Select instance and configure:
   ```
   Docker Image: Leave default vLLM image
   Jupyter: Optional (uses port 8080)
   SSH: Required
   Direct SSH: Recommended
   ```

4. Deploy instance and note:
   - SSH port and IP
   - Instance ID
   - Cost per hour

### Step 2: SSH Configuration

Add to `~/.ssh/config`:
```bash
Host vastai-qwen
  HostName [YOUR_IP]
  Port [YOUR_PORT]
  User root
  StrictHostKeyChecking no
  UserKnownHostsFile /dev/null
```

Create SSH tunnel:
```bash
ssh -f -N -L 8000:localhost:8000 vastai-qwen
```

### Step 3: Deploy vLLM with Qwen3-480B

SSH into instance:
```bash
ssh vastai-qwen
```

Check GPU status:
```bash
nvidia-smi
```

Create deployment script:
```bash
cat > deploy-qwen3.sh << 'EOF'
#!/bin/bash

# Kill any existing vLLM processes
pkill -f vllm.entrypoints.openai.api_server || true

# Start vLLM with optimal settings
/venv/main/bin/python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8 \
  --served-model-name qwen3-coder \
  --tensor-parallel-size 8[^3] \
  --enable-expert-parallel \
  --gpu-memory-utilization 0.95 \
  --max-model-len 400000 \
  --rope-scaling '{"rope_type":"yarn","factor":1.53,"original_max_position_embeddings":262144}' \
  --download-dir /workspace/models \
  --host 0.0.0.0 \
  --port 8000 \
  --trust-remote-code \
  --dtype float16 \
  --enable-prefix-caching \
  --enable-chunked-prefill \
  --max-num-batched-tokens 32768 \
  > vllm.log 2>&1 &

echo "vLLM deployment started. Check vllm.log for progress."
EOF

chmod +x deploy-qwen3.sh
./deploy-qwen3.sh
```

### Step 4: Monitor Model Download

Model download takes 1-2 hours for 480GB:
```bash
# Watch download progress
tail -f vllm.log | grep -E "Downloading|Loading|Progress"

# Check disk usage
watch -n 5 'df -h /workspace'
```

### Step 5: Disable Vast.ai Authentication

Vast.ai uses Caddy proxy with auth. Disable it:
```bash
# Stop Caddy to remove authentication
supervisorctl stop caddy

# Verify direct access works
curl http://localhost:8000/v1/models
```

### Step 6: Configure AI Coding Clients

#### For Cline (VS Code Extension):

1. Install Cline extension in VS Code
2. Open Cline settings
3. Configure:
   ```
   API Provider: OpenAI Compatible
   Base URL: http://localhost:8000/v1
   API Key: not-needed
   Model: qwen3-coder
   ```

#### For Cursor:

1. Open Cursor settings
2. Add custom model:
   ```json
   {
     "openai_api_key": "not-needed",
     "openai_api_base": "http://localhost:8000/v1",
     "model": "qwen3-coder"
   }
   ```

#### For Command Line (qwen CLI):

Create config at `~/.config/qwen/config.json`:
```json
{
  "providers": {
    "qwen3-local": {
      "type": "openai",
      "base_url": "http://localhost:8000/v1",
      "api_key": "not-needed",
      "models": [{
        "id": "qwen3-coder",
        "name": "Qwen3-Coder-480B (400k context)",
        "context_window": 400000,
        "max_tokens": 16384
      }]
    }
  },
  "default_provider": "qwen3-local",
  "default_model": "qwen3-coder"
}
```

### Step 7: Test the Deployment

Test with curl:
```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-coder",
    "messages": [{"role": "user", "content": "Write a Python hello world"}],
    "max_tokens": 100
  }'
```

Test context window:
```bash
# Create large context test
python3 << 'EOF'
import requests
import json

# Create a message with ~100k tokens (roughly 400k characters)
large_context = "The quick brown fox jumps over the lazy dog. " * 10000
messages = [
    {"role": "system", "content": large_context},
    {"role": "user", "content": "Summarize the above in one sentence."}
]

response = requests.post(
    "http://localhost:8000/v1/chat/completions",
    json={"model": "qwen3-coder", "messages": messages, "max_tokens": 50}
)

print(json.dumps(response.json(), indent=2))
EOF
```

### Step 8: Performance Optimization

Monitor GPU utilization:
```bash
# Real-time GPU monitoring
watch -n 1 nvidia-smi

# Check vLLM metrics
curl http://localhost:8000/metrics
```

Optimize for your use case:
- **For speed**: Reduce max_model_len to 100k-200k
- **For context**: Keep at 400k but expect slower responses
- **For cost**: Use 4x H200 instead of 8x (limited to 190k context)

### Step 9: Troubleshooting

Common issues and solutions:

#### Model won't load
```bash
# Check available memory
nvidia-smi
# Solution: Reduce --gpu-memory-utilization to 0.90
```

#### Authentication errors
```bash
# Ensure Caddy is stopped
supervisorctl status
supervisorctl stop caddy
```

#### Context too large errors
```bash
# Reduce max_model_len in deployment script
# 4x H200: max 190000
# 8x H200: max 400000
```

#### Slow responses
```bash
# Check batch settings
# Reduce --max-num-batched-tokens to 16384
# Enable streaming in client
```

### Step 10: Cost Monitoring

Track usage and costs:
```bash
# Create usage tracker
cat > track_usage.py << 'EOF'
#!/usr/bin/env python3
import time
import datetime

start_time = datetime.datetime.now()
hourly_rate = 12.40  # Adjust based on your instance

while True:
    elapsed = datetime.datetime.now() - start_time
    hours = elapsed.total_seconds() / 3600
    cost = hours * hourly_rate
    
    print(f"\rRunning for: {elapsed} | Cost: ${cost:.2f}", end="")
    time.sleep(60)
EOF

chmod +x track_usage.py
./track_usage.py
```

### Advanced: Context Window Tuning

For different context windows, adjust these parameters:

#### 100k context (fastest):
```bash
--max-model-len 100000 \
--rope-scaling '{"rope_type":"yarn","factor":1.0,"original_max_position_embeddings":262144}'
```

#### 256k context (native):
```bash
--max-model-len 262144 \
--rope-scaling '{"rope_type":"yarn","factor":1.0,"original_max_position_embeddings":262144}'
```

#### 400k context (current):
```bash
--max-model-len 400000 \
--rope-scaling '{"rope_type":"yarn","factor":1.53,"original_max_position_embeddings":262144}'
```

#### 760k context (maximum, requires 16+ H200s):
```bash
--max-model-len 760000 \
--rope-scaling '{"rope_type":"yarn","factor":2.9,"original_max_position_embeddings":262144}'
```

### Maintenance

Regular maintenance tasks:

```bash
# Check logs for errors
tail -n 100 vllm.log | grep ERROR

# Monitor disk space
df -h /workspace

# Restart vLLM if needed
pkill -f vllm.entrypoints.openai.api_server
./deploy-qwen3.sh

# Clean old model files
find /workspace/models -type f -mtime +7 -delete
```

### Security Notes

1. **SSH Tunnel**: Always use SSH tunnel, never expose port 8000 directly
2. **API Key**: Even though "not-needed", don't leave blank
3. **Firewall**: Ensure only SSH port is open on Vast.ai
4. **Monitoring**: Check access logs regularly

### Cost-Saving Tips

1. **Pause when not using**: Vast.ai charges by the minute
2. **Use 4x H200**: Sufficient for 190k context at half the cost
3. **Spot instances**: 90% cheaper but risk of termination
4. **Optimize context**: Most tasks don't need 400k tokens

This completes the detailed setup guide for AI agents. The entire process should take 2-3 hours including model download time.

</details>

[^1]: **FP8/FP16** - Floating-point precision formats. FP16 uses 16 bits per number (higher accuracy), FP8 uses 8 bits (lower memory usage, slightly less accurate).

[^2]: **KV Cache** - Key-Value cache stores the model's "memory" of previous tokens in the conversation, enabling efficient context handling without recomputing everything.

[^3]: **Tensor Parallel Size** - Splits the model across multiple GPUs. Size 8 means the model is distributed across 8 GPUs working together.

---
**Btw:** I'm organizing the first Claude Code Anonymous meetup in London on August 18. For people who build. DM me if you're interested!
---