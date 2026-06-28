# Sowjanya Silla Art Gallery

A static pastel art gallery website built for free hosting on GitHub Pages.

## Update Artworks

You do not need to edit `index.html`, `styles.css`, or `script.js` to add new art.

1. Upload the new photo to `assets/artworks/`.
2. Open `data/gallery.json`.
3. Add a new artwork object:

```json
{
  "title": "Artwork Name",
  "description": "Short description of the artwork.",
  "image": "assets/artworks/photo-file-name.jpg",
  "medium": "Acrylic on canvas",
  "year": "2026",
  "palette": ["#ff8fa3", "#b8f2d8", "#cdb4db", "#fff1a8"]
}
```

Supported image types include `.jpg`, `.png`, `.webp`, and `.svg`.

## Host Free On GitHub Pages

1. Create a GitHub repository.
2. Upload these files to the repository.
3. Go to `Settings` > `Pages`.
4. Set `Source` to `Deploy from a branch`.
5. Choose the `main` branch and `/root`, then save.
6. GitHub will show the public website URL after it deploys.

## Files

- `index.html` - page structure
- `styles.css` - pastel visual design and animations
- `script.js` - gallery loading, search, and lightbox
- `data/gallery.json` - artwork names, descriptions, and image paths
- `assets/artworks/` - artwork image files
