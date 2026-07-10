const previewImg = document.getElementById("previewImg");

// Images hover near Puma Logo
document.querySelectorAll(".indie-btn").forEach(btn => {

    btn.addEventListener("mouseenter", () => {

        btn.classList.add("is-hovered");

        // Don't recolor modal buttons
        if (!btn.classList.contains("modal-button")) {
            btn.style.backgroundColor = "var(--cl-orange)";
        }

        const anchor = btn.querySelector("a");

        if (anchor) {
            anchor.style.color = "#ffffff";
        }

        const imgPath = btn.dataset.preview;

        if (imgPath) {

            previewImg.src = imgPath;
            previewImg.classList.add("show-preview");

            previewImg.style.filter =
                "brightness(0) saturate(100%) invert(25%) sepia(99%) saturate(3354%) hue-rotate(205deg) brightness(98%) contrast(101%)";

        }

    });

    btn.addEventListener("mouseleave", () => {

        btn.classList.remove("is-hovered");

        if (!btn.classList.contains("modal-button")) {
            btn.style.backgroundColor = "var(--cl-lime)";
        }

        const anchor = btn.querySelector("a");

        if (anchor) {
            anchor.style.color = "#000000";
        }

        previewImg.classList.remove("show-preview");

    });

});


// =========================
// PROJECT MODAL
// =========================

const modal = document.getElementById("projectModal");

const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalGallery = document.getElementById("modalGallery");

const liveButton = document.getElementById("liveButton");
const githubButton = document.getElementById("githubButton");

const closeModal = document.getElementById("closeModal");


// =========================
// IMAGE LIGHTBOX
// =========================

const imageLightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");


// =========================
// OPEN PROJECT MODAL
// =========================

document.querySelectorAll(".project-btn").forEach(button => {

    button.addEventListener("click", () => {

        modalTitle.textContent = button.dataset.title;

        modalDescription.textContent =
            button.dataset.description || "No description available.";

        modalGallery.innerHTML = "";

        const images = JSON.parse(button.dataset.images || "[]");

        if (images.length > 0) {

            images.forEach(image => {

                const img = document.createElement("img");

                img.src = image.url;
                img.alt = image.name;
                img.loading = "lazy";

                img.addEventListener("click", () => {

                    lightboxImage.src = image.url;
                    imageLightbox.classList.remove("hidden");

                });

                modalGallery.appendChild(img);

            });

            modalGallery.style.display = "flex";

        } else {

            modalGallery.style.display = "none";

        }

        githubButton.href = button.dataset.github;
        githubButton.style.display = "flex";

        if (button.dataset.live && button.dataset.live.trim() !== "") {

            liveButton.href = button.dataset.live;
            liveButton.style.display = "flex";

        } else {

            liveButton.style.display = "none";

        }

        modal.classList.remove("hidden");

    });

});


// =========================
// CLOSE PROJECT MODAL
// =========================

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", e => {

    if (e.target === modal) {
        modal.classList.add("hidden");
    }

});


// =========================
// LIGHTBOX
// =========================

closeLightbox.addEventListener("click", () => {

    imageLightbox.classList.add("hidden");

});

imageLightbox.addEventListener("click", e => {

    if (e.target === imageLightbox) {
        imageLightbox.classList.add("hidden");
    }

});


// =========================
// ESC KEY
// =========================

document.addEventListener("keydown", e => {

    if (e.key !== "Escape") return;

    modal.classList.add("hidden");
    imageLightbox.classList.add("hidden");

});