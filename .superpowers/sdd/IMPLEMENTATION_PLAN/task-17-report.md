# Task 17 — Source and verify the photography

Status: **DONE_WITH_CONCERNS** (concerns are disclosures, not failures — see the
last two sections).

Twelve images now exist at the exact paths `site/lib/locations.ts` already
references, plus `site/public/images/CREDITS.md`. No application code, test, or
data file was touched. `site/lib/locations.ts` and `site/lib/open-facts.ts` were
not edited.

## Method, and where the brief was stale

The brief's Step 3 and Step 4 shell blocks do not work as written, exactly as
the dispatching agent warned. Confirmed again during this task:

- `unsplash.com/photos/<ID>` returns 401 to curl — attribution cannot be scraped.
- `unsplash.com/oembed` is gone.
- pexels.com returns 403 to curl, so the whole set is Unsplash.

The working path used throughout:

1. `WebFetch` on Unsplash **search pages** (`/s/photos/<query>`) returns a clean
   list of photo-page URLs with alt text and photographer names. This turned out
   to be far more productive than `WebSearch`, which mostly returns search-page
   links rather than photo pages.
2. `WebFetch` on each shortlisted **photo page** for the display name, profile
   URL, licence string and description.
3. `curl.exe -L .../download?force=true&w=2400` for the file, capturing
   `%{url_effective}` so the `dl=` slug could cross-check the name.
4. Look at the downloaded file.

Roughly seventy candidates were downloaded at preview size and screened as
`ffmpeg`-tiled contact sheets, then finalists were viewed individually. Note for
anyone repeating this: `ffmpeg`'s `tile` filter silently emits only one sheet if
the inputs differ in size — the filter graph reconfigures and resets the tile
buffer. Normalise every input to identical dimensions in a separate pass first.

About one download in five returned 403 rather than 200. These appear to be
Unsplash+ or otherwise gated assets; they were simply dropped from the shortlist
rather than worked around.

## No rescale was needed

Unsplash honoured `w=2400`, so all twelve arrived exactly 2400px wide and the
`ffmpeg` rescale step was unnecessary. Nothing was re-encoded — re-encoding an
already-correct JPEG would only have cost quality. No `.tmp.jpg` files were
created and none exist. Heights vary with aspect ratio; full dimensions are in
`task-17-evidence.md`.

## The twelve, and why each suits its slot

### Mitte — warm, low-lit, dark wood

| Slot | Photographer | Why it fits |
|---|---|---|
| entrance | ANASTASIIA BUCHINSKAIA | A period entrance hall at night: arched glazed doors, a brass lantern lit, brass handrails, stone steps, deep shadow at the edges. It is a threshold rather than a facade, which is what the hero needs — you are being shown the way in. Tall crop, dark corners, so the hero scrim and the display type sit on it without fighting. |
| lounge | Grace Estrada | A dark, symmetrical hotel lounge seen through an arched opening: two pairs of pale armchairs, a low table, one warm pool of light, everything else falling to black. This is the waiting room the copy describes — quiet, upholstered, nobody in it. |
| consultation | Elist Nguyen | A long wooden table under two large warm paper shades, plaster wall, window to green. A table and chairs where a conversation happens. Explicitly not a surgery. |
| treatmentRoom | 绎安 贺 | Two tan leather armchairs in near-darkness with a single lamp on them. This is the brief's "the chair, lit warmly, no instruments in focus" read literally — a chair you would sit in, warm-lit, in a room that is doing nothing else. |
| detail | Nicolai Plenk | Brass inlay on dark wood, close, raking light. Brass on espresso is the entire Mitte palette in one frame, and it is a material close-up as the brief asks. |
| closing | Michael D Beckwith | A panelled reading room: oak bookcases, herringbone parquet, a brass-and-glass pendant. Wide, warm, empty. The closing block puts a heavy espresso scrim over it, so the busyness reads as texture behind the headline rather than competing with it. |

### Charlottenburg — pale Gründerzeit Altbau, daylight

