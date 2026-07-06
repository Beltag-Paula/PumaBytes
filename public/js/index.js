const hoverImages = {
    project0: "/images/aboutme.png",
    project1: "/images/project2.png",
    project2: "/images/project2.png",
    project3: "/images/project2.png",
    project4: "/images/project2.png",
    project5: "/images/project2.png",

    public0: "/images/info.png",
    public1: "/images/github.png",
    public2: "/images/blog.png",
    public3: "/images/youtube.png",
    public4: "/images/linkedin.png",
    public5: "/images/contact.png"
};

const previewImg = document.getElementById("previewImg");

function changeColor(myDiv) {
    myDiv.addEventListener("mouseover", function () {
        // Keeps your preferred hover orange
        myDiv.style.backgroundColor = "var(--cl-hover)";
        myDiv.style.color = "#ffffff"; 

        const img = hoverImages[myDiv.id];
        if (img) {
            previewImg.src = img;
            previewImg.style.opacity = 1;
            previewImg.style.filter = "brightness(0) saturate(100%) invert(25%) sepia(99%) saturate(3354%) hue-rotate(205deg) brightness(98%) contrast(101%)";
        }
    });

    myDiv.addEventListener("mouseleave", () => {
        myDiv.style.backgroundColor = "var(--cl2)";
        myDiv.style.color = "#000000"; // Resets back to clean black text
        previewImg.style.opacity = 0;
    });
}

const allDivs = [
    document.getElementById("project0"),
    document.getElementById("project1"),
    document.getElementById("project2"),
    document.getElementById("project3"),
    document.getElementById("project4"),
    document.getElementById("project5"),

    document.getElementById("public0"),
    document.getElementById("public1"),
    document.getElementById("public2"),
    document.getElementById("public3"),
    document.getElementById("public4"),
    document.getElementById("public5")
];

allDivs.forEach(lilDiv => {
    changeColor(lilDiv);
});