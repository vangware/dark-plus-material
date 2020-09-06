# Dark+ Material

![Dark+ Material logo](https://i.imgur.com/dbU1a3i.png)

## Reason behind this

I really love the default Dark+ Theme that comes with Visual Studio Code, but also love the Material Design Palette. The thing is I didn't found a good material theme (the coloring is always ugly for my taste). So I made this theme that implements the Material Design Palette in the Dark+ theme that comes with Visual Studio Code.

## How is this theme updated?

When VSCode makes an update, I run a script that takes the code from the VSCode repository, pipes it trough a mapping function and it results in the json file for this theme:

```plain
VSCode update -> mapping (1 VSCode color => 1 Material color) -> Dark+ Material update.
```

## Screenshots

### JavaScript

![JavaScript example](https://raw.githubusercontent.com/vangware/dark-plus-material/main/screenshots/javascript.png)

### LESS

![LESS example](https://raw.githubusercontent.com/vangware/dark-plus-material/main/screenshots/less.png)

### TypeScript

![TypeScript example](https://raw.githubusercontent.com/vangware/dark-plus-material/main/screenshots/typescript.png)

## Installing

Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.

```bash
ext install dark-plus-material
```

## Recommended Plugins and settings

- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) (by [Philipp Kief](https://github.com/PKief)): Beautiful icon theme that looks awesome with this theme.
- [FiraCode](https://github.com/tonsky/FiraCode) (by [Nikita Prokopov](https://github.com/tonsky)): The best code ligature font I found, used in the screenshots.
