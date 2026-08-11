# Task 17 — attribution verification evidence

Every photographer name below was read from a `WebFetch` of the Unsplash photo
page listed in the same row. The `dl=` slug is an independent cross-check: it is
the filename Unsplash's own download endpoint returns in the effective
`images.unsplash.com` URL, captured with

```
curl.exe -s -o <path> -w "%{http_code}|%{url_effective}" -L \
  "https://unsplash.com/photos/<ID>/download?force=true&w=2400"
```

All twelve returned `code=200` and a `dl=` slug matching the name WebFetch
reported. No name in `CREDITS.md` was written from memory or inference.

`unsplash.com/oembed` is gone (404), `unsplash.com/photos/<ID>` returns 401 to
curl, and pexels.com returns 403 to curl — so attribution was gathered with the
`WebFetch` tool, not by scraping. Every photo page reported the licence string
verbatim as **"Free to use under the Unsplash License"**.

## Mitte

| Slot | Photo page | Photographer (per WebFetch) | Profile (per WebFetch) | `dl=` slug cross-check | HTTP |
|---|---|---|---|---|---|
| entrance | https://unsplash.com/photos/VitXrx5ajeQ | Daniel Romero | https://unsplash.com/@rmrdnl | `daniel-romero-VitXrx5ajeQ-unsplash.jpg` | 200 |
| lounge | https://unsplash.com/photos/-mzlFS5KuN8 | Grace Estrada | https://unsplash.com/@usermcleod1 | `grace-estrada--mzlFS5KuN8-unsplash.jpg` | 200 |
| consultation | https://unsplash.com/photos/YISEqk2Zbq4 | Elist Nguyen | https://unsplash.com/@hieuanhcauam | `elist-nguyen-YISEqk2Zbq4-unsplash.jpg` | 200 |
| treatment-room | https://unsplash.com/photos/vtiQZJ1Ljx0 | 绎安 贺 | https://unsplash.com/@niceheyian | `niceheyian-vtiQZJ1Ljx0-unsplash.jpg` | 200 |
| detail | https://unsplash.com/photos/EfNvmWDR7us | Clio Di Giovanni | https://unsplash.com/@catherinedaho | `clio-di-giovanni-EfNvmWDR7us-unsplash.jpg` | 200 |
| closing | https://unsplash.com/photos/EyF0iLIzLW0 | Michael D Beckwith | https://unsplash.com/@mdbeckwith | `michael-d-beckwith-EyF0iLIzLW0-unsplash.jpg` | 200 |

The `detail` row was re-sourced in fix round 1 and the `entrance` row has now
been re-sourced twice — once in fix round 1 and again in fix round 2. Each name
was read from a fresh `WebFetch` of the photo page listed in the same row, and
each agrees with the `dl=` slug its own download redirect returned. The photo
pages that were superseded — `HB6JThnuCC4` (ANASTASIIA BUCHINSKAIA) and
`bIMZSjz3KKI` (Declan Sun) for `entrance`, `0HVm2nOc7OM` (Nicolai Plenk) for
`detail` — are no longer used by any file in the repository.

Fix round 2 evidence for the `entrance` row, captured in this session:

- `WebFetch https://unsplash.com/photos/VitXrx5ajeQ` returned display name
  **Daniel Romero**, profile **https://unsplash.com/@rmrdnl**, licence string
  **"Free to use under the Unsplash License"**, description **"Elegant double
  doors with ornate gold trim."**, camera "Canon, EOS M6 Mark II", and no stated
  location.
- `curl.exe -s -o NUL -w "code=%{http_code} url=%{url_effective}" -L
  "https://unsplash.com/photos/VitXrx5ajeQ/download?force=true&w=2400"` returned
  `code=200` with `dl=daniel-romero-VitXrx5ajeQ-unsplash.jpg`. The slug and the
  WebFetch name agree.
- The file downloaded to `site/public/images/mitte/entrance.jpg` was `md5sum`
  compared against the staging copy that was visually inspected; the digests are
  identical (`7e38d2b0069ea8e43cdde39dcc1817c0`), so the file that shipped is
  the file that was looked at.

Note on the treatment-room row: the display name is rendered in Chinese
characters (绎安 贺). Unsplash's own download slug uses the account handle
(`niceheyian`) rather than a transliteration, which is consistent with the
profile URL `unsplash.com/@niceheyian` WebFetch reported. The two agree.

## Charlottenburg

