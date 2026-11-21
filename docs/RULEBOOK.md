# Space Snack Quest — rulebook

If it is not in this file, it is not decided.

Every correction from Brian replaces the old line and adds or updates a check in the same change. This file does not keep old versions. Git does.

## Play

The game is at https://squatch.onrender.com. This is the only place that states that link.

## Beats, in order

| Beat | Room | What happens |
| --- | --- | --- |
| Title | Squatch's room is not on screen yet | The title glows. Nothing plays until the first tap. |
| Where he lives | Squatch's room is not on screen yet | A card says Stormtop Cloud Resort, floating above Jupiter. Joe's theme plays. |
| Who he is | Squatch's room | A card says who Squatch is. The theme is still playing. |
| Morning lines | Squatch's room | The room is quiet. Mops wrings his beard over the bucket. The wall speaker, not Mops, says there is a party. Each line waits for a tap. |
| SING ALONG | Squatch's room | SING ALONG lights up. Squatch walks only where the player taps. |
| Song | Squatch's room | They meet at the doorway and sing the goodbye. The theme stops while they sing. That walk plays on its own. |
| Stay | Squatch's room | Mops turns to face Squatch and says to stay in here. |
| Mops leaves | Squatch's room | Mops walks to the doorway and leaves from inside the room. |
| Home alone | Squatch's room | Calendar, then the closet, then the bed, then homework. One at a time. |
| That evening | Squatch's room | The card waits for a tap. The hall is not on screen yet. |
| Sneak | Party hall | Squatch starts at the doorway. He walks only where the player taps. The bush outline shows the way. |
| Hide | Party hall | HIDE lights up only when he is close. His eyes peek from the front leaves. |
| Seen | Party hall | He hops. A lockup card shows. A tap starts that sneak again at the doorway. |

## Approved lines

These are the only words the game may show, plus the reaction marks below.

- Space Snack Quest
- Stormtop Cloud Resort, floating above Jupiter.
- This is Squatch. He's a Sasquatch.
- Morning, Squatch.
- Good morning, Stormtop! Big party in the hall tonight!
- Party?
- Now here's a classic hit from Dog Zylan!
- Stay in here.
- I'm floating in space!
- Weeee-eenn-nnttt!
- MOONMUNCH
- FUZZUARY
- Sponsored by MOON PIES
- Sock hunt
- family Olympics night
- Wash outside windows (remember space suit!)
- Blanket fort night
- Mops's costumes. And my Guardian Box.
- Not sleepy anymore.
- DO · homework
- That evening…
- SING ALONG
- HIDE
- LOCKUP
- [line needed]
- Mops
- Squatch
- Teal jacket
- Camera
- Backpack
- Stilts
- Octopus
- Robot

Reaction marks, not dialogue: ! and ♥.

The lockup card's other lines are not decided. The card says LOCKUP and [line needed].

## Approved art

The game may load pictures only from `prototypes/space-snack-quest/assets/approved/`.

| File | What it is | Approved |
| --- | --- | --- |
| assets/approved/home-room-empty-closed-v5.png | Squatch's room, wardrobe closed | Brian, 2026-11-20. Locked picture. Do not redraw it. |
| assets/approved/hall-room-empty-v1.png | Party hall | Brian, 2026-11-20. Locked picture. Do not redraw it. |

Drawn characters, from the live game's code at commit 4d1faa2 (17 Nov 2026), file `src/game/60-frame-draw.js` and `src/game/10-ch1.js`:

| Who | Drawing | Approved |
| --- | --- | --- |
| Squatch | function Re | Brian, 2026-11-20, for this build. Not the older title-screen Squatch. |
| Mops | function Fe. His beard is the mop. No mop prop. | Brian, 2026-11-20. |
| Hidden eyes | function ga. White circle, dark outline, pupil down-right, with the blink. Scaled to 22/40 so the eye stays the same fraction of this bush's front leaf. One eye in each front clump. | Brian, 8 Nov 2026, decision C21, "These are the eyes." |

