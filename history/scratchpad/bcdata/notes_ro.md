## Rex and Ollie: how the girths were derived

- Source: the picture-measurement work in `scratchpad/mass/` (final.json, the checker files, Methods A, B and C).
- Scale: the checker's 3.048 m / 790 px = 0.0038582 m per pixel (Rex's crest tip to the floor under his ankles).
- Width: the frontal width at each girth site, perpendicular to the limb axis. Readings come from the checker where it gave one, then Methods B and C, then the Method A region masks. `derivation.width_source` in each girth says which.
- Depth: k x width. k is the depth ratio the checker's reconciled volume model used at that site: chest 1.05, waist 0.80, legs 1.0, Rex upper arm 0.90, Ollie upper arm 0.95, forearm 0.85, Rex neck 1.05, Ollie neck 1.0.
- Girth: Ramanujan perimeter of an ellipse with those two axes.
- Range: the width range combined with the k range. The chest, waist and leg k ranges are the checker's. The arm, forearm and neck k ranges are mine (about +/-0.1).

| Site | Rex width (px) | k | Rex girth (m) | Rex range (m) | Ollie width (px) | k | Ollie girth (m) | Ollie range (m) |
|---|---|---|---|---|---|---|---|---|
| chest | 278 | 1.05 | 3.45 | 3.16-3.86 | 297 | 1.05 | 3.69 | 3.34-4.20 |
| waist | 237 | 0.80 | 2.59 | 2.38-2.82 | 320 | 0.80 | 3.50 | 3.12-3.80 |
| arm_flexed | 165 | 0.90 | 1.90 | 1.75-2.04 | 148 | 0.95 | 1.75 | 1.29-1.99 |
| forearm | 145 | 0.85 | 1.63 | 1.52-1.83 | 108 | 0.85 | 1.21 | 0.96-1.35 |
| thigh | 158 | 1.00 | 1.92 | 1.69-2.10 | 164 | 1.00 | 1.99 | 1.74-2.19 |
| calf | 165 | 1.00 | 2.00 | 1.75-2.22 | 172 | 1.00 | 2.08 | 1.85-2.27 |
| neck | 128 | 1.05 | 1.59 | 1.42-1.76 | 122 | 1.00 | 1.48 | 1.38-1.59 |

Width choices:

- Rex chest: 278 px at row 250 (checker). Masks give 274-282 px over rows 220-300.
- Rex waist: 237 px (Method C, at its navel row, about 365). His navel is hidden by the tank top, so the level is estimated. Masks give 235-242 px at rows 360-370. Both waist edges are visible against the background.
- Rex upper arm: 165 px at the biceps belly of the fully visible arm (checker and Method C agree).
- Rex forearm: 145 px (checker), just below the elbow, above the wrist strap.
- Rex thigh: 158 px just below the crotch (Method B, 160/158 px). The checker gives 150-165 px.
- Rex calf: 165 px (Method C). Method B gives 174/165 px; the checker 150-165 px.
- Rex neck: 128 px, the midpoint of Method B (135) and Method C (120).
- Ollie chest: 297 px at row 240 (mask). Method C gives 290 px, Method B 307 px.
- Ollie waist: 320 px at the navel (Method C; masks give 319-320 px). Both edges are partly behind his fists.
- Ollie upper arm: 148 px mid-arm, from the Method A mask with the checker's 2 px fur erosion. Method C read 115 px. The checker judged Method C's arms too small, so the mask reading is used and 115 sets the low end.
- Ollie forearm: 108 px, the mean of the widest stretch of the eroded mask. Method C read 90 px, which sets the low end.
- Ollie thigh: 164 px (Methods B and C agree within 2 px).
- Ollie calf: 172 px (Method C). The two leg masks give 167 and 177 px.
- Ollie neck: 122 px, the midpoint of Method B (125) and Method C (120).

Clothing:

- Rex wears a tank top and cargo pants. Chest and waist are over the tank top (and the belt at the waist). Thigh and calf are over the cargo pants. Arm, forearm and neck are bare.
- Ollie wears cargo pants, boots and an open vest. Chest and waist include the vest at the sides. Thigh and calf are over the cargo pants; the calf is taken above the boots. Arm, forearm and neck are bare (fur).
- Each girth has `includes_clothing` and a `clothing_note`.

Tail:

- Rex's large tail is about 0.29 m^3 (about 307 kg at 1,060 kg/m^3, about 11% of his volume). It is inside the 2,700 kg. It adds weight but has no listed girth.
- Ollie has a small tufted tail, about 0.01 m^3 (about 11 kg), also inside the 2,700 kg.

Caveats:

- Depth is not visible in a front view. Every girth depends on k.
- Method check on ANSUR II medians: the same construction from chest breadth (0.289 m, k 1.05) gives 0.931 m, but the real chest tape is 1.056 m. That is 12% short. The waist check is 2% short. So the chests of Rex and Ollie probably read low. I did not adjust them; the brief fixed the method.
- The arms are not in a flexed pose. The page field is "flexed upper arm", so the definition differs.
- Rex's calf reads larger than his thigh. His baggy pants bunch at the knee and calf.
- Ollie's waist reads close to his chest because the open vest hangs at the sides.

