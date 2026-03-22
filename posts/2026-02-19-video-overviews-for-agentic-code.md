---
layout: post
tags: post
title: "Fighting Cognitive Debt in Agentic Code with Video Overviews"
description: "When AI writes your code, understanding doesn't come along for the ride. What if the same codebase that builds the software also generates narrated video walkthroughs that explain it?"
bigshot: bigshot.png
---

_AI writes code faster than I can understand it — so now the system generates narrated videos of itself._

I used [Claude Code](https://claude.ai/code) to build [Vamos](https://github.com/fdb/vamos), a polyphonic synthesizer plugin in C++20, based on Ableton's Drift. A working synth in a few hours — but since I didn't write any of the code, I'm missing the crucial part: understanding what was actually implemented.

Margaret-Anne Storey [calls this "cognitive debt"](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/): gaps in human comprehension that widen even when the code itself is perfectly fine. Agentic coding amplifies this — the code arrives faster than your ability to absorb it. So I tried something different: **what if the synth code also generates narrated video walkthroughs that explain it?** Using [Remotion](https://www.remotion.dev/) for programmatic video and [ElevenLabs](https://elevenlabs.io/) for voice-over, the whole thing feels like a natural YouTube series.

![The Vamos synthesizer UI — dark synthwave theme with signal flow, knobs, and modulation controls](/media/blog/video-overviews-for-agentic-code/vamos-ui.png)

![Signal flow diagram from the video: Osc1 + Osc2 + Noise → Mixer → Filter → Amp Envelope → Output](/media/blog/video-overviews-for-agentic-code/ep01-signal-flow.png)

Here's the first episode — an 8-minute walkthrough of Phase 1, from an empty project to a working eight-voice polyphonic synth:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/B-rts5qSmZY" allowfullscreen="allowfullscreen"></iframe>
</div>

## The video pipeline

The videos are built with Remotion — each visual element (code blocks, waveform visualizers, architecture diagrams) is a React component that animates based on frame count. Because these are code, you can create domain-specific visualizations. Here's an ADSR envelope, color-coded by phase, with the overshoot line clearly marked:

![Color-coded ADSR envelope with overshoot line at 1.2](/media/blog/video-overviews-for-agentic-code/ep01-adsr.png)

The production workflow has two passes:

**Pass 1: Structure and mute review.** Claude Code outlines the episode, writes the narration transcript, and builds the Remotion scenes — but doesn't generate audio yet. Instead, it renders a mute video with burned-in captions. I review, give feedback, Claude Code adjusts and re-renders. This is where most of the iteration happens, without spending TTS credits.

**Pass 2: Voiceover and retiming.** Once the mute video looks right, Claude Code generates voiceover through ElevenLabs. The audio durations then dictate final timing: each segment's length gets converted to frames, and scene durations are recalculated to match.

A useful ElevenLabs detail: since each narration segment is a separate API call, voice quality can drift between segments. The generation script passes adjacent segment text as context (`previous_text` / `next_text`) and chains request IDs, so each segment is conditioned on the actual audio of the one before it.

The result is that code and visuals work together in ways that comments never can. When SmoothedValue code appears alongside a before/after waveform comparison — the click artifact versus the smooth ramp — you *see* why it matters:

![SmoothedValue: code plus before/after waveform comparison showing click versus smooth ramp](/media/blog/video-overviews-for-agentic-code/ep01-smoothed-value.png)

## Where this could go

Three levels of video overview worth exploring:

**"In the weeds"** — You open a PR, and a two-minute narrated video walks the reviewer through the changes.

**"Diving back in"** — You return from vacation, hit a button, and a video catches you up on what changed while you were away.

**"Archaeology"** — Historical deep dives that capture the *reasoning* behind decisions, the part that's hardest to recover from code alone.

![Waveform shape visualizer from Episode 2 — saw, rectangle, sharktooth, and saturated waveforms responding to a shape parameter](/media/blog/video-overviews-for-agentic-code/ep02-waveforms.png)

Video isn't necessarily the final form — Simon Willison has been exploring [web comics](https://simonwillison.net/2026/Feb/17/release-notes-webcomic/) for the same purpose. But the pattern of narration-driven explanation (structure → transcript → mute review → TTS + retiming) works well and isn't specific to any particular type of code.

The code has become easy. Understanding is the hard part.
