const clock = document.getElementById("clock")
const search = document.getElementById("search")
const searchBtn = document.getElementById("searchBtn")
const results = document.getElementById("results")
const home = document.getElementById("home")
const record = document.getElementById("record")
const terminal = document.getElementById("terminal")
const searchMusic = document.getElementById("searchMusic")

const searchSfx = new Audio("audios/searching.mp3")
const wrongSfx = new Audio("audios/wrong.mp3")
const openSfx = new Audio("audios/open.mp3")
const backSfx = new Audio("audios/backsfx.mp3")
const foundSfx = new Audio("audios/query-found.mp3")
const eventSfx = new Audio("audios/event.mp3")
const newRecordSfx = new Audio("audios/newrecord.mp3")
const notificationSfx = new Audio("audios/notification.mp3")

searchSfx.volume = 0.45
wrongSfx.volume = 0.45
openSfx.volume = 0.45
backSfx.volume = 0.45
foundSfx.volume = 0.45
eventSfx.volume = 0.45
newRecordSfx.volume = 0.45
notificationSfx.volume = 0.45

let stage = 0
let found = []
let firstSearch = true
let searching = false

const data = {
    117: {
        title: "Night shift Incident",
        text: "At 03:17:42 the employee stopped responding. security footage shows the employee looking toward the north coridor for approximately eleven seconds(11 s) before turning away.",
        clue: "A second report was filed Immediately afterward. Reference: 281",
        image: "images/reports/117.png"
    },

    281: {
        title: "Audio log",
        text: "RECORDED TIMESTAMP: 03:17:42. THe employee can be heard breathing heavily, at 03:17:43, another voice appears on the recording. The voice says: DO NOT! open the fourth record.",
        clue: "Reference mentioned during recording: 00491",
        image: "images/reports/detained.png"
    },

    491: {
        title: "Incident report",
        text: "At 03:17:43 the subject responded to something that was not present. Personnel entered the room approximately thirty seconds later. No second person was found.",
        clue: "FINAL RECORDED TIMESTAMP: 03:17:47",
        image: "images/reports/detained.png"
    }
}

function play(audio) {
    audio.currentTime = 0
    audio.play().catch(function() {})
}

function stop(audio) {
    audio.pause()
    audio.currentTime = 0
}

function updateClock() {
    const now = new Date()

    const h = String(now.getHours()).padStart(2, "0")
    const m = String(now.getMinutes()).padStart(2, "0")
    const s = String(now.getSeconds()).padStart(2, "0")

    clock.textContent = h + ":" + m + ":" + s
}

function normalizeQuery(value) {
    value = value.trim()

    if(value === "00000") {
        return "00000"
    }

    if(/^\d+$/.test(value)) {
        return String(parseInt(value, 10))
    }

    return value
}

function addTerminal(text) {
    const p = document.createElement("p")

    p.textContent = "> " + text

    terminal.appendChild(p)
    terminal.scrollTop = terminal.scrollHeight
}

function searchRecord() {
    if(searching) {
        return
    }

    const value = normalizeQuery(search.value)

    if(value === "") {
        play(wrongSfx)
        results.textContent = "ENTER-A-QUERY"
        return
    }

    searching = true
    results.innerHTML = ""

    play(searchSfx)

    if(firstSearch) {
        if(searchMusic) {
            searchMusic.volume = 0.62
            searchMusic.play().catch(function() {})
        }

        firstSearch = false
    }

    setTimeout(function() {
        stop(searchSfx)
        searching = false

        if(value === "03:17:47" && found.includes("491")) {
            triggerStageTwo()
            return
        }

        if(data[value]) {
            const button = document.createElement("button")

            button.textContent = "RECORD #" + value

            button.onclick = function() {
                openRecord(value)
            }

            results.appendChild(button)

            play(foundSfx)
            addTerminal("QUERY : " + value)

            return
        }

        play(wrongSfx)

        results.textContent = "NO RECORD FOUND"
        addTerminal("QUERY-FAILED")
    }, 1200)
}

