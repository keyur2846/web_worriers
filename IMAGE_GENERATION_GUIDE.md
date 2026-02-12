# Image Generation Guide — Nano Banana Pro

All images must be **PNG with transparent background** (alpha channel) unless noted otherwise.
Place generated images in: `app/public/images/`

---

## GENERATION TIPS

- Always specify **"transparent background"** or **"isolated on transparent background"** or **"no background"** or **"alpha channel"** in your prompt
- For wide panoramic images, generate at the widest aspect ratio available and crop if needed
- For cutout subjects (soldier, tank, jet), generate the subject centered with plenty of padding around edges
- After generation, verify the background is truly transparent (not white)
- If the tool doesn't support transparency, generate on a solid green/blue screen and remove background manually

---

## HIGH PRIORITY — Core Subjects (Generate These First)

---

### 1. `soldier.png`
**Dimensions:** 1200 × 1800 (portrait, tall)
**Used in:** Scene 2 (Soldier Reveal), Scene 3 (Combined Arms)
**Aspect Ratio:** 2:3 portrait

**Prompt:**
```
Full body portrait of an Indian Army soldier in modern combat gear, standing in a confident tactical stance, facing slightly left (3/4 view). Wearing olive green/camouflage combat uniform, bulletproof vest (BPJ Level IV), advanced combat helmet with mounted comms equipment, tactical gloves, and combat boots. Carrying an AK-203 assault rifle held across chest. Shoulder patch visible with Indian flag insignia. Highly detailed photorealistic rendering, dramatic military lighting from upper left, strong rim lighting on edges. Full body visible from helmet to boots. Isolated on transparent background, no background, clean cutout edges. Professional military photography style, sharp details, high resolution.
```

**Key details to verify:**
- Full body visible (head to boots)
- Indian Army uniform (not US/British)
- AK-203 rifle (curved magazine, modern stock)
- Clean transparent edges around the entire figure

---

### 2. `tank-arjun.png`
**Dimensions:** 1600 × 900 (landscape, wide)
**Used in:** Scene 3 (Combined Arms)
**Aspect Ratio:** 16:9

**Prompt:**
```
Indian Army Arjun Main Battle Tank Mk-II, viewed from a dramatic 3/4 front-right angle, slightly low camera angle looking up at the tank making it appear imposing and powerful. The tank is desert sand/olive drab color with Indian Army markings. Visible features: long 120mm rifled main gun barrel, Kanchan composite armor panels, distinctive turret shape, track skirts, smoke grenade launchers on turret sides. Tank appears battle-ready in a static display pose. Photorealistic rendering with dramatic lighting, strong shadows underneath. Isolated on transparent background, no background, clean edges. Military equipment photography style, sharp metallic details, high resolution.
```

**Key details to verify:**
- Arjun tank specifically (NOT T-90 or Leopard — Arjun has a distinctive flat-faced turret)
- 3/4 angle shows both front and side
- Desert/olive paint scheme
- Clean cutout with transparent background

---

### 3. `tejas.png`
**Dimensions:** 1400 × 800 (landscape)
**Used in:** Scene 6 (Air Force), Scene 7 (Carrier Landing)
**Aspect Ratio:** 7:4

**Prompt:**
```
HAL Tejas Light Combat Aircraft (LCA) in flight, banking slightly to the left showing its top surface and delta wing planform. Indian Air Force livery with light grey upper surfaces and darker grey undersides, HAL roundel (Indian tricolor circle) clearly visible on fuselage and wings. Single-engine delta wing fighter with no canards, distinctive pointed nose cone, single vertical tail fin. Carrying underwing missiles (Derby/Astra BVR missiles). Visible details: pitot tube, cockpit canopy with pilot silhouette, air intake under fuselage. Captured in a dynamic banking turn at altitude. Photorealistic, sharp details, dramatic lighting from above-right simulating sunlight. Isolated on transparent background, no background, no sky, no clouds. Aviation photography style, high resolution.
```

**Key details to verify:**
- Delta wing shape (NO canards — Tejas is a pure delta)
- Single engine, single vertical tail
- Indian Air Force roundel (saffron-white-green circle)
- Banking angle (not flat/level — needs to look dynamic)
- Transparent background (no blue sky)

---

