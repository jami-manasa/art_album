// const galleryGrid = document.querySelector("#galleryGrid");
// const searchInput = document.querySelector("#searchInput");
// const emptyState = document.querySelector("#emptyState");
// const lightbox = document.querySelector("#lightbox");
// const lightboxImage = document.querySelector("#lightboxImage");
// const lightboxTitle = document.querySelector("#lightboxTitle");
// const lightboxDescription = document.querySelector("#lightboxDescription");
// const lightboxMeta = document.querySelector("#lightboxMeta");
// const lightboxPalette = document.querySelector("#lightboxPalette");
// const closeLightbox = document.querySelector(".close-lightbox");
// const cursorGlow = document.querySelector(".cursor-glow");

// let artworks = [];

// async function loadGallery() {
//   try {
//     const response = await fetch("data/gallery.json", { cache: "no-store" });

//     if (!response.ok) {
//       throw new Error(`Gallery data failed to load: ${response.status}`);
//     }

//     artworks = await response.json();
//     renderGallery(artworks);
//   } catch (error) {
//     galleryGrid.innerHTML = `<p class="empty-state">Gallery data could not be loaded. Please check data/gallery.json.</p>`;
//     console.error(error);
//   }
// }

// function renderGallery(items) {
//   galleryGrid.innerHTML = "";
//   emptyState.hidden = items.length > 0;

//   const fragment = document.createDocumentFragment();

//   items.forEach((artwork, index) => {
//     const card = document.createElement("article");
//     card.className = "art-card";
//     card.tabIndex = 0;
//     card.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
//     card.innerHTML = `
//       <img src="${escapeAttribute(artwork.image)}" alt="${escapeAttribute(artwork.title)}">
//       <div>
//         <div class="card-meta">
//           <span>${escapeHtml(artwork.medium || "Artwork")}</span>
//           <span>${escapeHtml(artwork.year || "")}</span>
//         </div>
//         <h3>${escapeHtml(artwork.title)}</h3>
//         <p>${escapeHtml(artwork.description)}</p>
//         ${renderPalette(artwork.palette)}
//       </div>
//     `;

//     card.addEventListener("click", () => openArtwork(artwork));
//     card.addEventListener("keydown", (event) => {
//       if (event.key === "Enter" || event.key === " ") {
//         event.preventDefault();
//         openArtwork(artwork);
//       }
//     });

//     fragment.appendChild(card);
//   });

//   galleryGrid.appendChild(fragment);
//   requestAnimationFrame(() => {
//     document.querySelectorAll(".art-card").forEach((card) => card.classList.add("is-visible"));
//   });
// }

// function renderPalette(palette = []) {
//   if (!palette.length) return "";

//   return `<div class="palette" aria-label="Artwork colour palette">${renderSwatches(palette)}</div>`;
// }

// function renderSwatches(palette = []) {
//   return palette
//     .map((color) => `<span class="swatch" style="background:${escapeAttribute(color)}" title="${escapeAttribute(color)}"></span>`)
//     .join("");
// }

// function filterGallery() {
//   const query = searchInput.value.trim().toLowerCase();

//   if (!query) {
//     renderGallery(artworks);
//     return;
//   }

//   const filtered = artworks.filter((artwork) => {
//     const searchable = [
//       artwork.title,
//       artwork.description,
//       artwork.medium,
//       artwork.year,
//       ...(artwork.palette || []),
//     ]
//       .join(" ")
//       .toLowerCase();

//     return searchable.includes(query);
//   });

//   renderGallery(filtered);
// }

// function openArtwork(artwork) {
//   lightboxImage.src = artwork.image;
//   lightboxImage.alt = artwork.title;
//   lightboxTitle.textContent = artwork.title;
//   lightboxDescription.textContent = artwork.description;
//   lightboxMeta.textContent = [artwork.medium, artwork.year].filter(Boolean).join(" / ");
//   lightboxPalette.innerHTML = renderSwatches(artwork.palette);
//   lightbox.hidden = false;
//   closeLightbox.focus();
//   document.body.style.overflow = "hidden";
// }

// function hideLightbox() {
//   lightbox.hidden = true;
//   lightboxImage.src = "";
//   document.body.style.overflow = "";
// }

// function escapeHtml(value = "") {
//   return String(value)
//     .replaceAll("&", "&amp;")
//     .replaceAll("<", "&lt;")
//     .replaceAll(">", "&gt;")
//     .replaceAll('"', "&quot;")
//     .replaceAll("'", "&#039;");
// }

// function escapeAttribute(value = "") {
//   return escapeHtml(value).replaceAll("`", "&#096;");
// }

// searchInput.addEventListener("input", filterGallery);
// closeLightbox.addEventListener("click", hideLightbox);
// lightbox.addEventListener("click", (event) => {
//   if (event.target === lightbox) hideLightbox();
// });

// document.addEventListener("keydown", (event) => {
//   if (event.key === "Escape" && !lightbox.hidden) hideLightbox();
// });

// document.addEventListener("pointermove", (event) => {
//   cursorGlow.style.left = `${event.clientX}px`;
//   cursorGlow.style.top = `${event.clientY}px`;
// });

// loadGallery();






/* ============================================================
   Sowjanya Silla Art Gallery — script.js
   ============================================================ */