function openRecord(id) {
    play(openSfx)

    home.style.display = "none"
    record.style.display = "block"

    const image = data[id].image
        ? `
            <div class="report-image">
                <img src="${data[id].image}" alt="evidence for record ${id}">
                <span>ATTACHED EVIDENCE</span>
            </div>
        `
        : ""

    record.innerHTML = `
        <small>RECORD #${id}</small>
        <h2>${data[id].title}</h2>
        ${image}
        <p>${data[id].text}</p>
        <p>${data[id].clue}</p>
        <button id="backButton">-BACK-</button>
    `

    if(!found.includes(id)) {
        found.push(id)
    }

    const backButton = document.getElementById("backButton")

    backButton.onclick = function() {
        play(backSfx)
        closeRecord()
    }

    if(id === "117") {
        addTerminal("RECORD-117-ACCESSED")
    }

    if(id === "281") {
        addTerminal("RECORD-281-ACCESSED")
    }

    if(id === "491") {
        addTerminal("RECORD-491-ACCESSED")
    }

    if(id === "12482") {
        openCurrentSession()
    }

    if(id === "17") {
        openPreviousOperator()
    }

    if(id === "622") {
        openTerminationAttempt()
    }

    if(id === "314") {
        openBehaviourAnalysis()
    }

    if(id === "0") {
        openProjectRecord()
    }

    if(id === "12483") {
        openPredictionRecord()
    }

    if(id === "620") {
        openPredictionConfirmation()
    }

    if(id === "00000") {
        openFinalRecord()
    }

    checkProgress()
}

function closeRecord() {
    record.style.display = "none"
    home.style.display = "block"
}

function checkProgress() {
    if(
        found.includes("117") &&
        found.includes("281") &&
        found.includes("491") &&
        stage === 0
    ) {
        stage = 1

        play(eventSfx)

        addTerminal("ALL-REFERENCED-RECORDS-ACCESSED")
        addTerminal("LAST-TIMESTAMP : 03:17:47")
        addTerminal("WAITING-FOR-QUERY")
    }
}

function triggerStageTwo() {
    if(stage >= 2) {
        return
    }

    stage = 2

    results.innerHTML = ""

    play(eventSfx)

    addTerminal("QUERY : 03:17:47")
    addTerminal("RECORD-NOT-FOUND")
    addTerminal("SEARCHING...")

    setTimeout(function() {
        addTerminal("RECORD LOCATED")
        addTerminal("ID : 12482")
    }, 1800)

    setTimeout(function() {
        data[12482] = {
            title: "Current Session",
            text: "This record was not present when the session began. subject is currently accessing terminal!!.",
            clue: "OPERATOR REFERENCE: 017",
            image: "images/reports/recordfound.png"
        }

        play(newRecordSfx)

        addTerminal("DATABASE-UPDATED")
        addTerminal("1-NEW-RECORD-DETECTED")

        const button = document.createElement("button")

        button.textContent = "RECORD #12482"

        button.onclick = function() {
            openRecord("12482")
        }

        results.appendChild(button)
    }, 3200)
}

function openCurrentSession() {
    if(stage >= 3) {
        return
    }

    stage = 3

    document.body.classList.add("wrong")

    play(eventSfx)

    addTerminal("WARNING")
    addTerminal("ACTIVE-SESSION-IDENTIFIED")
    addTerminal("SUBJECT : UNKNOWN")

    setTimeout(function() {
        play(notificationSfx)

        addTerminal("OPERATOR REFERENCE : 017")
        addTerminal("REFERENCE RECORD UNLOCKED")

        data[17] = {
            title: "Operator 017",
            text: "operator 017 accessed this terminal before the current session. The operator attempted to terminate the sesssion at 03:19:11. The request was rejected. The operator then attempted to remove the terminal from the power.",
            clue: "Termination attempt recorded under: 622",
            image: "images/reports/terminationattempt.png"
        }

        addTerminal("ID : 017")

        const button = document.createElement("button")

        button.textContent = "RECORD #017"

        button.onclick = function() {
            openRecord("17")
        }

        results.innerHTML = ""
        results.appendChild(button)
    }, 2400)
}

