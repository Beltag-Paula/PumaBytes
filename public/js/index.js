const previewImg = document.getElementById("previewImg");
const allButtons = document.querySelectorAll(".indie-btn");

allButtons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
        btn.classList.add("is-hovered");
        btn.style.backgroundColor = "var(--cl-orange)";
        
        const anchor = btn.querySelector("a");
        if (anchor) anchor.style.color = "#ffffff";

        // PROFESSIONAL FIX: Read the image path directly from the HTML data property!
        const imgPath = btn.dataset.preview; 
        if (imgPath) {
            previewImg.src = imgPath;
            previewImg.classList.add("show-preview");
            previewImg.style.filter = "brightness(0) saturate(100%) invert(25%) sepia(99%) saturate(3354%) hue-rotate(205deg) brightness(98%) contrast(101%)";
        }
    });

    btn.addEventListener("mouseleave", () => {
        btn.classList.remove("is-hovered");
        btn.style.backgroundColor = "var(--cl-lime)";
        
        const anchor = btn.querySelector("a");
        if (anchor) anchor.style.color = "#000000";

        previewImg.classList.remove("show-preview");
    });
});