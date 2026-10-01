# Before It Melts

### A gift for my busy dad

Hi, I'm Arush, the developer behind **The Skull Bear Studios**. I made Before It Melts, a 3D scooter adventure about a kid named Ari who wants to do something nice for his dad.

Dad is busy working on a Sunday, so Ari comes up with a plan: bring him his favourite ice cream. Your job is to help Ari collect it and get home. The trip takes you through city traffic, a forest and a village full of skeletons.

## How I made it

I built the game in **Unity 6**, using **C#** for the scooter controls, traffic, collectibles, enemies and other gameplay systems. I used existing environment and character packs, then put the scenes together and adjusted the roads, lighting and collisions for the game. The cutscenes use AI-generated video clips, edited together with dialogue, music and sound effects.

| Technology | What it does |
| --- | --- |
| Unity 6000.5.6f1 | Builds the game and its scenes |
| C# | Runs the gameplay systems |
| Universal Render Pipeline (URP) | Handles rendering and lighting |
| WebAssembly and WebGL 2 | Let the Unity game run in a browser |
| HTML, CSS and JavaScript | Provide the browser page and game loader |
| Node.js | Prepares the files and runs the local server |

I also worked on browser performance by batching city geometry and reducing repeated work in the scooter, collectible and UI code. Performance still depends on your computer and browser.

## What's in this repository?

This repository contains the **compiled browser version** and the tools needed to prepare and host it. The full editable Unity project is **not included**.

| File or folder | What's inside |
| --- | --- |
| `site/` | The game page, Unity player files and cutscene videos |
| `asset-parts/` | Large game files split into smaller pieces for GitHub |
| `release-manifest.json` | File sizes and checksums used to check the download |
| `tools/` | Scripts that prepare, verify and serve the game |
| `dist/` | The ready-to-play folder created by the build command |
| `netlify.toml` | Settings for deploying on Netlify |

The prepared download is about **495 MiB**, including the game assets and cutscenes. Please let the first load finish.

## Download and play locally

You don't need Unity to play this version. You'll need a desktop computer, a keyboard and mouse, and a browser that supports WebGL 2.

### 1. Install Node.js

Install **Node.js 24 or newer** from [nodejs.org](https://nodejs.org/). Open a terminal and check that it is available:

```sh
node --version
```

### 2. Download the repository

On this GitHub page, click **Code → Download ZIP**, then extract the ZIP to a folder on your computer.

If you use Git, you can download it with:

```sh
git clone https://github.com/thearushsingh/Before-It-Melts.git
cd Before-It-Melts
```

### 3. Open a terminal in the downloaded folder

Make sure you're in the folder containing `package.json`. On Windows, open that folder in File Explorer, type `powershell` in the address bar and press Enter.

### 4. Prepare the game

Run:

```sh
npm run build
```

This joins the downloaded pieces, checks the files and creates `dist/`. No extra npm packages need to be installed.

### 5. Start the local server

Run:

```sh
npm start
```

Open **http://127.0.0.1:8080/** in your browser. Keep the terminal open while you play. Press **Ctrl + C** in the terminal to stop the server.

Use the local server rather than double-clicking `index.html`. The game needs HTTP to load its files correctly.

## How to play

Click **Play**, watch or skip the intro, then read the mission and controls screen.

Collect **10 cones and 10 ice cream sticks**, protect your three hearts and get Ari home before the timer runs out. The village section is untimed, so you can concentrate on finding your way through it.

| Key | Action |
| --- | --- |
| W / Up arrow | Accelerate |
| S / Down arrow | Reverse |
| A / Left arrow | Steer left |
| D / Right arrow | Steer right |
| Space | Brake |
| Shift | Boost, including while reversing |
| Esc | Pause |
| F / Left mouse button | Fire paintballs in the village |
| Shift + F | Use the energy dome in the village |

Avoid cars and potholes in the city. Use boost to escape the dogs in the forest. In the village, follow the arrows on the ground and use paintballs against the skeletons. The energy dome defeats nearby enemies, uses all your remaining boost and has an eight-second cooldown.

## Can I open these files in Unity?

The files in `site/Build/` are an exported game, not editable Unity scenes or scripts. Downloading this repository won't give you an `Assets/` folder to open in the editor.

If you have a copy of the **original Unity project**, here's how to open it:

1. Install **Unity Hub** and **Unity Editor 6000.5.6f1**. Add the **Web Build Support** module if you want to export a browser build.
2. In Unity Hub, choose **Add project from disk**.
3. Select the project folder containing `Assets`, `Packages` and `ProjectSettings`.
4. Open it with the matching Unity version and let Unity finish importing the assets.
5. Open `Assets/Scenes/MainMenu.unity` to start from the menu, or `Assets/Scenes/QuibliAnimeCity.unity` to inspect the gameplay scene.
6. Find the gameplay scripts in `Assets/TwoScoops/Scripts/` and the cutscene videos in `Assets/StreamingAssets/`.
7. Press Unity's **Play** button to try the game in the editor.

Those paths belong to the original project. They are not folders included in this public repository.

## Put the game on the web

### itch.io

1. Run `npm run build`.
2. ZIP the **contents** of `dist/`, with `index.html` directly at the ZIP's root.
3. Create or edit your itch.io project and choose **HTML** as the kind of project.
4. Upload the ZIP and check **This file will be played in the browser**.
5. Enable fullscreen support and test the uploaded game before publishing it.

### Netlify

1. Connect this GitHub repository to Netlify.
2. Use `main` as the branch.
3. Set the build command to `npm run build` and the publish directory to `dist`. The included `netlify.toml` already supplies these settings.
4. Deploy, then open the game using the HTTPS link Netlify gives you.

Neither service needs Unity installed to host this compiled release.

## Having trouble?

- **The page won't load:** Run `npm run build` before `npm start`, and make sure you're opening the server address.
- **Port 8080 is busy:** Run `npm start -- 8081`, then open `http://127.0.0.1:8081/`.
- **A download seems incomplete:** Run `npm run build` again. It checks the game files before preparing them.
- **The game runs slowly:** Close other heavy apps and check that browser graphics acceleration is enabled. This version is made for desktop keyboard and mouse play; it doesn't include mobile touch controls.

If you find a bug, [open an issue](https://github.com/thearushsingh/Before-It-Melts/issues) and tell me what happened, which browser you used and your computer's specs.

## Thanks for playing

If you like the game or find this repository useful, please **give it a star ⭐**. It helps other people find the project, and I'd love to hear what you think.

You can find me on Instagram: [@findingarush](https://www.instagram.com/findingarush/).

**Made by Arush · The Skull Bear Studios**