| Slot | Photo page | Photographer (per WebFetch) | Profile (per WebFetch) | `dl=` slug cross-check | HTTP |
|---|---|---|---|---|---|
| entrance | https://unsplash.com/photos/YReU2FQoG_0 | Maria Shchevelova | https://unsplash.com/@mshhwqq | `maria-shchevelova-YReU2FQoG_0-unsplash.jpg` | 200 |
| lounge | https://unsplash.com/photos/plAL61z3D9Y | Alex Rhee | https://unsplash.com/@alexdhrhee | `alex-rhee-plAL61z3D9Y-unsplash.jpg` | 200 |
| consultation | https://unsplash.com/photos/x3BCSWCAtrY | yann maignan | https://unsplash.com/@paris_interieurs | `yann-maignan-x3BCSWCAtrY-unsplash.jpg` | 200 |
| treatment-room | https://unsplash.com/photos/4YhNRgL59Fc | Christian Lue | https://unsplash.com/@christianlue | `christian-lue-4YhNRgL59Fc-unsplash.jpg` | 200 |
| detail | https://unsplash.com/photos/_e2Jw79ssKo | Madalozzo | https://unsplash.com/@madalozzo | `madalozzo-_e2Jw79ssKo-unsplash.jpg` | 200 |
| closing | https://unsplash.com/photos/VnHVY1lTiVM | Tobias | https://unsplash.com/@herrzett | `tobias-VnHVY1lTiVM-unsplash.jpg` | 200 |

The `lounge`, `consultation` and `closing` rows were re-sourced in fix round 1.
Each name was read from a fresh `WebFetch` of the photo page listed, and each
agrees with the `dl=` slug its own download redirect returned. The photo pages
that were superseded — `F9WkNB0v0R8` (Katie Puzatova), `M_Xd4ddcyNk` (`asd asd`)
and `BAzT94876hk` (Stuart Jenkins) — are no longer used by any file in the
repository, and the `asd asd` display-name question is therefore moot.

`Tobias` and `yann maignan` are the literal Unsplash display names, printed as
published, with the handles `@herrzett` and `@paris_interieurs` alongside so
each credit resolves.

Provenance note on the `closing` row, verified in fix round 2 by a fresh
`WebFetch` of `https://unsplash.com/photos/VnHVY1lTiVM`: that page states the
location as **"Ludwigskirche, Am Ludwigsplatz, Saarbrücken, Germany"** and the
description as **"a hallway with a window"**. The building is a Baroque church.
Nothing religious appears in the frame and the file was not swapped, but the
provenance is now disclosed in `CREDITS.md` rather than left silent.

## Delivered dimensions

Unsplash honoured `w=2400` on every download, so no `ffmpeg` rescale was needed
and no `.tmp.jpg` intermediates were created. Heights vary because aspect ratios
vary; the acceptance criterion is width.

Dimensions below are as they stand after fix round 2; files changed in either
round are marked.

| File | Dimensions | |
|---|---|---|
| `mitte/entrance.jpg` | 2400 × 3600 | re-sourced in round 2 |
| `mitte/lounge.jpg` | 2400 × 1679 | |
| `mitte/consultation.jpg` | 2400 × 1600 | |
| `mitte/treatment-room.jpg` | 2400 × 3600 | |
| `mitte/detail.jpg` | 2400 × 1600 | re-sourced in round 1 |
| `mitte/closing.jpg` | 2400 × 1600 | |
| `charlottenburg/entrance.jpg` | 2400 × 1600 | |
| `charlottenburg/lounge.jpg` | 2400 × 3600 | re-sourced in round 1 |
| `charlottenburg/consultation.jpg` | 2400 × 1600 | re-sourced in round 1 |
| `charlottenburg/treatment-room.jpg` | 2400 × 1600 | |
| `charlottenburg/detail.jpg` | 2400 × 1609 | |
| `charlottenburg/closing.jpg` | 2400 × 3600 | re-sourced in round 1 |

## Visual inspection

Every one of the twelve files above was opened and looked at at full size after
download, not merely read about. Four candidates that had passed the description
check were rejected only once viewed; see `task-17-report.md` for the rejection
list and reasons.

In fix round 2 the `entrance` file was additionally inspected with the shadows
lifted (`eq=brightness=0.34:contrast=1.15`), zoomed at 3× on the transom strip,
the door furniture and the threshold, cropped with `ffmpeg` to both shipped hero
aspect ratios (1.818:1 desktop from `min-height:88svh` at 1440 wide, 0.462:1
mobile at 390×844) about its centre, and re-rendered with the hero's own
`linear-gradient(90deg, .9 → .66@46% → .2)` espresso scrim simulated over each
crop. Both crops were viewed in that state before the file was accepted.
