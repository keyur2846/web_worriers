# Cinematic Section — Zone Table

Total section: **1880vh** (single unified section replacing soldier, airforce, vikrant sections)

| Zone | vh | Progress Start | Progress End | Frames | Purpose |
|------|-----|---------------|-------------|--------|---------|
| Army salute | 350 | 0.0000 | 0.1862 | 0–119 | Slow frame playback (~2.9vh/frame) |
| Army dwell | 100 | 0.1862 | 0.2394 | frozen 119 | Army info shows on last saluting frame |
| Army fade | 30 | 0.2394 | 0.2553 | frozen 119 | Army info fades out, soldier re-centers |
| Eye-zoom | 100 | 0.2553 | 0.3085 | 120–159 | Desert→dark BG transition |
| Jet | 500 | 0.3085 | 0.5745 | 160–399 | Slow AF frame playback (~2.08vh/frame) |
| AF dwell | 100 | 0.5745 | 0.6277 | frozen 399 | AF info shows on last jet frame |
| AF fade | 30 | 0.6277 | 0.6436 | frozen 399 | AF info fades out |
| Carrier | 500 | 0.6436 | 0.9096 | 400–639 | Slow Navy frame playback (~2.08vh/frame) |
| Navy dwell | 100 | 0.9096 | 0.9628 | frozen 639 | Navy info shows on last carrier frame |
| Navy fade | 70 | 0.9628 | 1.0000 | frozen 639 | Navy info fades out |

## Frame Directory Mapping

| Global Index | Directory | File Pattern |
|-------------|-----------|-------------|
| 0–119 | army-saluting/ | frame-001.png → frame-120.png |
| 120–159 | army-eyezoom/ | frame-001.png → frame-040.png |
| 160–399 | jet-transition/ | frame-001.jpg → frame-240.jpg |
| 400–639 | carrier-reveal/ | frame-001.jpg → frame-240.jpg |

## Full Page Layout (2080vh total)

| Section | vh |
|---------|-----|
| Hero | 100 |
| Cinematic | 1880 |
| Mission Select | 100 |

## SCENE_CONFIGS (HUD progress ranges)

| Scene | Start | End |
|-------|-------|-----|
| Hero | 0.00 | 0.05 |
| Indian Army | 0.05 | 0.33 |
| Indian Air Force | 0.33 | 0.63 |
| Indian Navy | 0.63 | 0.95 |
| Mission Selection | 0.95 | 1.00 |

## Info Display Pattern

Each branch follows this pattern:
1. Frame sequence plays at ~2-3vh per frame (slow, cinematic)
2. Last frame of folder freezes → **100vh dwell zone**
3. During dwell: heading slides in → description + panel fade in → tooltips stagger in
4. After dwell: **30-70vh fade zone** where info fades out completely before next sequence
5. Next frame sequence begins

## Scroll Flow

```
[Army salute 120 frames] → [FREEZE frame 119 + Army Info 100vh] → [fade 30vh]
→ [Eye-zoom 40 frames] → [Jet 240 frames] → [FREEZE frame 399 + AF Info 100vh] → [fade 30vh]
→ [Carrier 240 frames] → [FREEZE frame 639 + Navy Info 100vh] → [fade 70vh]
```
