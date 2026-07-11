const hoverImg = document.getElementById("hover-img");
const hoverFilm = document.getElementById("hover-film");

const animations = [
    "fan-out",
    "slide-left",
    "slide-right"
];

let current = 0;

document.querySelectorAll(".story-p").forEach((p) => {

    p.addEventListener("mouseenter", () => {

        hoverImg.src = p.dataset.image;

        hoverFilm.className = "xray-film";

        hoverFilm.classList.add("show");
        hoverFilm.classList.add(animations[current]);

        current = (current + 1) % animations.length;

    });

    p.addEventListener("mouseleave", () => {

        hoverFilm.className = "xray-film";

    });

});