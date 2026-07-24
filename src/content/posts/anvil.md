---
title: "anvil, where media gets hammered into shape"
date: 2026-07-25
---

My library has a problem: releases are huge, full of audio and subtitle tracks nobody uses, and my server has an Arc A380, which sits idle most of the time.

Other solutions like Tdarr and Fileflows are quite capable, but simply too much. Like, I don't need another web interface for a set-it-and-forget-it solution.

## How it fits in

Anvil can either scan a directory for files, process them and replace the original, this is "library" mode. Or it can watch a directory for new files, process them and drop the result into a handoff directory that Sonarr and Radarr import from, this is "download" mode.

## What an encode looks like

[ab-av1](https://github.com/alexheretic/ab-av1) does the quality search (96 vmaf for me, with some savings, depends on content), anvil owns the final ffmpeg command on the Arc via QSV. If no encode can hit both targets, anvil doesn't fail the job. It falls back to remuxing: keeps the original video, still cleans up audio, subtitles and metadata.

And it's honest about it. Outputs get tagged `anvil.processed=true`, but only real encodes get `anvil.encoded=true`. A remux says it's a remux instead of claiming a shiny new AV1 encode.

## The boring parts are the point

Encodes take an hour and the box will crash eventually, so most of anvil is crash-proofing. Jobs are leased with heartbeats, a recovery loop requeues anything whose lease expired. Expensive steps like the VMAF search are checkpointed, so a restart mid-job doesn't redo 40 minutes of searching. And publishing a file follows a journal: sync the file, sync the directory, then advance SQLite, so a crash can leave the filesystem one step ahead but never in a state a retry can't prove and replay. Publication never overwrites an existing destination, period.

From my AGENTS.md: *"Priorities, in order: reliability, data safety, predictable behavior under cancellation, then performance."* Performance is last on purpose.

## War stories

Real media is cursed. Embedded cover art shows up as an extra video stream, and feeding it to the encoder makes QSV die with "Picture size 0x0 is invalid". HDR letterbox bars aren't actually black, so crop detection kept guessing wrong until it sampled multiple windows. And Dolby Vision is its own saga: extract the RPU, inject it after encoding, remux, then discover that the remux ate the MKV tags. Every one of those is a commit now.

## The blitzcrank connection

Anvil also exposes a read-only unix socket that reports facts: daemon status, jobs, leases, publications. No opinions, no "wait_recommended". That's deliberate, because [blitzcrank](/blog/blitzcrank) reads it, and the policy of what those facts *mean* (like "an expired lease is stuck work, not healthy waiting") lives in blitzcrank's prompts, not in anvil.
