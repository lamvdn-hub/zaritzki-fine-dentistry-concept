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