### 4. `carrier-deck.png`
**Dimensions:** 1600 × 1000 (landscape)
**Used in:** Scene 7 (Carrier Landing)
**Aspect Ratio:** 8:5

**Prompt:**
```
Aircraft carrier flight deck viewed from an approaching pilot's perspective, looking down at the deck from a slight angle above and behind. The deck shows the landing area with white painted deck markings, arresting wires visible across the deck, a ski-jump ramp at the far end (STOBAR configuration like INS Vikrant). Deck is grey steel with non-skid coating texture. A few parked aircraft visible on the side (small, not prominent). The deck fills most of the frame. Ocean water visible on the sides of the carrier hull. Warm golden hour lighting. Photorealistic, high detail on deck textures and markings. The sky/upper portion should be transparent, deck and ship hull are solid. Clean edges where deck meets sky. High resolution, cinematic military photography style.
```

**Key details to verify:**
- STOBAR configuration (ski-jump ramp, NOT catapult — this is Indian Navy style)
- Deck markings and arresting wires visible
- Perspective from approaching aircraft (slightly above, looking down)
- Sky area transparent, deck solid

---

### 5. `vikrant-aerial.png`
**Dimensions:** 1800 × 1000 (landscape, wide)
**Used in:** Scene 8 (Vikrant Reveal)
**Aspect Ratio:** 9:5

**Prompt:**
```
INS Vikrant (IAC-1) Indian Navy aircraft carrier seen from a high aerial bird's-eye view, slightly angled (not perfectly top-down, about 30-40 degrees from above). The full ship is visible from bow to stern. Visible features: ski-jump ramp at bow, angled flight deck, island superstructure on the starboard side, aircraft parked on deck (MiG-29K fighters), grey hull cutting through deep blue ocean water creating a white wake trail behind. The ship is approximately 262 meters long. Dramatic aerial photography with clear sunlight from above. The ship should be the clear focal point. Isolated on transparent background — the ocean water around the ship should fade to transparent at the edges (not a hard rectangle of ocean). High resolution, military aerial reconnaissance photography style.
```

**Key details to verify:**
- Aerial/bird's-eye angle (looking DOWN at the ship)
- Ski-jump ramp visible at bow
- Island superstructure on right side
- Background fades to transparent (not hard ocean edges)

---

### 6. `flag-waving.png`
**Dimensions:** 1600 × 1000 (landscape)
**Used in:** Scene 1 (Flag Section)
**Aspect Ratio:** 8:5

**Prompt:**
```
Indian national flag (tricolor) waving majestically in the wind, captured at the moment of a full dramatic wave/ripple. The flag shows three horizontal stripes: deep saffron (top), white (middle), and India green (bottom), with the navy blue Ashoka Chakra (24-spoke wheel) centered on the white stripe. The fabric shows realistic cloth physics with deep folds, shadows in the creases, and light catching the peaks of the waves. The flag is attached to a flagpole on the left side (hoist side). Dramatic patriotic lighting with warm golden sunlight illuminating the fabric. Photorealistic fabric texture, you can see the weave of the cloth. Isolated on transparent background, no sky, no background. Clean edges around the waving fabric. High resolution.
```

**Key details to verify:**
- Correct stripe order: saffron (top), white (middle), green (bottom)
- Ashoka Chakra (24 spokes) in navy blue on white stripe
- Realistic fabric physics (not flat/stiff)
- Flagpole on left side
- Transparent background

---

### 7. `desert-terrain.png`
**Dimensions:** 2400 × 800 (ultra-wide panoramic)
**Used in:** Scene 2 (Soldier Reveal), Scene 3 (Combined Arms)
**Aspect Ratio:** 3:1 panoramic

**Prompt:**
```
Wide panoramic view of the Thar Desert / Rajasthan desert landscape, showing rolling sand dunes stretching across the entire frame from left to right. Golden-brown sand with wind-carved ripple patterns on the dune surfaces. A few sparse desert scrub bushes scattered in the mid-ground. The terrain transitions from detailed sand in the foreground to softer, hazier dunes in the distance. Warm desert lighting, late afternoon golden hour with long shadows from the dunes. The sky/upper portion should be completely transparent — only the sand dunes and terrain are visible, fading to transparent at the top edge. The bottom edge is solid sand. Photorealistic, cinematic desert landscape photography, ultra-wide panoramic format, high resolution.
```

