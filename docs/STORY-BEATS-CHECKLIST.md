# Chapter 1 story beats

Every decided Chapter 1 beat is on this list. A beat is built, not yet built, or dropped on purpose. Nothing decided is dropped without a reason.

Newer words from Brian's 20 Nov 2026 digest replace older lines. The gameplay reference is in. The eyes are one close pair, low in the front leaves. He peeks before he steps out. The sneak starts in his doorway. Two guests stroll, and only the people who can catch him have cones.

## What a first-time player gets today

The title says where this is and who Squatch is. Mops says good morning and wrings his beard. The wall speaker, not Mops, says there is a party tonight and puts on a song. They sing at the doorway. Mops faces Squatch, tells him to stay, and leaves. Squatch looks at the calendar, the closet, and the bed, then does homework, and the evening card comes up. He peeks and sees the party and the banner before he steps out. Then he sneaks from his doorway to the plant while two guests stroll and the door guest looks away.

The poster on the wall already says to stay in here, and Mops says it too. The calendar's Moon Pie bite pays off on delivery day, which is later and still not built. The Guardian Box is named now and opened in a later beat.

## How the older game did the sneak

Read from the old game `catolandingham/space-snack-quest`, commits `ee59f4a` (7 Nov) and `4d1faa2` (17 Nov), and the gameplay reference.

**Sneak.** Commit `ea6bbde` (pull request 48) is the one that says the player steers Squatch from his doorway to the plant. In `src/game/15-ch1-scene1.js` the door guest faces the stage, turns, looks across the floor, and turns back. His cone does not cover the plant. If he sees Squatch, a red exclamation mark shows and that sneak starts again at the doorway. Hiding is HIDE · plant. v2 now does this. The locked timing is 6 seconds facing the stage, 0.45 to turn, and 2.4 looking. Those numbers were already in the game and were not changed.

**Guests milling.** The Nov 17 party guests only bobbed. The Nov 7 deck scene walks a tourist between two points, pauses, and turns, and the cone moves with her. v2 now has two of the six approved guests on fixed strolls. The other four stand and face the party. Only the door guest and the two walkers have cones.

**Hidden eyes.** Decision C21, "These are the eyes." `ga()` draws one pair: two white circles, radius 6, centres 18 pixels apart, pupil down and to the right, with a blink. They sit low, centered on the seam of the two front leaf clumps. v2 had put one small eye in each clump. That is fixed. Only the plant and the eyes show.

## Beats

