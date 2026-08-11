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
| entrance | https://unsplash.com/photos/bIMZSjz3KKI | Declan Sun | https://unsplash.com/@declansun | `declan-sun-bIMZSjz3KKI-unsplash.jpg` | 200 |
| lounge | https://unsplash.com/photos/-mzlFS5KuN8 | Grace Estrada | https://unsplash.com/@usermcleod1 | `grace-estrada--mzlFS5KuN8-unsplash.jpg` | 200 |
| consultation | https://unsplash.com/photos/YISEqk2Zbq4 | Elist Nguyen | https://unsplash.com/@hieuanhcauam | `elist-nguyen-YISEqk2Zbq4-unsplash.jpg` | 200 |
| treatment-room | https://unsplash.com/photos/vtiQZJ1Ljx0 | 绎安 贺 | https://unsplash.com/@niceheyian | `niceheyian-vtiQZJ1Ljx0-unsplash.jpg` | 200 |
| detail | https://unsplash.com/photos/EfNvmWDR7us | Clio Di Giovanni | https://unsplash.com/@catherinedaho | `clio-di-giovanni-EfNvmWDR7us-unsplash.jpg` | 200 |
| closing | https://unsplash.com/photos/EyF0iLIzLW0 | Michael D Beckwith | https://unsplash.com/@mdbeckwith | `michael-d-beckwith-EyF0iLIzLW0-unsplash.jpg` | 200 |

The `entrance` and `detail` rows were re-sourced in fix round 1. Both names were
read from a fresh `WebFetch` of the photo page listed, and both agree with the
`dl=` slug their own download redirect returned. The photo pages that were
superseded — `HB6JThnuCC4` (ANASTASIIA BUCHINSKAIA) and `0HVm2nOc7OM`
(Nicolai Plenk) — are no longer used by any file in the repository.

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

## Delivered dimensions

Unsplash honoured `w=2400` on every download, so no `ffmpeg` rescale was needed
and no `.tmp.jpg` intermediates were created. Heights vary because aspect ratios
vary; the acceptance criterion is width.

Dimensions below are as they stand after fix round 1; changed files are marked.

| File | Dimensions | |
|---|---|---|
| `mitte/entrance.jpg` | 2400 × 3146 | re-sourced |
| `mitte/lounge.jpg` | 2400 × 1679 | |
| `mitte/consultation.jpg` | 2400 × 1600 | |
| `mitte/treatment-room.jpg` | 2400 × 3600 | |
| `mitte/detail.jpg` | 2400 × 1600 | re-sourced |
| `mitte/closing.jpg` | 2400 × 1600 | |
| `charlottenburg/entrance.jpg` | 2400 × 1600 | |
| `charlottenburg/lounge.jpg` | 2400 × 3600 | re-sourced |
| `charlottenburg/consultation.jpg` | 2400 × 1600 | re-sourced |
| `charlottenburg/treatment-room.jpg` | 2400 × 1600 | |
| `charlottenburg/detail.jpg` | 2400 × 1609 | |
| `charlottenburg/closing.jpg` | 2400 × 3600 | re-sourced |

## Visual inspection

Every one of the twelve files above was opened and looked at at full size after
download, not merely read about. Four candidates that had passed the description
check were rejected only once viewed; see `task-17-report.md` for the rejection
list and reasons.