**Key details to verify:**
- Ultra-wide panoramic (3:1 ratio)
- Top edge fades to transparent (this is a LAYER, not a full scene)
- Sand dunes stretch across full width
- Indian desert style (Thar/Rajasthan, not Sahara)

---

## MEDIUM PRIORITY — Environment/Atmosphere

---

### 8. `clouds-high.png`
**Dimensions:** 2400 × 600 (ultra-wide, thin strip)
**Used in:** Scene 6 (Air Force — highest cloud layer)
**Aspect Ratio:** 4:1

**Prompt:**
```
Thin wispy cirrus clouds at very high altitude, stretched across a wide panoramic frame. Delicate ice crystal cloud formations, translucent and ethereal, scattered across the frame with gaps of transparent sky between them. The clouds are bright white with slight blue-grey shadows. Very thin, feathery texture like brushstrokes across the sky. The entire background must be transparent — only the cloud wisps themselves are visible. Isolated clouds on transparent background, no blue sky, no gradient. Photorealistic high-altitude cloud photography, panoramic ultra-wide format, high resolution.
```

---

### 9. `clouds-mid.png`
**Dimensions:** 2400 × 800 (ultra-wide)
**Used in:** Scene 6 (Air Force — middle cloud layer)
**Aspect Ratio:** 3:1

**Prompt:**
```
Mid-altitude cumulus clouds, fluffy white clouds with defined shapes and grey shadow areas underneath. Multiple cloud formations spread across a wide panoramic frame. The clouds have volume and depth — bright white tops catching sunlight, darker grey-blue undersides. Some gaps between clouds showing transparent sky. Various sizes from small puffs to larger cumulus buildups. The entire background must be transparent — only the cloud masses themselves are visible, no blue sky gradient. Photorealistic cumulus cloud photography, panoramic format, high resolution. Isolated on transparent background.
```

---

### 10. `clouds-distant.png`
**Dimensions:** 2000 × 400 (wide, thin strip)
**Used in:** Scene 1 (Flag Section — distant background clouds)
**Aspect Ratio:** 5:1

**Prompt:**
```
Very distant, soft, hazy cloud bank along the horizon line. A thin horizontal strip of atmospheric clouds, slightly blurred and low contrast as if seen from far away. Soft white and light grey tones, blending gently. The clouds sit in the lower portion of the frame in a horizontal band. Edges are very soft and fade to transparent gradually — no hard edges anywhere. The entire background is transparent, only the soft distant cloud haze is visible. Atmospheric perspective, photorealistic, panoramic format, high resolution. Dreamy, ethereal quality.
```

---

### 11. `clouds-foreground.png`
**Dimensions:** 2000 × 400 (wide, thin strip)
**Used in:** Scene 6 (Air Force — closest cloud layer, passes in front of everything)
**Aspect Ratio:** 5:1

**Prompt:**
```
Close-up cloud wisps as if flying through clouds at high speed, translucent and streaky. The clouds are soft, blurred, and stretched horizontally suggesting motion and speed. White and light grey with high transparency — you can almost see through them. Scattered across the frame in loose wisps and tendrils, not solid masses. These are the kind of clouds that would streak past a fighter jet's canopy. Very soft edges fading to fully transparent. Background is completely transparent, only the wispy cloud streaks are visible. Photorealistic, motion-blurred cloud photography from inside a cockpit, panoramic format, high resolution.
```

---

### 12. `ocean-surface.png`
**Dimensions:** 2400 × 800 (ultra-wide)
**Used in:** Scene 7 (Carrier Landing), Scene 8 (Vikrant Reveal)
**Aspect Ratio:** 3:1

**Prompt:**
```
Deep blue ocean water surface viewed from above at a slight angle, showing realistic wave patterns and ocean texture. The water is a rich deep navy blue with lighter blue-white wave crests and foam patterns. Gentle ocean swells creating a natural wave pattern across the entire frame. Sunlight reflecting off the water surface creating subtle sparkle highlights. This is a texture/environment layer — the image should fill the entire frame edge to edge with ocean water (NO transparent background for this one — it's a solid texture). The water should look like the Arabian Sea / Indian Ocean. Photorealistic ocean surface photography, shot from moderate altitude, panoramic format, high resolution.
```

**Note:** This is one of the few images that does NOT need transparency — it's a solid texture fill.

---