Guests. Brian approved six on 8 Nov 2026 (decision C12, "We like these ones just fine, and actually the robot is fine as well"). The jelly in a sun hat and the furry alien are not guests. The later sheet of eight code-drawn guests is not approved. The source picture is `assets/approved/guests/nov8-six-approved-guests.png`. The game draws only the six cuts of that sheet, `teal.png`, `camera.png`, `backpack.png`, `stilt.png`, `octopus.png`, and `robot.png`. The cream around each person is transparent. The whites inside the drawings stay. No other guest art is loaded. Each person is:

1. Teal jacket. Brown skin, short black hair, one antenna with a black ball off to the side, teal jacket, white chest panel, black pants.
2. Camera. Light skin, brown hair, blue shirt, yellow and pink badges, black camera, dark shorts, tan legs.
3. Backpack. Grey-blue round head, three dark eyes, two antennae, dark blue-grey body, brown backpack, light blue shoes.
4. Stilts. Purple round head, two ball-tipped antennae, yellow rectangle torso, very long thin dark legs and arms, purple hands and feet.
5. Octopus. Big round pink head, smile, small yellow hat, pink tentacles with white bands, blue collar.
6. Robot. Grey-white box head, blue square eyes, smile, red antenna, green chest screen with yellow dots, blue hands, black feet.

Only these six may appear. Their names in the game are teal, camera, backpack, stilt, octopus, and robot. They are taller than Squatch and Mops. The camera guest is the one who looks across the floor.

## Rules

| Id | Rule | Check |
| --- | --- | --- |
| R1 | Only the approved lines and the two reaction marks are on screen. | Automatic |
| R2 | Speech bubbles sit on the speaker and stay off faces. | Automatic |
| R3 | Every chip does something, and a chip is offered only when the player can use it. | Automatic |
| R4 | Every sight cone is dashed and within 15% of the others in length and spread. Mops's cone matches the guests. | Automatic |
| R5 | The bush hint is a dashed yellow line, 6 pixels thick, color #ffcf33, a small gap outside the leaves and the pot. It traces that shape. It is not a circle. It pulses gently. | Automatic for color, dashes, thickness, gap, and shape. Eyes for the pulse. |
| R6 | The morning, through Mops leaving and the evening card, stays in Squatch's room. The party hall starts when that card is tapped. | Automatic |
| R7 | Hidden eyes are the original ga drawing, scaled to this bush's front leaves, pupil down-right, peeking from those leaves and not sitting on the pot rim. | Automatic for size, place, and pupil. Eyes for the side-by-side. |
| R8 | When Squatch is inside Mops's cone, red hearts rise from Mops and fade. | Automatic |
| R9 | When Squatch is inside a guest's cone, a red exclamation mark rises in a yellow circle and fades. | Automatic |
| R10 | The only guests are the six approved ones. | Automatic |
| R11 | When he is spotted he hops. He does not teleport. | Automatic |
| R12 | Mops's beard is the mop. No separate mop is drawn. | Automatic |
| R13 | Rooms are the locked pictures in assets/approved, and the game loads no other picture. | Automatic |
| R14 | Squatch does not walk to the bush by himself. | Automatic |
| R15 | Play is taps only, on a phone-sized screen and an iPad-sized screen. | Automatic for both screen sizes. Eyes for "nothing else is required." |
| R16 | A stage direction becomes movement or a sound, not words. | Eyes |
| R17 | The room is quiet until the goodbye song. A new theme plays on the title cards and when hearts show. It stops while they sing. No copied melody. Joe's own recording is not in this build. | Automatic for when it plays. Eyes for the tune. |
| R18 | The six guests are flat cartoons and taller than Squatch and Mops. | Eyes, on the lineup |
| R19 | Being seen restarts the sneak, not the whole story. | Automatic |
| R20 | The code does not show a line, a picture, or a guest the rulebook does not list. | Automatic |
| R21 | The play link is only in this file. | Automatic |
| R22 | The wall speaker says the party line and the song title. Mops does not. After the song he faces Squatch, says to stay, and leaves. Then the calendar, the closet, the bed, and homework, in that order, and only then the evening card. | Automatic |

The sneak, the guests, and the hidden eyes are not changed in this pass. Brian said those are wrong, and the gameplay reference was not in yet. See `docs/STORY-BEATS-CHECKLIST.md`.

## Still needs Brian

- The rest of the lockup card.
- Joe's recording, if he wants that file instead of the new tune.
- A line after the eyes appear, if the quiet ending should say something.