| Slot | Photographer | Why it fits |
|---|---|---|
| entrance | Maria Shchevelova | A Gründerzeit facade in low golden light — stucco cartouches, pedimented windows, mansard roof. The one image in the set that says *this address is an Altbau* before you read a word. Clear sky at upper right gives the hero type somewhere to sit. |
| lounge | Katie Puzatova | A pale drawing room: a huge stucco ceiling rose, crystal chandelier, marble chimneypiece, cream tufted sofa, wide oak boards. The exact opposite register to Mitte's lounge, in the same layout. |
| consultation | asd asd | Cream bouclé seating around low brass-and-glass tables, tall windows, daylight from two sides. A place to sit and talk. Calm and pale without being white or clinical — the palette is cream and taupe, not blue-white. |
| treatmentRoom | Christian Lue | An empty Berlin Altbau room: tall casement windows, wrought-iron balcony rail, the facade opposite, pale plaster, warm boards, a radiator under the sill. Unmistakably Berlin and unmistakably empty. |
| detail | Madalozzo | Herringbone parquet, close, shallow focus, honey oak. Parquet is on the brief's own list of acceptable materials and it is the Altbau's signature one. |
| closing | Stuart Jenkins | A curved bay window with daylight pooling on board floor, cream panelling, nothing else in the room. Wide, quiet, and the top third is plain ceiling and wall — the headline space the brief asks for. |

The two sets do not homogenise. Put side by side, the Mitte six are espresso,
amber and brass at night; the Charlottenburg six are cream, plaster and daylight.
Same chrome around both, per HANDOFF §5.4.

## Rejected, and why

Four images were downloaded, staged into `site/public/images/`, and only then
replaced — because they only failed once looked at. This is the reason the brief
insists on viewing rather than reading descriptions.

