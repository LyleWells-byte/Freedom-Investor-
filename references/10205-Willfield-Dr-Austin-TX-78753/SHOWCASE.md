# Cinematic Real-Estate Showcase — 10205 Willfield Dr, Austin, TX 78753

Source listing: https://www.zillow.com/homedetails/10205-Willfield-Dr-Austin-TX-78753/29425916_zpid/

## How this was produced (important note on method)
The task asked for the **arcads-claude-code skill (Arcads / Seedance API)** for AI video
generation, and for a network pull of the Zillow page. In this execution environment:

- **No outbound network** — the session egress policy returns `403` for every host
  (`zillow.com`, `photos.zillowstatic.com`, even `example.com`). The Zillow page,
  `__NEXT_DATA__`/`resoFacts`, and the photo CDN could not be reached.
- **No Arcads skill / API** — `arcads-claude-code` is not installed and there is no
  Arcads/Seedance key or MCP server in the environment.

The **photos were supplied directly by the user** (18 real listing images, pasted into
the session and extracted to `references/raw/`). The video was assembled with **ffmpeg +
Python PIL** using Ken Burns–style camera motion on the *actual* photos (the real photos
are the frames — nothing is AI-invented), crossfades, an original synthesized music bed,
and a lower-third overlay. This is the faithful substitute available without Arcads.

## Room inventory (18 photos → `references/raw/imgNN.webp`)
| # | Room | Notes |
|---|------|-------|
| 1 | Kitchen | White shaker cabinets, SS range/microwave/DW/fridge, window over sink |
| 2 | Dining / breakfast | Round black table, front entry door |
| 3 | Primary bedroom | King bed, ensuite visible |
| 4 | Living room | Lit brick fireplace, sliding door |
| 5 | Secondary bedroom | Two windows, accent chair |
| 6 | Dining (alt) | Wider angle toward front door |
| 7 | Living room (alt) | Decor ladder, opens to kitchen |
| 8 | Primary bathroom (ensuite) | Marble, double floating vanity, gold fixtures, walk-in shower |
| 9 | Living room (hero) | Symmetric twin sofas, centered fireplace |
| 10 | Hall bathroom | Round mirror, single vanity, tub-shower, subway tile |
| 11 | Living room (alt 2) | Sliding door open to backyard |
| 12 | Backyard | Covered patio, mature oak, wood fence |
| 13 | Living room (alt 3) | Twin sofas + poufs |
| 14 | Aerial / lot | Top-down drone (NOT used as facade) |
| 15 | Dining (alt 2) | Bright dining, large window |
| 16 | Kitchen + dining (open) | Open sightline to living |
| 17 | Dining + kitchen open | Round table foreground |
| 18 | **Exterior FACADE** | Real front: garage, front door, oak, dusk sky |

## Shot list (tour order — `*_tour.mp4`)
| # | Room | Camera move | Photo |
|---|------|-------------|-------|
| 1 | Exterior | Slow push-in toward entry | 01_exterior.jpg (img18 — real facade) |
| 2 | Living room | Low, slow dolly-in | 02_living.jpg (img09) |
| 3 | Kitchen | Smooth lateral slide | 03_kitchen.jpg (img01) |
| 4 | Dining | Smooth lateral slide | 04_dining.jpg (img15) |
| 5 | Primary bedroom | Gentle push-in | 05_primary_bed.jpg (img03) |
| 6 | Secondary bedroom | Gentle push-in | 06_secondary_bed.jpg (img05) |
| 7 | Primary bathroom | Slow tilt up | 07_primary_bath.jpg (img08) |
| 8 | Hall bathroom | Slow tilt up | 08_hall_bath.jpg (img10) |
| 9 | Backyard | Slow pull-back to reveal | 09_backyard.jpg (img12) |

Output: `10205-Willfield-Dr-Austin-TX-78753_tour.mp4` — 1080×1920, 30 fps, 33.9 s.

## On-screen facts (lower-third)
- **Address: 10205 Willfield Dr, Austin, TX 78753** (from the listing URL — verified).
- **Price / beds / baths / sqft: PENDING** — these live in the Zillow `resoFacts` block,
  which is unreachable (no network). They are intentionally **not invented**. Provide the
  four values and the lower-third is regenerated via `build/make_lowerthird.py` and the
  final muxed in one cheap pass.
