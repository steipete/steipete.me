---
title: "Self-Hosting AI Models After Claude's Usage Limits"
description: "After Claude Pro nerfed its 5-hour window to weekly usage limits, I explored self-hosting Qwen3-Coder-480B on Vast.ai. Here's what I learned about costs, setup, and working with 400k token context windows."
pubDatetime: 2025-07-31T10:00:00+01:00
tags: ["ai", "self-hosting", "llm", "claude", "qwen", "vast.ai", "gpu"]
---

# Self-Hosting AI Models

When Anthropic changed Claude Max's subscription model from a 5-hour usage window to weekly limits, [it hit me hard](https://x.com/steipete/status/1949901121998508119).

I'm definitely part of the 1% that has got [**a ton**](https://x.com/steipete/status/1948549916604989706) of benefit out of their payment model, and I'm not entirely surprised that they're changing the deal, given the incredible demand for Claude Code. Much like Cursor's recent pricing changes, this caused a log of anger in the community, and it also triggered my curiosity on what other options are out there.

Just to set the record straight tho: While I often worked 16h-days, I never automated Claude Code and was well within their Terms of Service. My Anthropic bill for July is at ~6000$, since I been using their GitHub Review bot, and while some people have been extracting the Max API Token to run on GitHub in the background, I opted to not break the rules and [pay up](https://x.com/steipete/status/1949908573452193866)... Anthropic, we cool?

## Evaluating The Landscape

Claude Code is insofar hard to replace, as it's this genius blend of amazing model & tooling. But the landscape is changing fast. There's quite a few contenders out there that are worth a look:

- [opencode](https://opencode.ai/)
Supports pretty much all providers. Getting better every day.

- [charm crush](https://github.com/charmbracelet/crush)
A new kid on the block, very cute. Had to [send a PR](https://github.com/charmbracelet/crush/pull/414) to make it work with vLLM.goo

- [Claude Code with claude-code-router](https://github.com/musistudio/claude-code-router)
Clever hack that patches Claude Code to use different models. Since CC is optimized for Anthropic's models, tool use and overall results aren't as good as with Sonnet or Opus.

- [Cline](https://github.com/cline/cline)
I used Cline for testing the model, but since it's a VS Code extension and not a cli, it doesn't fit my workflow.

- [amp](https://ampcode.com/)
Amp is a very opinionated CLI. It uses Claude Sonnet and has a tool that can invoke OpenAI's o3. Pricing is forwarded without markup. You can't use your subscription here, so until now, it wasn't interesting. I'd say their tool search is competitive and in parts maybe even better than Claude Code, will have to try this more.

This is such a fast-moving space and [new tools](https://kiro.dev/) are released almost [daily](https://www.augmentcode.com/changelog/auggie-cli).

## The Infrastructure Journey

A few months ago I bought a Mac Studio with 512GB ram, top of the line, to experiment with models. Turns out, back then there just asn't anything great out there that could compete with Opus & Gemini. And then came Deepseek, and with that the realization that even the 512GB won't get me very far.

Yes, I can run Deepseek Coder V2 at ~25 tok/s or a quaitified version of R1 at ~8–15 tok/s, but that's not fun, and 128k context size is quite a bit of a downgrade compared to Claude's 200k or Gemini's 1Mio context. There's ways to connect multiple Studio's for more performance and/or less compressed models, but then we're talking 30k$+ for the setup.

It feels like there's a new chinese lab each week that releases better and more capable models. The release of [Qwen3-Coder-480B](https://qwenlm.github.io/blog/qwen3-coder/) got my attention, as it's the first model that achieves a similar score on SWE-bench as Claude Sonnet 4. Plus, it has a native 256k token context window that can stretch to 1M tokens with YaRN.

Running this needs some beefy hardware. NVidia's H200 (Hopper refresh) is currently the best top-of-the-line choice. There's also B200 (Blackwell), but they are extremely expensive to rent.

My first stop was [Prime Intellect](https://www.primeintellect.ai/). For $8.20/hour, I got 4x H200 GPUs. Seemed like a great deal until I realized they were spot instances. That means that they can be disabled at any time if the cloud provider needs the capacity. That' be fine, but I found the machines were also extremly spotty with ssh access, and I've experienced lots of intermittend outages, even though I tried various locations. Can't recommend their service, so I eventually abandoned that.

Next up: [Vast.ai](https://vast.ai/). I rented a rig of 8xH200 machines for ~$26/hr. That's 428.2 TFLOP. Retail price for that is ~$300k. Their machines have been very reliable and my base for experiments.

The setup I'm currently running:

```bash
8x NVIDIA H200 (143.7GB each = 1,150GB total VRAM)
Cost: $26.736/hr total ($26.353/hr GPU + $0.383/hr disk)
Daily: $641.66/day
Monthly: $19,249.92/month
DLPerf: 3116.7 (excellent performance score)
Network: 13TB/month, 3.4 Gbps up/2.7 Gbps down
Context: 400,000 tokens achieved
Model: Qwen3-Coder-480B-A35B-Instruct-FP8
```

## Cost Analysis

Let's talk money, because that's what everyone asks about first.

Running this setup costs $26.736 per hour. That's $641.66 per day if you run it 24/7, or about $213 for an 8-hour workday. For a full month? You're looking at $19,250. Just about 1,000x more expensive than the Claude subscription.

With my rig I could set up the FP8-version of Qwen3 Coder 480B with a 400k context. FP8 means smaller float's, so you lose about 5-10% accuracy compared to the FP16-version, which is used for the benchmarks.

Memory is absolutely everything at this scale. The KV cache (that's what stores the conversation context) eats about 4.2MB per token when using FP16 precision. If you want a 1M token context window, you'd need 17-30 H200 GPUs. That's why I "only" got 400k tokens with 8 GPUs.

Setup is tricky, but since [Claude Code is my computer](/posts/2025/claude-code-is-my-computer), it was mostly a bit of prompting and about half an hour waiting until the rig was ready.

## Is It Worth It?

Simple answer: No. You can't stop and easily restart instances, at least not with Vast.ai. Restarted instances will be scheduled, but there's no guarantee you get a spot in that data center, so it might take days or weeks until your setup reboots. 

Then even with 8 beefy H200 machines, there's compromises that make the model worse than it would be.

You can rent the 1Mio-context version on Alibaba for $1-$6 In // $5-$60 Out per Million tokens, depending how much context you're using. That's a lot of tokens you have to burn to make self-hosting cost effective. And yes, a self-hosted runner could be shared, but the economics are still against you.

Compare to Anthropic: [$15 / $75 for Opus, $3 / $15 for Sonnet](https://www.anthropic.com/pricing#api.
Google's Gemini 2.5 Pro: [$1.25-$2.50 / $10-$15](https://ai.google.dev/gemini-api/docs/pricing)

To give you an idea, on an intense day I need maybe 500Mio tokens. Calculating the price is difficult tho, since many tokens are cached as you work through a session. The cost for that, when using Opus, would be about $1000; for Sonnet about $200 - that's similar to running my rig for 8h.

The real value here isn't about saving money (you won't). It's about removing constraints. It's great to know that open-source models are a merely 6-12 month behind the best commercial ones, and that it's absolutely possible to host them yourself. Just know what you're getting into.

<details>
<summary><strong>🤖 Detailed Setup Guide for AI Agents</strong></summary>

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
  --tensor-parallel-size 8 \
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