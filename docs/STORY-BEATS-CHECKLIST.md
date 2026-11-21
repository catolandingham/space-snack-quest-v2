# Chapter 1 story beats

Every decided Chapter 1 beat is on this list. A beat is built, not yet built, or dropped on purpose. Nothing decided is dropped without a reason.

Newer words from Brian's 20 Nov 2026 digest replace older lines. The sneak, the party guests, and the hidden eyes are held. Brian said those are already wrong, and the gameplay reference was not in yet, so this pass does not change them.

## What a first-time player gets today

The title says where this is and who Squatch is. Mops says good morning and wrings his beard. The wall speaker, not Mops, says there is a party tonight and puts on a song. They sing at the doorway. Mops faces Squatch, tells him to stay, and leaves. Squatch looks at the calendar, the closet, and the bed, then does homework, and the evening card comes up. The party he just heard about is the reason for that card.

The poster on the wall already says to stay in here, and Mops says it too. The calendar's Moon Pie bite pays off on delivery day, which is later and still not built. The Guardian Box is named now and opened in a later beat.

## Held: sneak, milling, eyes

Read from the old game `catolandingham/space-snack-quest` at commit `4d1faa2` and the commits under it. Not changed in this pass.

**Sneak.** Commit `ea6bbde` (pull request 48) is the one that says the player steers Squatch from his doorway to the plant. In `src/game/15-ch1-scene1.js` the door guest faces the stage for 3.5 seconds, turns for 0.4, looks for 2, and turns back. His cone points left across the floor between the door and the plant, and it does not cover the plant. If he sees Squatch, a red exclamation mark shows and Squatch hurries back to the doorway to try again. Hiding is a HIDE button at the plant. Later, commit `0d09ec6` splits the party into five scenes and restarts the current one after the jail card. The v2 sneak still has a tap-walk, a turning guest, a hop, and a jail card. Brian says the sneak idea is lost. It stays as it is until the gameplay reference is read.

**Guests milling.** In the party hall drawing (`src/game/12-ch1-redesign.js`, `CH1_GUESTS`) the six stand-ins stand on fixed spots and only bob about a pixel and a half. They do not walk. The older deck scene in `src/game/10-ch1.js` (`aV.tour`) does move people: one stands, and one walks a lane between two points, pauses, and turns around. Brian wants the party guests to mill about, not stand still. That change waits for the gameplay reference, because the hall is held.

**Hidden eyes.** Decision C21, 8 Nov 2026, "These are the eyes." The drawing is `ga()` in `src/game/10-ch1.js`: two white circles, dark outline, pupil nudged down and to the right, with a blink. On the game plant the eyes sit low in the two front leaf clumps. The party hide calls `ga(400, 500)` and draws nothing of Squatch's body. Decision C8: only the plant and the eyes, never his body. Brian says the v2 eyes are wrong again. They are not moved in this pass.

## Beats

| Beat | What was decided | Status |
| --- | --- | --- |
| 1 | Meet Squatch. Cards for Stormtop and who he is. Mops by the bucket. Morning, then the wall speaker's party line and the song title. Poster already in the room picture. | built |
| 2 | They sing at the doorway. Theme stops while they sing. Mops faces Squatch, says stay, and leaves. | built |
| 3 | That evening. Peek from the doorway. He does not walk out. Banner, muffled talk, "Robots?" once. | not yet built |
| 4 | Sneak to the middle plant while the door guest faces the stage. Soft outline only on that one next place. HIDE at the plant. Eyes low in the front leaves. Jail card, then that sneak again. | not yet built. A sneak is in the game and is held. See above. |
| 5 | Isfred's announcement and the robot poster. The spoken lines are not approved. | not yet built |
| 6 | Croc Boys. Lights a little darker, no change to what anyone can see. The band's words are not approved. | not yet built |
| 7 | Dress-up from the closet. The lines for it are not approved. | not yet built |
| 8 | Into the party in the disguise. | not yet built |
| 9 | A real party. Guests should mill about. | not yet built. Held with the hall. |
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
