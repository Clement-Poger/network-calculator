# Network Calculator

A lightweight, browser-based IPv4 subnet calculator. Enter an IPv4 address and a subnet mask to view the network and broadcast addresses, usable host range, and number of usable host addresses.

## Features

- Accepts dotted-decimal subnet masks (for example, `255.255.255.0`) or CIDR prefixes from `/0` to `/32`.
- Displays the network address, broadcast address, first and last usable hosts, and usable host count.
- Handles `/31` point-to-point networks and `/32` single-address networks.
- Supports English (UK) and French.
- Includes light and dark themes, with language and theme preferences saved in the browser.
- Responsive layout with input validation and an example subnet.
- Runs entirely in the browser; no build step or package installation is required.

## Run locally

Open `index.html` in a modern web browser. Alternatively, serve the folder with a local static web server and open its `index.html` URL.

## Project files

- `index.html` — page structure and form.
- `style.css` — responsive layout, themes, and visual styling.
- `app.js` — input validation, IPv4 subnet calculations, translations, and saved preferences.

## Calculation notes

For prefixes `/0` through `/30`, the network and broadcast addresses are excluded from the usable host count. For `/31`, both addresses are treated as usable for point-to-point links; a `/32` contains one usable address.