- **`mitte/entrance.jpg`, first pick (Yanhao Fang, "Modern building entrance at
  night with warm lighting").** Beautiful dark warm doorway. It also carries a
  legible **"Fairfield BY MARRIOTT / GIFU SEIRYU SATOYAMA PARK"** sign cast into
  the stone. Shipping another company's brand mark on a practice's own entrance
  is not survivable. Replaced.
- **`mitte/lounge.jpg`, first pick (Magic Fan, "Elegant living room with yellow
  armchairs and fireplace").** Genuinely the best-looking dark drawing room I
  found — and it has a large gilt-framed oil portrait of a man on the wall, face
  clearly readable. Even though a painting is not a patient and does not engage
  HWG, a portrait hanging in a practice's lounge invites the reader to assume it
  is somebody connected to the practice, which is precisely the kind of implied
  fact this project's `Pending<T>` discipline exists to prevent. Replaced.
- **`mitte/detail.jpg`, first two picks.** Ruben Hanssen's door knocker is a
  sculpted **hand** gripping a bar, in harsh daylight — wrong register and too
  close to the "no hands" rule to be worth arguing about. Chris Linnett's carved
  oak door was better, but its ironwork contains a small Christian cross (it is a
  church door in Paris); unintended religious signalling on a dental page is not
  a trade worth making. Replaced with brass-on-wood, which has neither problem.
- **`charlottenburg/entrance.jpg`, first pick (Radek Kilijanek, "An elegant
  staircase and rotunda in an old building").** Reads as grand pale stucco in
  thumbnail. At full size it is an abandoned building — peeling plaster, a
  daubed mural, debris on the floor. Urbex decay, not a private practice.
  Replaced.

Rejected earlier, at the screening stage, without being downloaded at full size:
a hotel reception with laptops, a card terminal and a huge mural face; several
furniture-showroom living rooms with zebra prints and orange cushions; a lit
shopfront with "OPEN" chalkboard and Lavazza branding; a lounge with a person
visible in the background; a Japanese lantern street (wrong geography); a
derelict mouldy stairwell; and every Getty Images / Unsplash+ asset, on the
grounds that they are not free-licence.

## Attribution discipline

Every name, profile URL, source URL and licence string in `CREDITS.md` was read
from a WebFetch response of that specific photo page, and independently
cross-checked against the `dl=` slug in Unsplash's own download redirect. All
twelve pairs agree. Nothing was inferred, transliterated, or tidied up. The full
evidence table is in `task-17-evidence.md`.

Two credits look odd but are correct as published:

- `绎安 贺` — the display name is in Chinese characters. Unsplash's download slug
  uses the account handle `niceheyian`, matching the profile URL WebFetch
  returned, so the two sources agree.
- `asd asd` — that is genuinely the photographer's Unsplash display name. It
  looks like a placeholder that somebody forgot to fill in, which is why the
  profile handle `@asd32123` is recorded next to it in both `CREDITS.md` and the
  evidence file. If a reviewer would rather not print `asd asd` in a credits
  page, that image is the one to swap.

## Verification

| Check | Result |
|---|---|
| All twelve files exist at the exact paths | Yes |
| Valid JPEGs, 2400px wide | Yes — all twelve, confirmed with `ffprobe`. None narrower. |
| No `.tmp.jpg` survivors | Zero |
| Every image visually inspected at full size | Yes — all twelve, and that is what caught the four rejects above |
| `CREDITS.md` complete | Twelve filled rows, no ellipses |
| `npm.cmd run build` | Clean. Compiled in 2.8s, 6/6 static pages, no warnings |
| `npm.cmd run test:unit` | **93 passed / 93**, 18 files — unchanged |
| Served as AVIF or WebP | Yes. All twelve return `200 image/webp` from `/_next/image?...&w=1920&q=75` with `Accept: image/avif,image/webp,*/*` — not the source JPEGs |
| `/en` loads | 200, and its markup carries `/_next/image` srcsets for the Mitte slots |
| Port 3000 | Server stopped, port confirmed free |

## Concerns for the reviewer

1. **The `detail` slot is not rendered by anything.** `ImageSlot` declares it and
   `locations.ts` maps it for both practices, but no component reads
   `practice.images.detail` — `Hero` uses `entrance`, `StepSections` uses
   `lounge`/`consultation`/`treatmentRoom`, `ClosingCta` uses `closing`. Both
   detail files are supplied as required, and the approved comp does call for a
   material close-up, but nothing currently displays them. That is a Task 16
   composition gap, not a Task 17 one, and this task was told not to change
   application code — so it is reported rather than fixed.
2. **One small face remains, deliberately and disclosed.** The Charlottenburg
   lounge has a small antique oval print above the fireplace containing a face.
   It is decor in a period room, not a depiction of a patient, a procedure or
   anyone connected to the practice, so it does not engage HWG. It is called out
   in `CREDITS.md` so the decision is made knowingly rather than discovered. If
   the practice wants nothing face-like anywhere, that one file is the only swap.
3. **`mitte/entrance.jpg` is 2.2MB on disk** — larger than the rest because it is
   2400×3607. It is never served raw (the optimised WebP at w=1920 is 586KB), so
   this is a repository-weight note, not a performance one.
4. **Sourcing these does not resolve the `photography` open fact.** All twelve
   remain placeholder stock awaiting the practice's approval or replacement.
   `site/lib/open-facts.ts` was not touched and nothing was marked resolved.

---

# Task 17 — fix round 1

Status: **DONE_WITH_CONCERNS** (concerns are disclosures, not failures — see the
last section).

Five files were re-sourced and swapped. No application code, test, or data file
was touched. `site/lib/locations.ts` and `site/lib/open-facts.ts` were not
edited. Nothing in `tokens/`, `components/`, `guidelines/`, `ui_kits/` or
`assets/` was touched.

| Slot | Old | New |
|---|---|---|
| `mitte/entrance.jpg` | ANASTASIIA BUCHINSKAIA · `HB6JThnuCC4` | **Declan Sun · `bIMZSjz3KKI`** |
| `mitte/detail.jpg` | Nicolai Plenk · `0HVm2nOc7OM` | **Clio Di Giovanni · `EfNvmWDR7us`** |
| `charlottenburg/lounge.jpg` | Katie Puzatova · `F9WkNB0v0R8` | **Alex Rhee · `plAL61z3D9Y`** |
| `charlottenburg/consultation.jpg` | asd asd · `M_Xd4ddcyNk` | **yann maignan · `x3BCSWCAtrY`** |
| `charlottenburg/closing.jpg` | Stuart Jenkins · `BAzT94876hk` | **Tobias · `VnHVY1lTiVM`** |

`charlottenburg/entrance.jpg` (Maria Shchevelova) and
`charlottenburg/treatment-room.jpg` (Christian Lue) were kept, as instructed.
The four unflagged Mitte files were kept; no swap was forced.

## Finding by finding

### F1 — Charlottenburg lounge, devotional print, materially understated

**Resolved by swap.** The reviewer is right and the inconsistency was real: the
previous implementer rejected a Mitte `detail` candidate for carrying a small
Christian cross and then shipped a lounge whose focal point above the fireplace
is a robed, long-haired figure with hands at the chest in a gilt oval, with a
cross-formed object against the wall beside it. One rule, applied twice, in
opposite directions. The file is gone; nothing was left to be argued about in a
disclosure note.

The replacement (`plAL61z3D9Y`, Alex Rhee) is an empty pale room — two tall
black-framed sash windows with linen blinds, a European panel radiator with a
thermostatic valve, a turned floor lamp, chevron oak boards with sunlight
pooling on them, brick gables of the building opposite through the glass.
There is no artwork of any kind in the frame, so the class of defect cannot
recur here.

### F2 — Mitte detail, Moorish brass door with Kufic cartouches

**Resolved by swap.** Confirmed on inspection before replacement: eight-pointed
star geometry, repoussé bosses, engraved cartouches. Undisclosed, wrong
register, and the same religious-signalling objection as F1.

The replacement (`EfNvmWDR7us`, Clio Di Giovanni) is a sawn timber end grain
filling the frame — honey brown falling to near-black under raking light,
growth rings and one split. It is a single material in the espresso-and-amber
range with no pattern, no script, no symbol, no metalwork and no saturated
gold, which is exactly the brief's list.

### F3 — Mitte hero, halved lantern and cool-white blowout under the lightest scrim

**Resolved by swap, and verified by simulating the crop rather than by
eyeballing the source.** Every hero candidate was cropped to 1.9:1 about its
centre with `ffmpeg` and judged in that state, because that is what a desktop
visitor sees. Roughly forty candidates went through that filter. Most failed
it: portrait frames put their lit fixture above the crop line, and warm
interiors shot toward a window put the bright area on the right, where the
scrim runs down to 0.2.

The replacement (`bIMZSjz3KKI`, Declan Sun) is an empty stairwell in an old
building — mottled patinated plaster, terrazzo steps, a plain black tubular
handrail, one small ceiling spot and one lit wall recess. In the 1.9:1 centre
crop the left half falls to near-black under the 0.9 end of the scrim, and the
warm amber pool sits at roughly 72% across and 30% down, which is where the
approved comp's `.ph` gradient puts its `rgba(196,97,28,.30)` glow (72%/36%).
The lit recess is intact inside the crop. There is no cool-white anywhere in
the frame — no window, no daylight, no blowout — so the failure mode F3
describes cannot occur.

The report's claim that the old file was "a period entrance hall at night" is
corrected below under F6.

### F4 — Charlottenburg set register

**Resolved by swapping all three offending files.** The reviewer's reads were
verified before replacing: the lounge was an English Georgian/Adam drawing
room, the closing was an English country house looking out over a lawn, and the
consultation had a US NEMA duplex outlet on the wall. All three are gone.

The three replacements are Central-European and were checked fitting by
fitting:

- **lounge** (`plAL61z3D9Y`) — European panel radiator with a thermostatic
  valve, flush European socket, chevron oak, brick gables opposite. No lawn, no
  green foliage, no blue sky.
- **consultation** (`x3BCSWCAtrY`) — herringbone parquet, plaster cornice, tall
  French casement with a European column radiator, panelled double doors with
  applied plaster ornament. Flush European socket at the skirting. The one
  object in the room that needed ruling on is a tall twisted driftwood
  sculpture in an arched niche; zoomed, it is abstract timber, not a figure.
- **closing** (`VnHVY1lTiVM`) — cream stucco hall, moulded panels and carved
  plaster cartouches, a tall window and a round oeil-de-boeuf, daylight pooling
  on a pale terracotta-and-cream chequered stone floor. Nothing else is in the
  room.

Together with the two kept files, the Charlottenburg six now read stucco,
tall windows, parquet, cream and blush, daylight — with only the `entrance`
exterior carrying blue sky, which is unavoidable in a facade shot and is the
one image the reviewer said already delivers the register.

Note on the closing slot: at 4.3:1 the central strip of `VnHVY1lTiVM` is soft
cream plaster and moulding rather than a busy scene. Under the block's flat
0.78 espresso scrim with a centred headline that is the right kind of quiet,
but it is a deliberate choice and is called out rather than assumed.

### F5 — Mitte treatment room, taxidermy in shadow, audit not exhaustive

**Resolved by disclosure, not by swapping.** The file was re-examined with the
shadows lifted. There are two mounted taxidermy heads, one antlered, plus a
chandelier, in near-black at the upper left. Simulating the step-section media
crop (1.32:1 about the centre of a 2400×3600 source) confirms they sit above
the rendered frame at every shipped viewport, and that what is actually
rendered is the palm, the Tiffany-style lamp, the tartan cushions, the leather
armchairs and a group of small framed landscape prints with no faces in them.

`CREDITS.md`'s "What is in each frame" section has been rewritten as a genuine
audit of all twelve files, not a highlight list. Every file was reopened at
full size and again with the shadows lifted, and everything found is named —
including things that fall outside the crop. The taxidermy is stated plainly,
with the note that this is the file to swap if the practice objects to it
existing in a source asset at all.

The same pass corrected a second understatement the reviewer did not raise:
`mitte/closing.jpg` is a **Gothic Revival** library — banded sandstone piers,
pointed arches, leaded roundel glass under cusped floral tracery — not the
"panelled reading room" the original report described. There is no cross, no
figure and no inscription in the frame, and the closing block covers it with a
0.78 scrim, but the collegiate-ecclesiastical register is now stated in
`CREDITS.md` so it is a knowing choice.

### F6 — two slot descriptions did not match the files

**Corrected.** "Brass inlay on dark wood" described a Moorish brass door, and
"a period entrance hall at night" described a hall whose glazing plainly shows
daylight. Both files have been replaced, and the table above plus the rewritten
`CREDITS.md` audit now describe what is actually in the frame. The stale
descriptions survive above only as the historical record of what was reported
at the time.

## Method

The protocol given in the brief was followed exactly and worked as described:

1. `WebFetch` on Unsplash **search pages** to list candidate photo pages with
   alt text and photographer names. This remains far more productive than
   `WebSearch`, which mostly returns search-page links.
2. Candidates downloaded at `w=480`–`w=520`, normalised to identical dimensions
   and tiled into `ffmpeg` contact sheets for screening. (The tile filter still
   needs identical input sizes, and this build of `ffmpeg` has no glob support
   in `-pattern_type`, so inputs were copied to a numbered sequence first.)
3. Finalists downloaded at `w=1200`–`w=1600`, **cropped to the aspect ratio of
   the slot they were destined for**, and judged in that state.
4. `WebFetch` on each chosen photo page for the display name, profile URL and
   licence string.
5. `curl.exe -L .../download?force=true&w=2400` straight to the destination
   path, capturing `%{url_effective}` so the `dl=` slug could cross-check the
   name.
6. Every shipped file opened at full size, and again with the shadows lifted,
   before being accepted.

About one download in five returned 403 (Unsplash+ or otherwise gated); those
were dropped rather than worked around. Unsplash honoured `w=2400` on all five,
so no `ffmpeg` rescale was needed, nothing was re-encoded, and no `.tmp.jpg`
intermediates were created — `find` confirms none exist.

## Rejected in this round, and why

Every one of these was rejected only after being looked at, which is the point
of the rule.

- **`8LxRLTBS0YM` (Jennifer Yung)** — the best cream boiserie room found:
  marble chimneypiece, parquet, bouillotte lamp, blush rug. There is a **person
  reflected in the overmantel mirror**, a figure in a striped top, clearly
  legible at full size. Rejected outright.
- **`Ec-r_ii_PQM` (Juhi Sewchurran)** — gilded overdoor carrying **carved putti
  with faces**. Exactly the F1 class of defect. Rejected.
- **`2QH11tapwpo` (Christopher Stites)** — stucco ceiling and marble
  chimneypiece, but a carved face medallion in the overdoor, a hanging textile
  with legible Gothic script, and a US-pattern switch plate on the door jamb.
  Rejected.
- **`V61rTwZT8CU` (Mathias Reding)** — Louis XVI salon, correct architecture,
  but the upholstery is figurative tapestry with woven human figures, and the
  whole frame is cold grey. Rejected.
- **`XzWc7zy3n_Y` (Lisa Anna)** — pale, parquet, radiator, tall window; ruined
  by two framed posters with **legible institution names**. Rejected.
- **`kOdl-epUGUE` (Michael Pointner)** — genuinely warm gold lobby with the
  glow in the right place, and then two **green running-man EXIT pictograms**
  and branded flags and an A-board through the glass. Rejected.
- **`Fus-0ZgFdj4` (Haberdoedas)** — dusk archway with lit lanterns, carrying
  **"PROMERS"** carved into the arch and an **"Acquavite"** sign at the right.
  Rejected.
- **`d2biItg6JzA`, `clYssEhptao`, `Mu6uKmAV69Y`** — warm corridors and lobbies,
  all with legible EXIT signage. Rejected.
- **`QfAxc6jbHEA`** — lamp-flanked stone entrance with an inscription cut into
  the facade. Rejected.
- **`4u3-cXgu850`, `ZtIM1FC1yoo`, `cdPi_HKjZM8`** — correct register, but
  peeling plaster, debris and urbex decay. Rejected on the same ground the
  first round rejected Radek Kilijanek's rotunda.
- **`ZVCcSglWgoU`** — read as a pale cream lounge in thumbnail; at full size a
  steel-framed window filled with green foliage and a purple chair. Rejected.
- Rejected at screening without a full-size download: Getty Images and
  Unsplash+ assets, on licence grounds; 3D renders; restaurant interiors with
  laid tables and neon signs; lobbies with televisions or lit screens; a
  lounge with a lion statue; several rooms with figurative artwork.

## Verification

| Check | Result |
|---|---|
| All twelve files exist at the exact paths `locations.ts` references | Yes |
| Valid JPEGs, 2400px wide | Yes — all twelve, confirmed with `ffprobe`. None narrower |
| No `.tmp.jpg` survivors | Zero |
| Every one of the twelve visually inspected at full size **and** with shadows lifted | Yes |
| `CREDITS.md` complete, twelve filled rows | Yes |
| `CREDITS.md` frame audit exhaustive for all twelve | Yes — rewritten |
| Name / `dl=` slug agreement for all five new files | Yes, all five agree |
| `npm.cmd run test:unit` | **93 passed / 93**, 18 files |
| `npm.cmd run build` | Clean, no warnings |
| Port 3000 | No listener |

## Concerns for the reviewer

1. **`mitte/treatment-room.jpg` still contains taxidermy in the source file.**
   It is outside the crop at every shipped viewport and is now disclosed
   precisely rather than glossed. F5 offered "disclose accurately or swap"; the
   lower-risk option inside this task's scope was taken. If the reviewer would
   rather it not exist in the repository at all, that is a one-file swap.
2. **`mitte/closing.jpg` is Gothic Revival, and that is now stated.** No cross,
   no figure, no inscription, and a 0.78 flat scrim over it in use — but it is
   collegiate-ecclesiastical architecture and the reviewer should decide
   knowingly. It was not in the fix list, so it was not swapped.
3. **The Charlottenburg closing strip is quiet by design.** At 4.3:1 its
   central band is cream plaster and moulding rather than a scene. Correct
   register, deliberately low-incident under a centred headline.
4. **The `detail` slot is still not rendered by anything.** Unchanged from the
   first round: no component reads `practice.images.detail`. Both files are
   supplied as required. That remains a Task 16 composition gap.
5. **Sourcing these does not resolve the `photography` open fact.** All twelve
   remain placeholder stock awaiting the practice's approval or replacement.
   `site/lib/open-facts.ts` was not touched and nothing was marked resolved.