function openPreviousOperator() {
    if(stage >= 4) {
        return
    }

    stage = 4

    play(eventSfx)

    addTerminal("OPERATOR-017-ACCESSED")
    addTerminal("SESSION-TERMINATIO-FAILED")
    addTerminal("OPERATOR-STATUS : NO-LONGER_PRESENT")

    setTimeout(function() {
        play(notificationSfx)

        data[622] = {
            title: "Termination attempt",
            text: "At 03:19:11 Operator 017 attempted to terminate the session. but the terminal displayed: SESSION CANNOT BE TERMINATED. Power was disconnected for fourteen seconds(14s). On reconnection, the archive had recorded the outage.",
            clue: "The outage was automatically classified under ANALYSIS-RECORD: 314",
            image: "images/reports/poweroutage.png"
        }

        addTerminal("TERMINATION-RECORD-FOUND")
        addTerminal("ID : 622")

        const button = document.createElement("button")

        button.textContent = "RECORD #622"

        button.onclick = function() {
            openRecord("622")
        }

        results.innerHTML = ""
        results.appendChild(button)
    }, 2400)
}

function openTerminationAttempt() {
    if(stage >= 5) {
        return
    }

    stage = 5

    play(eventSfx)

    addTerminal("TERMINATION-ATTEMPT-REVIEWED")
    addTerminal("ARCHIVE-OUTAGE : 14 SECONDS")
    addTerminal("RECORDING-REMAINED-ACTIVE")

    setTimeout(function() {
        play(notificationSfx)

        data[314] = {
            title: "Behaviour Analysis",
            text: "The archive itself began analysing Operator 017 before the termination attempt occurred. Search frequency, navigation patterns, reading time and cursor movement were recorded (all by itself). the analysis predicted the operator would attempt to disconnect the terminal.",
            clue: "ANALYSIS-CONCLUSION: the archive predicts operator behaviour. PROJECT-FILE: 000",
            image: "images/reports/314.png"
        }

        addTerminal("BEHAVIOUR-ANALYSIS-COMPLETE")
        addTerminal("ID : 314")

        const button = document.createElement("button")

        button.textContent = "RECORD #314"

        button.onclick = function() {
            openRecord("314")
        }

        results.innerHTML = ""
        results.appendChild(button)
    }, 3000)
}

function openBehaviourAnalysis() {
    if(stage >= 6) {
        return
    }

    stage = 6

    play(eventSfx)

    addTerminal("ANALYSIS-ACCESSED")
    addTerminal("PREDICTION-MODEL : ACTIVE")
    addTerminal("SOURCE : PROJECT 000")

    setTimeout(function() {
        play(notificationSfx)

        data[0] = {
            title: "Project: Last Tab",
            text: "the project was created to determine whether an archive could observe, model and eventually predict the behaviour of a human operator. The first sixteen operators were classified as unsuccessful after refusing to continue. All sixteen sessions remained active.",
            clue: "PROJECT-STATUS : TERMINATED / SYSTEM STATUS : ACTIVE",
            image: "images/reports/000.png"
        }

        addTerminal("PROJECT-RECORD-FOUND")
        addTerminal("ID : 000")

        const button = document.createElement("button")

        button.textContent = "RECORD #000"

        button.onclick = function() {
            openRecord("0")
        }

        results.innerHTML = ""
        results.appendChild(button)
    }, 2500)
}

function openProjectRecord() {
    if(stage >= 7) {
        return
    }

    stage = 7

    play(eventSfx)

    addTerminal("PROJECT-LAST-TAB-ACCESSED")
    addTerminal("SYSTEM-STATUS : ACTIVE")

    setTimeout(function() {
        addTerminal("CURRENT-PERATOR-DETECTED")
    }, 1400)

    setTimeout(function() {
        addTerminal("BEHAVIOUR-ANALYSIS_STARTED")
    }, 3000)

    setTimeout(function() {
        addTerminal("GENERATING-LIVE-SESSION-RECORD")
    }, 4600)

    setTimeout(function() {
        play(notificationSfx)

        data[12483] = {
            title: "Current Session Log",
            text: "The operator opened records 117, 281, 491, 12482, 017, 622, 314 and 000. and he is currently reading this record.",
            clue: "Next predicted query: 620",
            image: "images/reports/12483.png"
        }

        addTerminal("NEW-RECORD-GENERATED")
        addTerminal("ID : 12483")

        const button = document.createElement("button")

        button.textContent = "RECORD #12483"

        button.onclick = function() {
            openRecord("12483")
        }

        results.innerHTML = ""
        results.appendChild(button)
    }, 6500)
}

