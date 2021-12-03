let downloadSoftwareBtn = document.getElementById("downloadSoftwareBtn")
let getStartedBtn = document.getElementById("getStartedBtn")

downloadSoftwareBtn.addEventListener("click", function() {
    console.log("download")
    location.replace("https://automationnode.github.io/software/index.html")
})

getStartedBtn.addEventListener("click", function() {
    location.replace("https://automationnode.github.io/software/getStarted/index.html")
})