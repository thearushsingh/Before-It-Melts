# Before It Melts

The browser release of Ari's scooter adventure: collect ice creams, cross the forest, escape the skeleton village and get home.

## Deploy on Netlify

1. In Netlify, choose **Add new project → Import an existing project → GitHub**.
2. Select **thearushsingh/Before-It-Melts**, branch **main**.
3. The included `netlify.toml` sets the build command to `node tools/prepare-site.mjs` and publish directory to `dist`.
4. Deploy and open the resulting HTTPS address in a desktop browser.

The Unity game is already compiled. Netlify only assembles the static release; no Unity licence or Unity installation is needed there. The build includes both cutscenes and their audio.

## Deploy on itch.io

Run `npm run build`, then ZIP the **contents** of `dist/` so `index.html` is at the archive root. Choose **HTML** on itch.io and mark the uploaded ZIP as playable in the browser. Use click-to-launch fullscreen for the desktop game.

The 372 MB Unity data asset is transported in 45 verified pieces of at most 8 MiB each. The browser reassembles the exact original compressed bytes and passes them to Unity's existing decompression loader. A short prefix prevents hosting services from mistaking partial pieces for complete gzip files. Every piece is checked with SHA-256 and failed downloads are retried up to twice. The complete package is approximately 479 MB; the largest individual file is the 83 MB opening cutscene. No game content, texture resolution, audio or video quality has been reduced. First download remains large, and desktop memory requirements are unchanged apart from startup assembly overhead.

`npm run verify` checks original-data reconstruction, all other release checksums and itch.io archive limits. A local browser smoke test does not replace checking the final itch.io upload on its CDN.

## Play

Click the game to focus it. W/S or Up/Down drive and reverse; A/D or Left/Right steer; Space brakes; Shift boosts. In the village, F or left click fires paintballs, and Shift + F uses the energy dome. The game explains the mission and controls before the ride.

This release is intended for desktop browsers with WebGL 2 and keyboard/mouse. Mobile touch controls are not included.

## Files

- `site/`: static player, textures and smaller assets.
- `asset-parts/`: large compiled assets in chunks under GitHub's file size limit.
- `release-manifest.json`: sizes and checksums for the exported player.
- `tools/prepare-site.mjs`: assembles large assets and verifies them before publishing.
- `dist/`: generated publish directory, excluded from Git.

Run `npm run build` locally, then serve `dist/` over HTTP. Opening the HTML directly from disk will not run Unity correctly. Avoid changing generated Build files by hand.

Only the compiled browser release is distributed here. Unity project source and development credentials are kept outside this repository.