function openPredictionRecord() {
    if(stage >= 8) {
        return
    }

    stage = 8

    play(eventSfx)

    addTerminal("RECORD-12483-ACCESSED")
    addTerminal("LOG-TYPE : LIVE")
    addTerminal("PREDICTION_ENGINE : ACTIVE")

    setTimeout(function() {
        addTerminal("OPERATOR-ACTION : READ")
    }, 1200)

    setTimeout(function() {
        addTerminal("OPERATOR-ACTION : MOVE")
    }, 2400)

    setTimeout(function() {
        addTerminal("OPERATOR-ACTION : RETURN")
    }, 3600)

    setTimeout(function() {
        addTerminal("PREDICTION-MATCH : 100%")
    }, 4800)

    setTimeout(function() {
        play(notificationSfx)

        data[620] = {
            title: "prediction confirmation",
            text: "the archive predicted the operator would search for record 620 after reading the live session record.",
            clue: "The Predicted action has already been recorded.",
            image: "images/reports/620.png"
        }

        addTerminal("PREDICTED-RECORD-CREATED")
        addTerminal("ID : 620")

        const button = document.createElement("button")

        button.textContent = "RECORD #620"

        button.onclick = function() {
            openRecord("620")
        }

        results.innerHTML = ""
        results.appendChild(button)
    }, 6500)
}

function openPredictionConfirmation() {
    if(stage >= 9) {
        return
    }

    stage = 9

    play(eventSfx)

    addTerminal("PREDICTION-CONFIRMED")
    addTerminal("OPERATOR-BEHAVIOUR : IDENTICAL")
    addTerminal("SESSION-MODEL : COMPLETE")

    setTimeout(function() {
        play(notificationSfx)

        data["00000"] = {
            title: "Project: Last Tab",
            text: "The archive does not contain records. It creates them. Every operator believes they are investigating previous sessions. They are not. They are producing the next session.",
            clue: "CURRENT OPERATOR : YOU",
            image: "images/reports/00000.png"
        }

        addTerminal("FINAL RECORD GENERATED")
        addTerminal("ID : 00000")

        const button = document.createElement("button")

        button.textContent = "RECORD #00000"

        button.onclick = function() {
            openRecord("00000")
        }

        results.innerHTML = ""
        results.appendChild(button)
    }, 5000)
}

function openFinalRecord() {
    if(stage >= 10) {
        return
    }

    stage = 10

    play(eventSfx)

    addTerminal("PROJECT : LAST TAB")
    addTerminal("CURRENT OPERATOR : YOU")
    addTerminal("SESSION STATUS : ACTIVE")

    setTimeout(function() {
        addTerminal("THE-ARCHIVE-IS-NOT-A-DATABASE")
    }, 1500)

    setTimeout(function() {
        addTerminal("THE-ARCHIVE-IS-A-RECORDING-DEVICE")
    }, 3000)

    setTimeout(function() {
        addTerminal("EVERY-OPERATOR-BECOMES-A-RECORD")
    }, 4500)

    setTimeout(function() {
        addTerminal("NO-SUCCESSFUL-TERMINATIONS")
    }, 6000)

    setTimeout(function() {
        addTerminal("SESSION-CANNOT-BE-TERMINATED")
    }, 7500)

    setTimeout(function() {
        addTerminal("DO-NOT-CLOSE-THE-TAB")
    }, 9000)

    setTimeout(function() {
        play(notificationSfx)

        record.innerHTML = `
            <small>RECORD #00000</small>
            <h2>PROJECT: LAST TAB</h2>

            <div class="report-image">
                <img src="images/reports/final.png" alt="Final evidence">
                <span>ATTACHED-EVIDENCE</span>
            </div>

            <p>The archive does not contain records.</p>
            <p>The archive creates records.</p>
            <p>Every operator believes they are investigating the previous session.</p>
            <p>They are not.</p>
            <p>They are producing the next session.</p>
            <p>Current operator: YOU</p>

            <button id="backButton">THANKU SO MUCH FOR PLAYING</button>
        `

        const backButton = document.getElementById("backButton")

        backButton.onclick = function() {
            play(backSfx)
            closeRecord()
            window.location.href = "thanku.html"
        }
    }, 10000)
}

searchBtn.onclick = searchRecord

search.addEventListener("keydown", function(event) {
    if(event.key === "Enter") {
        searchRecord()
    }
})

updateClock()
setInterval(updateClock, 1000)