---
title: "Self-Hosting AI Models After Claude's Usage Limits"
description: "After Claude Pro nerfed its 5-hour window to weekly usage limits, I explored self-hosting Qwen3-Coder-480B on Vast.ai. Here's what I learned about costs, setup, and working with 400k token context windows."
pubDatetime: 2025-07-31T10:00:00+01:00
tags: ["ai", "self-hosting", "llm", "claude", "qwen", "vast.ai", "gpu"]
---

# Self-Hosting AI Models After Claude's Usage Limits

When Anthropic changed Claude Pro's subscription model from a 5-hour usage window to weekly limits, it hit me hard. As someone who burns through AI usage like it's going out of style, I suddenly found myself rationing my Claude interactions. The old model worked perfectly for my workflow: intense coding sessions where I could blast through problems. The new weekly caps? [Not so much](https://x.com/steipete/status/1949901121998508119).

This kicked off my journey into self-hosting large language models. After some research, I landed on [Qwen3-Coder-480B](https://qwenlm.github.io/blog/qwen3-coder/), a massive Mixture of Experts model with 480B total parameters (though only 35B active per token). What caught my eye was the native 256k token context window that can stretch to 1M tokens with YaRN. The coding capabilities? They're legitimately impressive, giving Claude 3.5 Sonnet a run for its money.

The promise was tantalizing: run my own AI coding assistant with massive context windows, zero usage limits, and complete control over everything.

## The Infrastructure Journey

My quest to self-host this beast was... educational.

First stop: Prime Intellect. For $8.20/hour, I got 4x H200 GPUs. Seemed like a great deal until I realized they were spot instances. You know what happens when you're downloading a 1TB model and your spot instance gets reclaimed? Complete data loss. Every. Single. Time. Lesson learned: spot instances and massive models don't mix.

Next up: Vast.ai. This is where things got interesting. They advertised 4TB of storage (perfect for a 1TB model, right?), but when I actually got into the container, I discovered only 130GB was accessible. The rest? Locked away in the host filesystem where containers can't touch it. Classic bait and switch.

But Vast.ai redeemed itself. After some hunting, I found an instance with 8x H200 GPUs packing 1.12TB of VRAM total. At $26.736/hour, it's not cheap, but it actually works. The setup I'm currently running:

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

Running this setup costs $26.736 per hour. That's $641.66 per day if you run it 24/7, or about $213 for an 8-hour workday. For a full month? You're looking at $19,250. Yes, that's nearly 1,000x more expensive than Claude Pro's $20/month.

But here's the thing: Claude Pro gives you weekly limits. Once you hit them, you're done. With self-hosting, there are no limits. Zero. Nada. You can run it 24/7 if your wallet can handle it.

The setup itself takes about 30 minutes if you follow a guide (or 2-4 hours if you hit the same authentication issues I did). The model download? Budget 1-2 hours for the 480GB transfer.

## Client Integration Attempts

Getting various AI coding assistants to work with the self-hosted model was an adventure.

Cline was the clear winner. It connected seamlessly through the OpenAI-compatible API and actually used the full 400k context window. Just drop the config into VS Code settings and you're good to go.

Cursor worked, sort of. It connected fine but seemed limited to smaller context windows no matter what I tried. Plus, there were some annoying streaming issues that made the experience less than ideal.

Open Canvas? Complete failure. Vast.ai uses a Caddy proxy with authentication that Open Canvas just couldn't handle. I spent hours trying various workarounds before giving up.

## Key Learnings

After burning through way too much money and time, here's what I learned:

Memory is absolutely everything at this scale. The KV cache (that's what stores the conversation context) eats about 4.2MB per token when using FP16 precision. Do the math: if you want a 1M token context window, you'd need 17-30 H200 GPUs. That's why I "only" got 400k tokens with 8 GPUs.

FP8 quantization is interesting. It cuts the model size in half (from 960GB to 480GB), which is great. But you can't use FP8 for the KV cache with current vLLM versions, so you're still stuck with massive memory requirements for context.

The provider landscape is full of gotchas. Spot instances will ruin your day when they disappear mid-download. Container filesystems lie about available space. What they advertise and what you can actually use are two very different numbers.

On the technical side, these flags are essential for getting decent performance:
```bash
--tensor-parallel-size 8
--enable-expert-parallel
--enable-prefix-caching
--enable-chunked-prefill
--rope-scaling '{"rope_type":"yarn","factor":1.53}'
```

## Is It Worth It?

Look, I'll be straight with you. Self-hosting makes sense only if you're hitting Claude Pro limits constantly and it's actually blocking your work. If you need those massive 100k+ token context windows for real work (not just because they sound cool), or if you have specific privacy requirements where you absolutely cannot send code to external services, then maybe it's worth considering.

But if you're using AI assistants casually, or Claude Pro's limits work fine for you, save your money. Seriously. And if you need the absolute best model performance, Claude 3.5 Sonnet is still superior to Qwen3-Coder-480B in many ways.

## The Verdict

After all this experimentation, here's my take: Yes, you can self-host Qwen3-Coder-480B on Vast.ai. Yes, it works. Yes, you get 400k token context windows with zero usage limits.

But at $19,250/month, you're paying nearly 1,000x more than Claude Pro. The setup is complex, things break, and you'll spend hours troubleshooting random issues.

The real value here isn't about saving money (you won't). It's about removing constraints. If you absolutely need unlimited AI coding assistance with massive context windows and you've got the budget, self-hosting gives you that freedom. Just know what you're getting into.

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