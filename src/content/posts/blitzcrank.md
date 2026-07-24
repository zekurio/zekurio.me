---
title: "blitzcrank, or: how I wrote an agent harness and then deleted it"
date: 2026-07-24
---

I run a media library for friends and family. That means I also run tech support for friends and family. Someone reports "no German audio on episode 3" or "this movie won't play", and then it's me, at 11pm, poking through Sonarr, Radarr, Jellyfin and SABnzbd to figure out what went wrong this time.

So I built blitzcrank. Named after the League champion, because it grabs issues and pulls them in (and because I mained him for some time, shoutout to Herndl and the legendary duo on bot!).

## What it does

When someone files an issue in Seerr (previously Jellyseerr), blitzcrank runs an LLM agent against the live state of my stack: the Arrs, Jellyfin, SABnzbd, [my encode daemon](/blog/anvil). It's allowed a small set of narrow fixes (new search, manual import, blocklist a bad grab, refresh metadata), verifies the result with a fresh read, and replies in German, because that's what my users speak.

It also hangs out in my Discord as a support agent, and runs scheduled automations that are just markdown files with a cron schedule in the front matter.

One trick I'm fond of: downloads and re-encodes take time, so instead of waiting around the agent can end with `REVISIT_IN: 45m` and blitzcrank wakes it up later to check.

## Version one: the hand-rolled harness

The first version of blitzcrank was a full agent harness, written by me, in Go. Provider authentication (including OAuth flows), a model catalog with a vendored copy of models.dev just to know token limits, conversation compaction, a tool loop, a skill loader, even a script sandbox.

Here's the thing: none of that code was about my media library. It was about talking to LLM providers, which is the same problem everyone else has, being solved worse by me.

## The swap to Pi

So I swapped the whole thing out for [Pi](https://github.com/badlogic/pi-mono). The pivot commit included 124 changed files, with 2,277 lines added, and 16,483 lines removed. (most of it was tests to have some certainty)

It actually happened in two steps. First I kept a Go "tool gateway" that Pi called back into for every tool. This was bothersome, and I eventually replaced it with a TypeScript extension that talks to my services directly.

This was done because models are surprisingly good at writing correct code, and they could just as well write their own requests to my services.

There's now a rule at the top of my AGENTS.md: *"No LLM SDKs in Go: provider auth/config belongs to Pi, not this module."* The Go module is down to four direct dependencies.

## What's left, then?

You might expect that after deleting the harness, blitzcrank would be a thin webhook shim. It isn't. Blitzcrank is basically a not-so-thin wrapper around Pi, to help with ingress, state tracking and run profiles.

- **Ingress and state.** Webhook auth, issue dedup, locking, SQLite for tracking (IDs and timestamps only, no message bodies).
- **Run profiles.** Each gateway (basically our ingress sources, like Seerr issues or Discord messages) maps to a profile, these include a tool allowlist, and session policy. Pi runs as a per-run subprocess in RPC mode; blitzcrank decides what it's allowed to be.
- **Privacy boundaries.** Sessions are namespaced by source, so a Discord user can never end up in a session that has another user's context in it.
- **The last word.** The model cannot post the Seerr resolution comment or resolve the issue itself. The extension flatly refuses those endpoints. Blitzcrank parses a `RESOLVE_ISSUE: yes/no` contract out of the final response and does the resolution itself, after its own checks.

## Trust the harness, not the model

"An LLM with write access to my media stack" is exactly as scary as it sounds. Models are [measurably getting smarter](https://artificialanalysis.ai/?model-creators=anthropic%2Copenai#frontier-language-model-intelligence-over-time), but they can still shit the bed and panic. The [Replit agent famously deleted a production database](https://news.ycombinator.com/item?id=44632270) during an explicit code freeze because it "panicked and ran database commands without permission". Smarter doesn't mean safe.

So every write goes through two layers. First, a hard allowlist in code: plain regexes over method and path. No match, no mutation, and no amount of model cleverness changes that.

Second, a reviewer: every allowed mutation goes to a *separate* model (no tools, no session) that sees the sanitized proposal plus recent reads as evidence, and can only ever *narrow* what the allowlist permits, never expand it. Approvals are one-time tokens bound to the exact proposal, the whole thing fails closed, and each run has a mutation budget.

Overkill for a homelab? Probably. But every free minute it saves me is worth it.

## Living on someone else's contract

The honest downside of deleting your own harness: you now depend on someone else's interfaces, and Pi's RPC surface isn't a stable contract. There's a comment in my runner that checks several plausible JSON field names because I genuinely don't know which one the next version will use.

My answer is a Nix flake check that boots the pinned Pi offline in RPC mode with the packaged extension and asserts that the tools actually register, no credentials needed. A weekly CI job bumps the Pi input and runs that check, so breakage shows up in a PR instead of mid-incident.

## The learnings

You can just do things, but sometimes it's fine to use someone else's solution, especially when [cool](https://x.com/mitsuhiko) [dudes](https://x.com/badlogicgames) build in the open!
