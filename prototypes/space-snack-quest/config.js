// PROTOTYPE - NOT FOR PRODUCTION
// Question: Can a kid follow the opening with taps only?
// Date: 2026-11-20
// Every tuning value lives here, each with value, min, max and step. The game reads them live
// through tune.<name> (index.html); the tweak panel, an add-on, writes them back here.
window.CONFIG = {
  seed: 1, // every gameplay random call reads rng(), seeded from this (or ?seed= in the address)
  volume: { value: 0.45, min: 0, max: 1, step: 0.05 },
  walk_speed: { value: 240, min: 80, max: 420, step: 10 }, // pixels per second
  safe_time: { value: 6, min: 2, max: 12, step: 0.5 }, // seconds the guest looks at the stage
  look_time: { value: 2.4, min: 0.8, max: 6, step: 0.2 }, // seconds the guest looks across the floor
  turn_time: { value: 0.45, min: 0.1, max: 1.5, step: 0.05 }, // seconds to turn; he does not catch while turning
  cone_len: { value: 190, min: 80, max: 320, step: 5 }, // pixels
  cone_half: { value: 0.38, min: 0.15, max: 0.9, step: 0.02 }, // radians, half the cone
  hide_reach: { value: 64, min: 40, max: 160, step: 2 }, // pixels from the planter; the doorway is farther than this
  hop_time: { value: 0.5, min: 0.2, max: 1.2, step: 0.05 }, // seconds
  hop_height: { value: 34, min: 8, max: 80, step: 2 }, // pixels
  home_sq: { value: 2.45, min: 1, max: 4, step: 0.05 },
  home_mo: { value: 2.15, min: 1, max: 4, step: 0.05 },
  hall_sq: { value: 1.75, min: 0.8, max: 3, step: 0.05 },
  guest_scale: { value: 1.2, min: 0.6, max: 2.2, step: 0.05 },
};
