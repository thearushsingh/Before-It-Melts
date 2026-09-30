# Before It Melts

The browser release of Ari's scooter adventure: collect ice creams, cross the forest, escape the skeleton village and get home.

## Deploy on Netlify

1. In Netlify, choose **Add new project → Import an existing project → GitHub**.
2. Select **thearushsingh/Before-It-Melts**, branch **main**.
3. The included `netlify.toml` sets the build command to `node tools/prepare-site.mjs` and publish directory to `dist`.
4. Deploy and open the resulting HTTPS address in a desktop browser.

The Unity game is already compiled. Netlify only assembles the static release; no Unity licence or Unity installation is needed there. The build includes both cutscenes and their audio.

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
