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
| entrance | https://unsplash.com/photos/HB6JThnuCC4 | ANASTASIIA BUCHINSKAIA | https://unsplash.com/@anamilanofoto | `anastasiia-buchinskaia-HB6JThnuCC4-unsplash.jpg` | 200 |
| lounge | https://unsplash.com/photos/-mzlFS5KuN8 | Grace Estrada | https://unsplash.com/@usermcleod1 | `grace-estrada--mzlFS5KuN8-unsplash.jpg` | 200 |
| consultation | https://unsplash.com/photos/YISEqk2Zbq4 | Elist Nguyen | https://unsplash.com/@hieuanhcauam | `elist-nguyen-YISEqk2Zbq4-unsplash.jpg` | 200 |
| treatment-room | https://unsplash.com/photos/vtiQZJ1Ljx0 | 绎安 贺 | https://unsplash.com/@niceheyian | `niceheyian-vtiQZJ1Ljx0-unsplash.jpg` | 200 |
| detail | https://unsplash.com/photos/0HVm2nOc7OM | Nicolai Plenk | https://unsplash.com/@untitledsophisticated | `nicolai-plenk-0HVm2nOc7OM-unsplash.jpg` | 200 |
| closing | https://unsplash.com/photos/EyF0iLIzLW0 | Michael D Beckwith | https://unsplash.com/@mdbeckwith | `michael-d-beckwith-EyF0iLIzLW0-unsplash.jpg` | 200 |

Note on the treatment-room row: the display name is rendered in Chinese
characters (绎安 贺). Unsplash's own download slug uses the account handle
(`niceheyian`) rather than a transliteration, which is consistent with the
profile URL `unsplash.com/@niceheyian` WebFetch reported. The two agree.

## Charlottenburg

| Slot | Photo page | Photographer (per WebFetch) | Profile (per WebFetch) | `dl=` slug cross-check | HTTP |
|---|---|---|---|---|---|
| entrance | https://unsplash.com/photos/YReU2FQoG_0 | Maria Shchevelova | https://unsplash.com/@mshhwqq | `maria-shchevelova-YReU2FQoG_0-unsplash.jpg` | 200 |
| lounge | https://unsplash.com/photos/F9WkNB0v0R8 | Katie Puzatova | https://unsplash.com/@puzatova | `katie-puzatova-F9WkNB0v0R8-unsplash.jpg` | 200 |
| consultation | https://unsplash.com/photos/M_Xd4ddcyNk | asd asd | https://unsplash.com/@asd32123 | `asd-asd-M_Xd4ddcyNk-unsplash.jpg` | 200 |
| treatment-room | https://unsplash.com/photos/4YhNRgL59Fc | Christian Lue | https://unsplash.com/@christianlue | `christian-lue-4YhNRgL59Fc-unsplash.jpg` | 200 |
| detail | https://unsplash.com/photos/_e2Jw79ssKo | Madalozzo | https://unsplash.com/@madalozzo | `madalozzo-_e2Jw79ssKo-unsplash.jpg` | 200 |
| closing | https://unsplash.com/photos/BAzT94876hk | Stuart Jenkins | https://unsplash.com/@stu_jenkins | `stuart-jenkins-BAzT94876hk-unsplash.jpg` | 200 |

Note on the consultation row: `asd asd` is the photographer's literal Unsplash
display name — it is not a placeholder left in by mistake. It is recorded as
Unsplash publishes it, with the profile handle `@asd32123` alongside so the
credit resolves to a real account.

## Delivered dimensions

Unsplash honoured `w=2400` on every download, so no `ffmpeg` rescale was needed
and no `.tmp.jpg` intermediates were created. Heights vary because aspect ratios
vary; the acceptance criterion is width.

| File | Dimensions |
|---|---|
| `mitte/entrance.jpg` | 2400 × 3607 |
| `mitte/lounge.jpg` | 2400 × 1679 |
| `mitte/consultation.jpg` | 2400 × 1600 |
| `mitte/treatment-room.jpg` | 2400 × 3600 |
| `mitte/detail.jpg` | 2400 × 1600 |
| `mitte/closing.jpg` | 2400 × 1600 |
| `charlottenburg/entrance.jpg` | 2400 × 1600 |
| `charlottenburg/lounge.jpg` | 2400 × 3200 |
| `charlottenburg/consultation.jpg` | 2400 × 1600 |
| `charlottenburg/treatment-room.jpg` | 2400 × 1600 |
| `charlottenburg/detail.jpg` | 2400 × 1609 |
| `charlottenburg/closing.jpg` | 2400 × 2400 |

## Visual inspection

Every one of the twelve files above was opened and looked at at full size after
download, not merely read about. Four candidates that had passed the description
check were rejected only once viewed; see `task-17-report.md` for the rejection
list and reasons.