| Beat | What was decided | Status |
| --- | --- | --- |
| 1 | Meet Squatch. Cards for Stormtop and who he is. Mops by the bucket. Morning, then the wall speaker's party line and the song title. Poster already in the room picture. | built |
| 2 | They sing at the doorway. Theme stops while they sing. Mops faces Squatch, says stay, and leaves. | built |
| 3 | That evening. Peek from the doorway. He does not walk out. Banner, muffled talk, "Robots?" once. | built |
| 4 | Sneak to the middle plant while the door guest faces the stage. Soft outline only on that one next place. HIDE at the plant. Eyes low in the front leaves, one close pair. Jail card, then that sneak again. Two guests stroll. Only the door guest and the walkers have cones. | built |
| 5 | Isfred's announcement and the robot poster. The spoken lines are not approved. | not yet built |
| 6 | Croc Boys. Lights a little darker, no change to what anyone can see. The band's words are not approved. | not yet built |
| 7 | Dress-up from the closet. The lines for it are not approved. | not yet built |
| 8 | Into the party in the disguise. | not yet built |
| 9 | A real party. Guests should mill about. | not yet built. The opening sneak now has two strolling guests. The rest of the party is later. |
| 10 | Robot dance. Only a tiny tap game, or it is dropped. Not dropped yet, because the party around it is not in. | not yet built |
| 11 | Karaoke, the Moon Pie song. | not yet built |
| 12 | Juke the octopus. | not yet built |
| 13 | Photo corner. | not yet built |
| 14 | Snack bar, paw close-up, snack pyramid. | not yet built |
| 15 | Balloon. | dropped. Brian, 20 Nov 2026: it has never worked. Only a really simple version, and this one is not simple. |
| 16 | The disguise comes off. "Thanks, I've never got to dance at a party" is the later approved story. The exact line is still pending in the old lines list. | not yet built |
| 17 | FUR alarm. "…Nice gloves." then "Wait a second... fur!" | not yet built |
| 18 | Run home. Security searches. No security in the opening. | not yet built |
| 19 | Mops comes home. "you have me." | not yet built. It happens after the party, so it is not played early. |
| 20 | Wookiee TV, full screen. Nick's growls. The shed, the scrubbers, the walk to the ship, the no-fur rule. | not yet built. Same reason as 19. Brian said to keep this show. |
| 21 | Bedtime story. Why Moon Pies. No parents in the words or the pictures. | not yet built |
| 22 | A gift from the Guardians. Toy rocket and a note. Into the Guardian Box. | not yet built |
| 23 | Calendar delivery day. The morning calendar is the setup. | not yet built |
| 24 | Mops forgot his lunch. | not yet built |
| 25 | Sneak the lunch to Mops. | not yet built |
| 26 | "My lunch! You're the best." | not yet built |
| 27 | One snack, behind the counter. | not yet built |
| 28 | The ship is coming. | not yet built |
| 29 | Walk to the loading bay. | not yet built |
| 30 | The robots arrive. | not yet built |
| 31 | The promise. | not yet built |
| 32 | Three copies. | not yet built |
| 33 | "Delicious." | not yet built |
| 34 | Gumbling. | not yet built |
| 35 | Spit into the bin. | not yet built |
| 36 | Walk home past the robots. | not yet built |
| 37 | Employee of the Month wall. | not yet built |
| 38 | Missing Moon Pies and a pancake brochure. | not yet built |
| 39 | Other Sasquatches? | not yet built |
| 40 | The Mars talk. | not yet built |
| 41 | Lights out. | not yet built |
| 42 | Night one, the paw order. | not yet built |
| 43 | "Six days later." | not yet built |
| 44 | The robots tease Mops. | not yet built |
| 45 | "Let's go find that pancake place." | not yet built |
| 46 | The almost-slip. | not yet built |
| 47 | Sneak to the vent. | not yet built |
| 48 | Mops's secret workstation. | not yet built |
| 49 | Grab the pink slip. | not yet built |
| 50 | The office keypad. | not yet built |
| 51 | Return the empty crate. | not yet built |
| 52 | Take all the snacks. Leave some for the Guardians. | not yet built |
| 53 | Packing the crate. Guardian Box inside, bucket on top. | not yet built |
| 54 | The robots open a crate. | not yet built |
| 55 | Mops warns him. | not yet built |
| 56 | The goat costume. | not yet built |
| 57 | Last walk. POP and the keepsake. | not yet built. The balloon pop is not this walk until beat 15 is rebuilt, and beat 15 is dropped. |
| 58 | Through the scanner. | not yet built |
| 59 | Where's Mops? | not yet built |
| 60 | The security tapes. | not yet built |
| 61 | The call to the ship. | not yet built |

## Dropped or replaced on purpose

- Balloon, beat 15. Brian, 20 Nov 2026. It has never worked.
- Mops saying the party line. The digest says the wall speaker says it.
- A separate mop. His beard is the mop.
- The jelly and the furry alien. Brian did not pick them.
- Security in the opening. The digest says no security until the later alarm.
- Goal-bar words such as "sneak to the plant." The digest replaces them with a soft outline on the one next place. The outline in the game is the older bush mark and is held with the sneak.

## Not clean enough to force in

- Isfred's welcome lines, the Croc Boys' name, and "COMING SOON!" are still pending in the old lines list. Those beats stay wordless-or-unbuilt rather than getting new words.
- Mops cannot pick up the painted bucket. It is part of the locked room picture, and that picture is not redrawn. He leaves through the doorway. The bucket stays in the picture.
- The hall picture has a painted yellow outline. It is not edited out, because the room picture is locked.