// DOM refs
const galleryGrid   = document.querySelector("#galleryGrid");
const searchInput   = document.querySelector("#searchInput");
const emptyState    = document.querySelector("#emptyState");
const lightbox      = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxTitle = document.querySelector("#lightboxTitle");
const lightboxDesc  = document.querySelector("#lightboxDescription");
const lightboxMeta  = document.querySelector("#lightboxMeta");
const lightboxPalette = document.querySelector("#lightboxPalette");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxBack  = document.querySelector(".lightbox-backdrop");
const cursorGlow    = document.querySelector(".cursor-glow");
const siteHeader    = document.querySelector("#site-header");
const chips         = document.querySelectorAll(".chip");

let artworks       = [];
let activeFilter   = "all";
let lastFocused    = null;

/* ---- DATA ---- */
async function loadGallery() {
  try {
    const res = await fetch("data/gallery.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    artworks = await res.json();
    renderGallery(artworks);
  } catch (err) {
    galleryGrid.innerHTML = `<p class="empty-state">Gallery data could not be loaded. Please check data/gallery.json.</p>`;
    console.error(err);
  }
}

/* ---- RENDER ---- */
function renderGallery(items) {
  galleryGrid.innerHTML = "";
  emptyState.hidden = items.length > 0;
  if (!items.length) return;

  const fragment = document.createDocumentFragment();

  items.forEach((art, i) => {
    const card = document.createElement("article");
    card.className = "art-card";
    card.tabIndex = 0;
    card.style.transitionDelay = `${Math.min(i * 60, 360)}ms`;
    card.setAttribute("aria-label", `${art.title}, ${art.medium || "Artwork"}`);

    card.innerHTML = `
      <div class="art-card-image-wrap">
        <img
          src="${escapeAttr(art.image)}"
          alt="${escapeAttr(art.title)}"
          loading="lazy"
          decoding="async">
        <div class="art-card-overlay" aria-hidden="true">
          <span class="art-card-overlay-text">View artwork</span>
        </div>
      </div>
      <div class="art-card-body">
        <div class="card-meta">
          <span>${escapeHtml(art.medium || "Artwork")}</span>
          <span>${escapeHtml(String(art.year || ""))}</span>
        </div>
        <h3>${escapeHtml(art.title)}</h3>
        <p>${escapeHtml(art.description)}</p>
        ${buildPalette(art.palette)}
      </div>
    `;

    card.addEventListener("click", () => openLightbox(art, card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(art, card); }
    });

    fragment.appendChild(card);
  });

  galleryGrid.appendChild(fragment);

  // Trigger reveal on next frame
  requestAnimationFrame(() => {
    document.querySelectorAll(".art-card").forEach(c => c.classList.add("is-visible"));
  });
}

/* ---- PALETTE ---- */
function buildPalette(palette = []) {
  if (!palette.length) return "";
  const swatches = palette.map(c =>
    `<span class="swatch" style="background:${escapeAttr(c)}" title="${escapeAttr(c)}" aria-hidden="true"></span>`
  ).join("");
  return `<div class="palette" aria-label="Artwork colour palette">${swatches}</div>`;
}

/* ---- FILTER ---- */
function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();

  let filtered = artworks;

  if (activeFilter !== "all") {
    filtered = filtered.filter(a => (a.medium || "") === activeFilter);
  }

  if (query) {
    filtered = filtered.filter(a => {
      const blob = [a.title, a.description, a.medium, String(a.year || ""), ...(a.palette || [])].join(" ").toLowerCase();
      return blob.includes(query);
    });
  }

  renderGallery(filtered);
}

/* ---- LIGHTBOX ---- */
function openLightbox(art, trigger) {
  lastFocused = trigger;
  lightboxImage.src    = art.image;
  lightboxImage.alt    = art.title;
  lightboxTitle.textContent = art.title;
  lightboxDesc.textContent  = art.description;
  lightboxMeta.textContent  = [art.medium, art.year].filter(Boolean).join(" / ");
  lightboxPalette.innerHTML = buildPalette(art.palette).replace('<div class="palette" aria-label="Artwork colour palette">', "").replace("</div>", "");
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

/* ---- HEADER SCROLL ---- */
const headerObserver = new IntersectionObserver(
  ([e]) => siteHeader.classList.toggle("scrolled", !e.isIntersecting),
  { rootMargin: "-80px 0px 0px 0px" }
);
headerObserver.observe(document.querySelector("#top"));

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---- CURSOR ---- */
document.addEventListener("pointermove", (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top  = `${e.clientY}px`;
});
document.addEventListener("pointerdown", () => document.body.classList.add("cursor-active"));
document.addEventListener("pointerup",   () => document.body.classList.remove("cursor-active"));

/* ---- EVENTS ---- */
searchInput.addEventListener("input", applyFilters);

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    applyFilters();
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxBack.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
});

/* ---- FOCUS TRAP in lightbox ---- */
lightbox.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const focusable = [...lightbox.querySelectorAll('button, a, [tabindex="0"]')].filter(el => !el.closest("[hidden]"));
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
  }
});

/* ---- UTILS ---- */
function escapeHtml(v = "") {
  return String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(v = "") {
  return escapeHtml(v).replaceAll("`", "&#096;");
}

/* ---- INIT ---- */
loadGallery();
