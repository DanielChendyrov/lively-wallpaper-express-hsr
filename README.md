# lively-wallpaper-express-hsr

Honkai: Star Rail Astral Express live wallpaper — we boutta ram Sunday with this one.

Four clock designs ship side by side, one per html file at the root. Pick
whichever one you want in LivelyWallpaper; each is a complete wallpaper on its
own.

| File | Clock | Idea | Type pairing |
| --- | --- | --- | --- |
| `index.html` | Astrolabe dial | Novelty — an instrument with no business being in this scene | Space Mono |
| `board.html` | Departure board | Destination — where the path is headed | Cinzel + Space Mono |
| `sign.html` | Station sign | Current position — where the train is right now | Jost + Cinzel |
| `serif.html` | Serif numerals | Minimalism — says nothing, just the hour | Cormorant Garamond + Montserrat Alternates |

## Pre-requisite

LivelyWallpaper (Windows): <https://www.rocksdanister.com/lively/>

## Installation

1. Install LivelyWallpaper.
2. Download or clone this repository.
3. Download the live wallpaper from <https://moewalls.com/games/astral-express-honkai-star-rail-2-live-wallpaper/> and put the file into the `assets` folder of the repository as `assets/astral-express-honkai-star-rail-moewalls-com.mp4` (~120MB, it can't be pushed to git due to the size).
4. In LivelyWallpaper, click "Add wallpaper" (the big "+" button).
5. Open the folder you extracted and drag-drop the html file of the version you want into the pop-up — `index.html`, `board.html`, `sign.html` or `serif.html`.
   - If the option is disabled, click "Choose a file" and choose the html file.
   - Since these are just html files, you can open any of them in your browser to preview each version.
6. Add more information as you wish on the next pop up or simply just click "Ok" to save the wallpaper.
   - If the wallpaper doesn't update, restart LivelyWallpaper and choose the wallpaper you saved on its home page.

## Layout

```txt
index.html            astrolabe dial
board.html            departure board
sign.html             station sign
serif.html            serif numerals
css/style.css         base styles (body, video layer, fonts) + the astrolabe dial
css/variants.css      the other three clock designs
js/index.js           video/audio setup + hand phase sync, for the astrolabe dial
js/variants.js        video/audio setup + clock updates, for the other three
assets/               the video, and the Space Mono / Montserrat Alternates / Cinzel / Jost / Cormorant faces
babel/index.babel     unused leftover from the original template
```

## The designs

Each clock carries a different idea, which is what keeps them from being four
spellings of the same clock.

**`index.html` — astrolabe dial.** A hairline cyan ring, sixty tick marks, and
two hands phase-locked to the real clock. The odd one out: a measuring
instrument that carries no narrative freight at all. Its appeal is novelty —
something that has no business existing in this scene, rendered as if it did.

**`board.html` — departure board.** A dark glass panel styled as a railway
timetable: the train's nameplate in Cinzel, the time in heavy Space Mono, a
`DEPARTS / TRAILBLAZE` block, and a `PLATFORM ∞` footer. The digits collapse to
a line and open again every minute, the way a Solari flap does. The status
light reads DEPARTED — the train has already left.

**`sign.html` — illuminated sign.** No panel at all. Jost at weight 200 gives
thin geometric numerals that read like a lit 1930s station sign, with the name
in Cinzel above and a `CURRENT POSITION / COSMOS` block below. The train is
above the world, off toward the upper right of the frame.

**`serif.html` — serif numerals.** The most restrained: Cormorant Garamond in
italic for the time, Montserrat Alternates in wide-tracked caps for the date.
It states no destination and no position — just the hour, and the five figures
standing in the fog.

All four sit in the **top-left**, the only region of the frame the train's glow
never crosses: measured across the whole 31.5s loop, the luminance under the
clock never exceeds 64/255, on 16:9, 16:10, 21:9 or 4:3 alike.

## Special thanks

- My thanks to [@rocksdanister](https://github.com/rocksdanister) for creating this tool.
- The video is from [moewalls.com](https://moewalls.com/).