### 13. `scope-view-bg.png`
**Dimensions:** 1600 × 1600 (square)
**Used in:** Scene 4 (Scope View — background through the scope)
**Aspect Ratio:** 1:1

**Prompt:**
```
View of a desert military battlefield as seen through a rifle scope or binoculars. The scene shows arid terrain with a military vehicle (tank or armored vehicle) in the mid-distance, partially obscured by heat haze. Desert sand terrain with sparse vegetation. The image has a slight warm color cast and reduced contrast as if looking through optics. A subtle circular vignette darkening the edges (as if looking through a scope tube). The scene should feel tense and observational — like a sniper's view. Do NOT include crosshairs or reticle markings (those will be added as SVG overlay). Photorealistic, military observation photography style, square format, high resolution. Solid image — no transparency needed.
```

**Note:** Square format (1:1). No transparency needed. Do NOT include crosshairs — those are added via SVG.

---

### 14. `fabric-texture.png`
**Dimensions:** 512 × 512 (square, tileable)
**Used in:** Scene 1 (Flag Section — overlaid on flag during zoom)
**Aspect Ratio:** 1:1

**Prompt:**
```
Seamless tileable texture of military-grade cotton canvas fabric, zoomed in close to show the weave pattern. Khaki/olive drab colored woven fabric with visible thread crossings in a tight plain weave pattern. The texture should be perfectly seamless/tileable — left edge matches right edge, top edge matches bottom edge. Even lighting with no shadows or gradients. Neutral color (can be tinted via CSS later). Think of the fabric of an Indian Army uniform or flag cloth when viewed up close. High resolution texture, macro photography of fabric weave, seamless pattern, 512x512 pixels.
```

**Note:** Must be **seamless/tileable** — edges must match for CSS repeating.

---

## LOW PRIORITY — Detail Layers

---

### 15. `desert-rocks.png`
**Dimensions:** 1800 × 600 (wide)
**Used in:** Scene 2 (Soldier Reveal — mid-ground depth layer)
**Aspect Ratio:** 3:1

**Prompt:**
```
Wide panoramic view of mid-ground desert rock formations and boulders, Rajasthani sandstone rocks in reddish-brown and golden tones. Various sized rocky outcrops and formations scattered across the frame. The rocks sit on sandy ground in the lower portion. The upper portion and gaps between rocks should be completely transparent — only the rocks and immediate ground around them are visible. These are environmental depth elements, not dramatic landscape features. Warm desert lighting with subtle shadows. Photorealistic, isolated on transparent background, panoramic format, high resolution. Edges of rocks are clean and sharp against the transparent background.
```

---

### 16. `sand-foreground.png`
**Dimensions:** 2000 × 300 (ultra-wide, thin strip)
**Used in:** Scene 2 (Soldier Reveal — closest foreground layer)
**Aspect Ratio:** 20:3

**Prompt:**
```
Extreme close-up of desert sand as a thin horizontal foreground strip. Sand grains, small pebbles, and slight dust visible in high detail in the lower portion. The sand is at the very bottom of the frame and quickly fades to fully transparent as you move upward. This represents sand/ground that's very close to the camera — slightly out of focus/blurred due to depth of field. Warm golden sand tones. Think of a photographer lying on the ground with sand just below the lens. Only the bottom 30-40% should have visible sand, the rest is transparent. Photorealistic, shallow depth of field, panoramic format, high resolution. Transparent background above the sand line.
```

---

### 17. `dust-cloud.png`
**Dimensions:** 800 × 400 (medium)
**Used in:** Scene 3 (Combined Arms — dust behind tank)
**Aspect Ratio:** 2:1

**Prompt:**
```
A soft, billowing dust cloud as kicked up by a heavy military vehicle driving through desert sand. The dust is a warm golden-brown color, thicker and more opaque in the center, gradually becoming more transparent and diffused at the edges. Soft, organic cloud shape — not perfectly round, with wispy tendrils at the edges. The dust appears to be drifting to the right (as if the vehicle passed from right to left). The entire background is transparent — only the dust cloud itself is visible. Photorealistic dust/particle photography, isolated on transparent background, high resolution. Soft edges fading to full transparency.
```

---

### 18. `escort-ships.png`
**Dimensions:** 600 × 200 (wide, small)
**Used in:** Scene 8 (Vikrant Reveal — small escort vessels)
**Aspect Ratio:** 3:1

