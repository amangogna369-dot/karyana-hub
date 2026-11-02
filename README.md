# Karayana Hub

Static website (HTML, CSS, JavaScript). No build step.

## Run locally
- VS Code: open this folder, right-click `index.html`, "Open with Live Server"
- or run `python -m http.server 8000` here and open http://localhost:8000

## Edit the shop
Everything editable is in `js/data.js`:
1. `SHOP`: WhatsApp number (digits with country code, e.g. 919876543210), phone, address, hours. Empty values are hidden.
2. `PRODUCTS`: name, description, category, price (0 hides it), stock, optional photo path.
3. `GALLERY`: the "Inside the shop" photos.

## Deploy (Vercel)
Push this folder to GitHub, import the repo in Vercel, leave build settings empty, deploy.
