| Mutant | What it breaks | Guarded by | Fails it | All checks that fail |
|---|---|---|---|---|
| `no-tile-stomp` | the Stomp tab without its Shimmer tile | solo-tiles | yes | solo-tiles |
| `tile-first-throw` | the Throw tab's tile first in its row, not last | solo-tiles | yes | solo-tiles |
| `no-ladder-wording` | the tile without the ladder's comparison | solo-tiles | yes | solo-tiles, duo-who, weight |
| `tile-when-zero` | a tile where nothing is taken back (the E > 0 guard gone) | powers-off | yes | solo-tiles, powers-off |
| `glow-never-hidden` | the glow layer never hidden (drawn at strength 0 too) | powers-off | yes | solo-tiles, powers-off, follows |
| `no-tile-collide` | Collide without its Shimmer tile | duo-tiles | yes | duo-tiles, duo-who, powers-off, follows, copy |
| `level-total` | the tile's level from both of them together, not Rex's take | duo-tiles | yes | duo-tiles, follows |
| `who-unnamed` | the two-player lines without who takes it in | duo-who | yes | duo-who, follows, copy |
| `ollie-note-missing` | no note that canon gives the shimmer to Rex | duo-who | yes | duo-who |
| `catch-return-always` | the game of catch counting the return leg after any outcome | duo-who | yes | duo-tiles, duo-who |
| `no-weight-tile` | the growth what-if without its tile | weight | yes | weight |
| `weight-three-figures` | the growth what-if's rough energy to three figures | weight | yes | weight |
| `infinity-in-tile` | an unbounded energy printed as a figure (∞ J) | unbounded | yes | unbounded |
| `glow-not-aria-hidden` | the glow layers without aria-hidden | a11y | yes | a11y |
| `tile-aria-hidden` | the tile hidden from screen readers | a11y | yes | a11y |
| `header-not-following` | the header glow not set from Rex's tab | follows | yes | solo-tiles, weight, follows, glow-features, layout |
| `collide-art-total` | the Collide picture glowing with both takes, not Rex's | follows | yes | follows |
| `catch-heat-text` | the catch saying its energy ends up as heat in his plush with the power on | copy | yes | copy |
| `toss-heat-text` | the partner toss saying its energy ends up as heat in his plush with the power on | copy | yes | copy |
| `collide-not-drawn` | Collide's hit tile saying the shimmer isn't drawn yet | copy | yes | copy |
| `fireball-not-drawn` | the fireball saying the shimmer isn't drawn yet | copy | yes | copy |
| `throw-drag-note` | the Throw tab's drag-free item without the shimmer's figure | copy | yes | copy |
| `stop-motion` | Collide's carry without the charger's motion going to his source | copy | yes | copy |
| `spots-shifted` | the glows moved off his features (15% of the width to the right) | glow-features | yes | glow-features |
| `spots-huge` | glows five times as wide, over the background and spires | glow-features | yes | glow-features |
| `no-overflow-hidden` | the picture boxes not clipping the glow | layout | yes | layout |
| `box-wider-390` | at 480 px and below, the Collide picture's box wider than its image | layout | yes | layout |
| `tile-too-wide` | the tile wider than a phone (it pushes the page sideways) | no-scroll | yes | no-scroll |
| `animation-unguarded` | the shimmer animated outside the reduced-motion guard | motion | yes | motion |
