const galleryGrid = document.querySelector("#galleryGrid");
const searchInput = document.querySelector("#searchInput");
const emptyState = document.querySelector("#emptyState");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxTitle = document.querySelector("#lightboxTitle");
const lightboxDescription = document.querySelector("#lightboxDescription");
const lightboxMeta = document.querySelector("#lightboxMeta");
const lightboxPalette = document.querySelector("#lightboxPalette");
const closeLightbox = document.querySelector(".close-lightbox");
const cursorGlow = document.querySelector(".cursor-glow");

let artworks = [];

async function loadGallery() {
  try {
    const response = await fetch("data/gallery.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Gallery data failed to load: ${response.status}`);
    }

    artworks = await response.json();
    renderGallery(artworks);
  } catch (error) {
    galleryGrid.innerHTML = `<p class="empty-state">Gallery data could not be loaded. Please check data/gallery.json.</p>`;
    console.error(error);
  }
}

function renderGallery(items) {
  galleryGrid.innerHTML = "";
  emptyState.hidden = items.length > 0;

  const fragment = document.createDocumentFragment();

  items.forEach((artwork, index) => {
    const card = document.createElement("article");
    card.className = "art-card";
    card.tabIndex = 0;
    card.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
    card.innerHTML = `
      <img src="${escapeAttribute(artwork.image)}" alt="${escapeAttribute(artwork.title)}">
      <div>
        <div class="card-meta">
          <span>${escapeHtml(artwork.medium || "Artwork")}</span>
          <span>${escapeHtml(artwork.year || "")}</span>
        </div>
        <h3>${escapeHtml(artwork.title)}</h3>
        <p>${escapeHtml(artwork.description)}</p>
        ${renderPalette(artwork.palette)}
      </div>
    `;

    card.addEventListener("click", () => openArtwork(artwork));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openArtwork(artwork);
      }
    });

    fragment.appendChild(card);
  });

  galleryGrid.appendChild(fragment);
  requestAnimationFrame(() => {
    document.querySelectorAll(".art-card").forEach((card) => card.classList.add("is-visible"));
  });
}

function renderPalette(palette = []) {
  if (!palette.length) return "";

  return `<div class="palette" aria-label="Artwork colour palette">${renderSwatches(palette)}</div>`;
}

function renderSwatches(palette = []) {
  return palette
    .map((color) => `<span class="swatch" style="background:${escapeAttribute(color)}" title="${escapeAttribute(color)}"></span>`)
    .join("");
}

function filterGallery() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    renderGallery(artworks);
    return;
  }

  const filtered = artworks.filter((artwork) => {
    const searchable = [
      artwork.title,
      artwork.description,
      artwork.medium,
      artwork.year,
      ...(artwork.palette || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });

  renderGallery(filtered);
}

function openArtwork(artwork) {
  lightboxImage.src = artwork.image;
  lightboxImage.alt = artwork.title;
  lightboxTitle.textContent = artwork.title;
  lightboxDescription.textContent = artwork.description;
  lightboxMeta.textContent = [artwork.medium, artwork.year].filter(Boolean).join(" / ");
  lightboxPalette.innerHTML = renderSwatches(artwork.palette);
  lightbox.hidden = false;
  closeLightbox.focus();
  document.body.style.overflow = "hidden";
}

function hideLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

searchInput.addEventListener("input", filterGallery);
closeLightbox.addEventListener("click", hideLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) hideLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) hideLightbox();
});

document.addEventListener("pointermove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

loadGallery();



