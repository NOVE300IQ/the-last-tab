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

const enterButton = document.getElementById("enterButton");
const enterPopup = document.getElementById("enterPopup");
const continueButton = document.getElementById("continueButton");
const cancelButton = document.getElementById("cancelButton")

enterButton.addEventListener("click", () =>{
    enterPopup.style.display = "flex";
});

cancelButton.addEventListener("click", () => {
    enterPopup.style.display = "none";
});

continueButton.addEventListener("click", () =>{
    window.location.href = "main.html";
});