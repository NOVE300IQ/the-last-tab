const popup = document.getElementById("musicPopup");
const allowMusic = document.getElementById("allowMusic")
const denyMusic = document.getElementById("denyMusic");
const bgMusic = document.getElementById("bgMusic")

allowMusic.addEventListener("click", () => {
    bgMusic.volume = 0.35;
    bgMusic.play();
    popup.style.display = "none";
});
denyMusic.addEventListener("click", () => {
    popup.style.display = "none";
})