**Prompt:**
```
Two small Indian Navy escort warships (frigates or destroyers) seen from high above at an aerial angle, similar to satellite or aerial reconnaissance view. The ships are small in the frame, one positioned to the left and one to the right, with space between them. Dark grey naval vessels with visible deck structures. These are escort ships accompanying an aircraft carrier — they should look small and distant. The ships are cutting through water leaving small wake trails. The entire background must be transparent — no ocean water, just the ship silhouettes and their immediate white wake spray. Very small detailed ships isolated on transparent background. Military aerial photography style, high resolution.
```

---

### 19. `terrain-silhouette.png` (OPTIONAL)
**Dimensions:** 2400 × 400 (ultra-wide, thin strip)
**Used in:** Scene 9 (Mission Select — dark background mountain range)
**Aspect Ratio:** 6:1

**Prompt:**
```
Dark mountain range silhouette along the horizon, reminiscent of the Himalayas or mountain ranges along India's northern border. The mountains are rendered as a solid dark silhouette (very dark grey, almost black) against a transparent background. Multiple peaks of varying heights creating an interesting skyline. The silhouette sits in the lower portion of the frame. This is purely a decorative atmospheric element — no detail needed inside the mountains, just the outline shape. The style should be dramatic and moody. Dark silhouette on transparent background, panoramic ultra-wide format, high resolution. Think of mountains seen at dusk when they appear as pure dark shapes.
```

---

## Quick Reference Checklist

| # | Filename | Size | Transparent BG? | Priority |
|---|----------|------|:---:|----------|
| 1 | `soldier.png` | 1200×1800 | YES | HIGH |
| 2 | `tank-arjun.png` | 1600×900 | YES | HIGH |
| 3 | `tejas.png` | 1400×800 | YES | HIGH |
| 4 | `carrier-deck.png` | 1600×1000 | PARTIAL (sky only) | HIGH |
| 5 | `vikrant-aerial.png` | 1800×1000 | YES (edges fade) | HIGH |
| 6 | `flag-waving.png` | 1600×1000 | YES | HIGH |
| 7 | `desert-terrain.png` | 2400×800 | PARTIAL (top fades) | HIGH |
| 8 | `clouds-high.png` | 2400×600 | YES | MEDIUM |
| 9 | `clouds-mid.png` | 2400×800 | YES | MEDIUM |
| 10 | `clouds-distant.png` | 2000×400 | YES | MEDIUM |
| 11 | `clouds-foreground.png` | 2000×400 | YES | MEDIUM |
| 12 | `ocean-surface.png` | 2400×800 | **NO** (solid fill) | MEDIUM |
| 13 | `scope-view-bg.png` | 1600×1600 | **NO** (solid fill) | MEDIUM |
| 14 | `fabric-texture.png` | 512×512 | **NO** (tileable) | MEDIUM |
| 15 | `desert-rocks.png` | 1800×600 | YES | LOW |
| 16 | `sand-foreground.png` | 2000×300 | YES (top fades) | LOW |
| 17 | `dust-cloud.png` | 800×400 | YES | LOW |
| 18 | `escort-ships.png` | 600×200 | YES | LOW |
| 19 | `terrain-silhouette.png` | 2400×400 | YES | LOW (optional) |

---

## After Generating

1. Name files **exactly** as listed above (lowercase, hyphens)
2. Place all images in: `app/public/images/`
3. Verify transparent backgrounds are actually transparent (not white)
4. For best results, optimize PNGs with a tool like TinyPNG to reduce file size
5. The website will use CSS `filter` properties to adapt images to different themes (day-ops, night-ops, tactical), so generate images in natural/neutral colors — don't apply any heavy color grading

---

## Generation Order (Recommended)

Start with HIGH priority subjects — these are the hero elements of each section:

1. `soldier.png` — Needed for 2 scenes
2. `tejas.png` — Needed for 3 scenes (air force + carrier landing)
3. `flag-waving.png` — Hero of Scene 1
4. `tank-arjun.png` — Hero of Scene 3
5. `vikrant-aerial.png` — Hero of Scene 8
6. `desert-terrain.png` — Background for 2 scenes
7. `carrier-deck.png` — Hero of Scene 7

Then MEDIUM (environment layers), then LOW (detail enhancement).
