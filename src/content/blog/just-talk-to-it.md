---
title: 'Just Talk To It - the no-bs Way of Agentic Engineering'
description: 'A practical guide to working with AI coding agents without the hype.'
pubDatetime: 2025-10-14T10:00:00+01:00
heroImage: /assets/img/2025/just-talk-to-it/curve-angentic.jpg
tags: ["ai", "claude", "engineering", "productivity"]
---

I've been more quiet here lately as I'm knee-deep working on my latest project. Agentic engineering has become so good that it now writes pretty much 100% of my code. And yet I see so many folks trying to solve issues and generating these elaborated charades instead of getting sh*t done.

This post partly is inspired by the conversations I had at last night's [Claude Code Anonymous in London](https://x.com/christianklotz/status/1977866496001867925) and partly since [it's been an AI year](https://x.com/pmddomingos/status/1976399060052607469) since my last workflow update. Time for a check-in.

All of the basic ideas still apply, so I won't mention simple things like context management again. Read my [Optimal AI Workflow post](/posts/2025/optimal-ai-development-workflow) for a primer.

## Context & Tech-Stack
I work by myself, current project is a ~300k LOC TypeScript React app, a Chrome extension, a cli, a client app in Tauri and a mobile app in Expo. I host on vercel, a PR delivers a new version of my website in ~2 minutes to test. Everything else (apps etc) is not automated.

## Harness & General Approach

I've completely moved to `codex` cli as daily driver. I run between 3-8 in parallel in a 3x3 terminal grid, most of them [in the same folder](https://x.com/steipete/status/1977771686176174352), some experiments go in separate folders. I experimented with worktrees, PRs but always revert back to this setup as it gets stuff done the fastest.

My agents do git [atomic commits](https://x.com/steipete/status/1977498385172050258) themselves. In order to maintain a mostly clean commit history, I iterated a lot on [my agent file](https://gist.github.com/steipete/d3b9db3fa8eb1d1a692b7656217d8655). This makes git ops sharper so each agent commits exactly the files it edited.

Yes, with claude you could do hooks and codex doesn't support them yet, but models are incredibly clever and [no hook will stop them](https://x.com/steipete/status/1977119589860601950) if they are determined.

I was being ridiculed in the past and called a [slop-generator](https://x.com/weberwongwong/status/1975749583079694398), good to see that running parallel agents [slowly gets mainstream](https://x.com/steipete/status/1976353767705457005).

## Model Picker

I build pretty much everything with gpt-5-codex on mid settings. It's a great compromise of smart & speed, and dials thinking up/down automatically. I found over-thinking these settings to not yield meaningful results, and it's nice not having to think about *ultrathink*.

### Blast Radius 💥

Whenever I work, I think about the "blast radius". I didn't come up with that term, I do love it tho. When I think of a change I have a pretty good feeling about how long it'll take and how many files it will touch. I can throw many small bombs at my codebase or a one "Fat Man" and a few small ones. If you throw multiple large bombs, it'll be impossible to do isolated commits, much harder to reset if sth goes wrong.

This is also a good indicator while I watch my agents. If something takes longer than I anticipated, I just hit escape and ask "what's the status" to get a status update and then either help the model to find the right direction, abort or continue. Don't be afraid of stopping models mid-way, file changes are atomic and they are really good at picking up where they stopped.

When I am unsure about the impact, I use "give me a few options before making changes" to gauge it.

### Why not worktrees?
I run one dev server, as I evolve my project I click through it and test multiple changes at once. Having a tree/branch per change would make this significantly slower, spawning multiple dev servers would quickly get annoying. I also have limitations for Twitter OAuth, so I can only register some domains for callbacks.

### What about Claude Code?
I used to love Claude Code, these days I can't stand it anymore ([even tho codex is a fan](https://x.com/steipete/status/1977072732136521836)). It's language, the [absolutely right's](https://x.com/vtahowe/status/1976709116425871772), the 100% production ready messages while tests fail - I just can't anymore. Codex is more like the introverted engineer that chugs along and just gets stuff done. It reads much more files before starting work so even small prompts usually do exactly what I want.

There's broad consensus in my timeline that [codex is the way](https://x.com/s_streichsbier/status/1974334735829905648) [to go](https://x.com/kimmonismus/status/1976404152541680038).

### Other benefits of codex
- **~230k usable context vs claude's 156k.** Yes, there's Sonnet 1Mio if you get lucky or pay API pricing, but realistically Claude gets very silly long before it depletes that context so it's not realistically something you can use.
- **More efficient token use.** Idk what OpenAI does different, but my context fills up far slower than with Claude Code. I used to see Compacting... all the time when using claude, I very rarely manage to exceed the context in codex.
- **Message Queuing.** Codex allows to [queue messages](https://x.com/steipete/status/1978099041884897517). Claude had this feature, but a few months ago they changed it so your messages "steer" the model. If I want to steer codex, I just press escape and enter to send the new message. Having the option for both is just far better. I often queue related feature tasks and it just reliably works them off.
- **Speed** OpenAI rewrote codex in Rust, and it shows. It's incredibly fast. With Claude Code I often have multi-second freezes and it's process blows up to gigabytes of memory. And then there's the terminal flickering, especially when using Ghostty. Codex has none of that. It feels incredibly lightweight and fast.
- **Language.** [This really makes a difference to my mental health.](https://x.com/steipete/status/1975297275242160395) I've been screaming at claude so many times. I rarely get angry with codex. Even if codex would be a worse model I'd use it for that fact alone. If you use both for a few weeks you will understand.
- [No random markdown files everywhere](https://x.com/steipete/status/1977466373363437914). [IYKYK](https://x.com/deepfates/status/1975604489634914326).

### Why not $harness
IMO there's simply not much space between the end user and the model company. I get by far the best deal using a subscription. I currently have 4 OpenAI subs and 1 Anthropic sub, so my overall costs are around 1k/month for basically unlimited tokens. If I'd use API calls, that'd cost my around 10x more. Don't nail me on this math, I used some token counting tools like ccusage and it's all somewhat imprecise, but even if it's just 5x it's a damn good deal.

I like that we have tools like amp or Factory, I just don't see them surviving long-term. Both codex and claude code are getting better with every release, and they all converge to the same ideas and feature set. Some might have a temporary edge with better todo lists, steering or slight dx features, but I don't see them significantly out-competing the big AI companies.

amp moved away from GPT-5 as driver and now calls it their ["oracle"](https://ampcode.com/news/gpt-5-oracle). Meanwhile I use codex and basically constantly work with the smarter model, the oracle. [Yes, there are benchmarks](https://x.com/btibor91/status/1976299256383250780), but given the skewed usage numbers, I don't trust them. codex gets me far better results than amp. I have to give them kudos tho for session sharing, they push some interesting ideas ahead.

Factory, unconvinced. Their videos are a bit cringe, I do hear good things in my timeline about it tho, even if images aren't supported (yet) and they have the [signature flicker](https://x.com/badlogicgames/status/1977103325192667323).

Cursor... it's tab completion model is industry leading, if you still write code yourself. I use VS Code mostly, I do like them pushing things like browser automation and plan mode tho. I did experiment with GPT-5-Pro but [Cursor still has the same bugs that annoyed me back in May](https://x.com/steipete/status/1976226900516209035). I hear that's being worked on tho, so it stays in my dock.

Others like Auggie were a blip on my timeline and nobody ever mentioned them again. In the end they all wrap either GPT-5 and/or Sonnet and are replaceable. RAG might been helpful for Sonnet, but GPT-5 is so good at searching at you don't need a separate vector index for your code.

The most promising candidates are opencode and crush, esp. in combination with open models. You can totally use your OpenAI or Anthropic sub with them as well ([thanks to clever hax](https://x.com/steipete/status/1977286197375647870)), but it's questionable if that is allowed, and what's the point of using a less capable harness for the model optimized for codex or Claude Code.

### What about $openmodel
I keep an eye on China's open models, and it's impressive how quickly they catch up. GLM 4.6 and Kimi K2.1 are strong contenders that slowly reach Sonnet 3.7 quality, I don't recommend them as [daily driver](https://x.com/imfeat7/status/1977246145278583258) tho.

The benchmarks only tell half the story. IMO agentic engineering moved from "this is crap" to "this is good" around May with the release of Sonnet 4.0, and we hit an even bigger leap from good to "this is amazing" with gpt-5-codex.

### Plan Mode & Approach
What benchmarks miss is the strategy that the model+harness pursue when they get a prompt. codex is far FAR more careful and reads much more files in your repo before deciding what to do. [It pushes back harder when you make a silly request.](https://x.com/thsottiaux/status/1975565380388299112) Claude/other agents are much more eager and just try *something*. This can be mitigated with plan mode and rigorous structure docs, to me that feels like working around a broken system.

I rarely use big plan files now with codex. codex doesn't even have a dedicated plan mode - however it's so much better at adhering to the prompt that I can just write "let's discuss" or "give me options" and it will diligently wait until I approve it. No harness charade needed. Just talk to it.

### But Claude Code now has [Plugins](https://www.anthropic.com/news/claude-code-plugins)
Do you hear that noise in the distance? It's me sigh-ing. What a big pile of bs. This one really left me disappointed in Anthropic's focus. They try to patch over inefficiencies in the model. Yes, maintaining good documents for specific tasks is a good idea. I keep a big list of useful docs in a docs folder as markdown.

### But but Subagents !!!1!
But something has to be said about this whole dance with subagents. Back in May this was called subtasks, and mostly a way to spin out tasks into a separate context when the model doesn't need the full text - mainly a way to parallelize or to reduce context waste for e.g. noisy build scripts. Later they rebranded and improved this to subagents, so you spin of a task with some instructions, nicely packaged.

The use case is the same. What others do with subagents, I usually do with separate windows. If I wanna research sth I might do that in a separate terminal pane and paste it to another one. This gives me complete control and visibility over the context I engineer, unlike subagents who make it harder to view and steer or control what is sent back.

And we have to talk about the subagent Anthropic recommends on their blog. Just look at this ["AI Engineer" agent](https://github.com/wshobson/agents/blob/main/plugins/llm-application-dev/agents/ai-engineer.md). It's an amalgamation of slop, mentioning GPT-4o and o1 for integration, and overall just seems like an autogenerated soup of words that tries to make sense. There's no meat in there that would make your agent a better "AI engineer".

What does that even mean? If you want to get better output, telling your model "You are an AI engineer specializing in production-grade LLM applications" will not change that. Giving it documentation, examples and do/don't helps. I bet that you'd get better result if you ask your agent to "google AI agent building best practices" and let it load some websites than this crap. You could even make the argument that this slop is [context poison](https://x.com/IanIsSoAwesome/status/1976662563699245358).

## How I write prompts

Back when using claude, I used to write (ofc not, [I speak](https://x.com/steipete/status/1978104202820812905)) very extensive prompts, since this model "gets me" the more context I supply. While this is true with any model, I noticed that my prompts became significantly shorter with codex. Often it's just 1-2 sentences + [an image](https://x.com/steipete/status/1977175451408990379). The model is incredibly good at reading the codebase and just gets me. I even sometimes go back to typing since codex requires so much less context to understand.

Adding images is an amazing trick to provide more context, the model is really good at finding exactly what you show, it finds strings and matches it and directly arrives at the place you mention. I'd say at least 50% of my prompts contain a screenshot. I rarely annotate that, that works even better but is slower. A screenshot takes 2 seconds to drag into the terminal.

[Wispr Flow](https://wisprflow.ai/) with semantic correction is still king.

## Web-Based Agents

Lately I experimented again with web agents: Devin, Cursor and Codex. Google's Jules looks nice but was really annoying to set up and Gemini 2.5 just isn't a good model anymore. Things might change soon once we get [Gemini 3 Pro](https://x.com/cannn064/status/1973415142302830878). The only one that stuck is codex web. It also is annoying to setup and broken, the terminal currently [doesn't load correctly](https://x.com/steipete/status/1974798735055192524), but I had an older version of my environment and made it work, with the price of slower wramp-up times.

I use codex web as my short-term issue tracker. Whenever I'm on the go and have an idea, I do a one-liner via the iOS app and later review this on my Mac. Sure, I could do way more with my phone and even review/merge this, but I choose not to. My work is already addictive enough as-is, so when I'm out or seeing friends, I don't wanna be pulled in even more. Heck, I say this as someone [who spent almost two months building a tool to make it easier to code on your phone](https://steipete.me/posts/2025/vibetunnel-first-anniversary).

Codex web didn't even count towards your usage limits, but [these days sadly are numbered](https://x.com/steipete/status/1976292221390553236).

## The Agentic Journey

Let's talk about tools. [Conductor](https://conductor.build/), [Terragon](https://www.terragonlabs.com/), [Sculptor](https://x.com/steipete/status/1973132707707113691) and the 1000 other ones. Some are hobby projects, some are drowning in VC money. I tried so many of them. None stick. IMO they work around current inefficiencies and promote a workflow that just isn't optimal. Plus, most of them hide the terminal and don't show everything the model shows.

Most are thin wrappers around Anthropic's SDK + work tree management. There's no moat. And I question if you even want easier access to coding agents on your phone. The little use case these did for me, codex web fully covers.

I do see this pattern tho that almost every engineer goes through a phase of building their own tools, mostly because it's fun and because it's so much easier now. And what else to build than tools that (we think) will make it simpler to build more tools?

## But Claude Code can Background Tasks!

True. codex currently lacks a few bells and whistles that claude has. The most painful omission is background task management. While it should have a timeout, I did see it get stuck quite a few times with cli tasks that don't end, like spinning up a dev server or tests that deadlock.

This was one of the reasons I reverted back to claude, but since that model is just so silly in other ways, I now use [`tmux`](https://x.com/steipete/status/1977745596380279006). It's an old tool to run CLIs in persistent sessions in the background and there's plenty world knowledge in the model, so all you need to do is "run via tmux". No custom agent md charade needed.

## What about MCPs

Other people wrote plenty about MCPs. IMO most are something for the marketing department to make a checkbox and be proud. Almost all MCPs really should be clis. I say that as someone [who wrote 5 MCPs myself](https://github.com/steipete/claude-code-mcp).

I can just refer to a cli by name. I don't need any explanation in my agents file. The agent will try $randomcrap on the first call, the cli will present the help menu, context now has full info how this works and from now on we good. I don't have to pay a price for any tools, unlike MCPs which are a constant cost and garbage in my context. Use GitHub's MCP and see 23k tokens gone. Heck, they did make it better because it was almost 50.000 tokens when it first launched. Or use the `gh` cli which has basically the same feature set, models already know how to use it, and pay zero context tax.

I did open source some of my cli tools, like [bslog](https://github.com/steipete/bslog) and [inngest](https://github.com/steipete/inngest).

I do use [`chrome-devtools-mcp`](https://developer.chrome.com/blog/chrome-devtools-mcp) these days [to close the loop](https://x.com/steipete/status/1977762275302789197). it replaced Playwright as my to-go MCP for web debugging. I don't need it lots but when I do, it's quite useful to close the loop. I designed my website so that I can create api keys that allow my model to query any endpoint via curl, which is faster and more token-efficient in almost all use cases, so even that MCP isn't something I need daily.

## But the code is slop!

I spend about [20% of my time](https://x.com/steipete/status/1976985959242907656) on refactoring. Ofc all of that is done by agents, I don't waste my time doing that manually. Refactor days are great when I need less focus or I'm tired, since I can make great progress without the need of too much focus or clear thinking.

Typical refactor work is using `jscpd` for code duplication, [`knip`](https://knip.dev/) for dead code, running `eslint`'s `react-compiler` and deprecation plugins, checking if we introduced api routes that can be consolidated, maintaining my docs, breaking apart files that grew too large, adding tests and code comments for tricky parts, updating dependencies, [tool upgrades](https://x.com/steipete/status/1977472427354632326), file restructuring, finding and rewriting slow tests, mentioning modern react patterns and rewriting code (e.g. [you might not need `useEffect`](https://react.dev/learn/you-might-not-need-an-effect)). There's always something to do.

You could make the argument that this could be done on each commit, I do find these phases of iterating fast and then maintaining and improving the codebase - basically paying back some technical debt, to be far more productive, and overall far more fun.

## Do you do spec-driven development?

[I used to back in June](https://steipete.me/posts/2025/the-future-of-vibe-coding). Designing a big spec, then let the model build it, ideally for hours. IMO that's the old way of thinking about building software.

My current approach is usually that I start a discussion with codex, I paste in some websites, some ideas, ask it to read code, and we flesh out a new feature together. If it's something tricky, I ask it to write everything into a spec, give that to GPT-5-Pro for review (via chatgpt.com) to see if it has better ideas (surprisingly often, this greatly improves my plan!) and then paste back what I think is useful into the main context to update the file.

By now I have a good feeling which tasks take how much context, and codex's context space is quite good, so often I'll just start building. Some people are religious and always use a new context with the plan - IMO that was useful for Sonnet, but GPT-5 is far better at dealing with larger contexts, and doing that would easily add 10 minutes to everything as the model has to slowly fetch all files needed to build the feature again.

The far more fun approach is when I do UI-based work. I often start with sth simple and woefully under-spec my requests, and watch the model build and see the browser update in real time. Then I queue in additional changes and iterate on the feature. Often I don't fully know how something should look like, and that way I can play with the idea and iterate and see it slowly come to life. I often saw codex build something interesting I didn't even think of. I don't reset, I simply iterate and morph the chaos into the shape that feels right.

Often I get ideas for related interactions and iterate on other parts as well while I build it, that work I do in a different agent. Usually I work on one main feature and some smaller, tangentially related tasks.

As I'm writing this, I build a new Twitter data importer in my Chrome extension, and for that I reshape the graphql importer. Since I'm a bit unsure if that is the right approach, that one is in a separate folder so I can look at the PR and see if that approach makes sense. The main repo does refactoring, so I can focus on writing this article.

## Show me your slash commands!

I only have a few, and I use them rarely:

- `/commit` (custom text to explain that multiple agents work in the same folder and to only commit your changes, so I get clean comments and gpt doesn't freak out about other changes and tries to revert things if linter fails)
- `/automerge` (process one PR at a time, react to bot comments, reply, get CI green and squash when green)
- `/massageprs` (same as automerge but without the squashing so I can parallelize the process if I have a lot of PRs)
- `/review` (built-in, only sometimes since I have review bots on GH, but can be useful)

And even with these, usually I just type "commit", unless I know that there's far too many dirty files and the agent might mess up without some guidance. No need for charade/context waste when I'm confident that this is enough. Again, you develop intuition for these. I have yet to see other commands that really are useful.

## What other tricks do you have?

Instead of trying to formulate the perfect prompt to motivate the agent to continue on a long-running task, there's lazy workarounds. If you do a bigger refactor, codex often stops with a mid-work reply. [**Queue up continue messages**](https://x.com/steipete/status/1978099041884897517) if you wanna go away and just see it done. If codex is done and gets more messages, [it happily ignores them](https://x.com/steipete/status/1978111714685063640).

Ask the model to **write tests after each feature/fix** is done. Use the same context. This will lead to far better tests, and likely uncover a bug in your implementation. If it's purely a UI tweak, tests likely make less sense, but for anything else, do it. AI generally is bad at writing good tests, it's still helpful tho, and let's be honest - are you writing tests for every fix you make?

Ask the model to **preserve your intent** and “add code comments on tricky parts” helps both you and future model runs.

When things get hard, prompting and **adding some trigger words** like “take your time” “comprehensive” “read all code that could be related” “create possible hypothesis” makes codex solve even the trickiest problems.

## How does your Agents/Claude file look like?

I have an Agents.md file with a symlink to claude.md, since Anthropic decided not to standardize. I recognize that this is difficult and sub-optimal, since [GPT-5 prefers quite different prompting](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide) than Claude. Stop here and read their prompting guide if you haven't yet.

While Claude reacts well to [🚨 SCREAMING ALL-CAPS 🚨 commands](https://x.com/Altimor/status/1975752110164578576) that threaten it that it will imply ultimate failure and 100 kittens will die if it runs command X, that freaks out GPT-5. (Rightfully so). So drop all of that and just use words like a human. That also means that these files can't optimally be shared. Which isn't a problem to me since I mostly use codex, and accept that the instructions might be too weak for the rare instances where claude gets to play.

My Agent file is currently ~800 lines long and feels like a collection of organizational scar tissue. I didn't write it, codex did, and anytime sth happens I ask it to make a concise note in there. I should clean this up at some point, but despite it being large it works incredibly well, and gpt really mostly honors entries there. At least it does far far more often than Claude ever did. (Sonnet 4.5 got better there, to give them some credit)

Next to git instruction it contains an explanation about my product, common naming and API patterns I prefer, notes about React Compiler - often it's things that are newer than world knowledge because my tech stack is quite bleeding edge. I expect that I can again reduce things in there with model updates. For example, Sonnet 4.0 really needed guidance to understand Tailwind 4, Sonnet 4.5 and GPT-5 are newer and know about that version so I was able to delete all that fluff.

Significant blocks are about which React patterns I prefer, database migration management, testing, [using and writing ast-grep rules](https://x.com/steipete/status/1963411717192651154). (If you don't know or don't use ast-grep as codebase linter, stop here and ask your model to set this up as a git hook to block commits)

I also experimented and started using [a text-based "design system"](https://x.com/steipete/status/1973838406099874130) for how things should look, the verdict is still out on that one.

## So GPT-5-Codex is perfect?

Absolutely not. Sometimes it refactors for half an hour and then [panics](https://x.com/steipete/status/1973834765737603103) and reverts everything, and you need to re-run and soothen it like a child to tell it that it has enough time. Sometimes it forgets that it can do [bash commands](https://x.com/steipete/status/1977695411436392588) and it requires some encouragement. Sometimes it replies [in russian or korean](https://x.com/steipete/status/1976207732534300940). [Sometimes the monster slips and sends raw thinking to bash.](https://x.com/steipete/status/1974108054984798729) But overall these are quite rare and it's just so insanely good in almost everything else that I can look past these flaws. Humans aren't perfect either.

My biggest annoyance with codex is that it "loses" lines, so scrolling up quickly makes parts of the text disappear. I really hope this is on top of OpenAI's bug roster, as it's the main reason I sometimes have to slow down, so messages don't disappear.

## Conclusion

Don't waste your time on stuff like RAG, subagents, [Agents 2.0](https://x.com/steipete/status/1977660298367766766) or other things that are mostly just charade. Just talk to it. Play with it. Develop intuition. The more you work with agents, the better your results will be.

[Simon Willison's article makes an excellent point](https://simonwillison.net/2025/Oct/7/vibe-engineering/) - many of the skills needed to manage agents are similar to what you need when [managing engineers](https://x.com/lukasz_app/status/1974424549635826120) - almost all of these are characteristics of senior software engineers.

And yes, [writing good software is still hard](https://x.com/svpino/status/1977396812999688371). Just because I don't write the code anymore doesn't mean I don't think hard about architecture, system design, dependencies, features or how to delight users. Using AI simply means that expectations what to ship went up.

PS: This post is 100% organic and hand-written. I love AI, I also recognize that some things are just better done the [old-fashioned](https://x.com/Alphafox78/status/1975679120898965947) way. Keep the typos, keep my voice. [🚄✌️](https://x.com/rohanpaul_ai/status/1977005259567595959)

PPS: Credit for the header graphic goes to [Thorsten Ball](https://x.com/thorstenball/status/1976224756669309195).
