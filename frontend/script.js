// ======================
// Generate Story
// ======================

async function generateStory() {

    alert("Generate button clicked");

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const character = document.getElementById("character").value;
    const theme = document.getElementById("theme").value;
    const length = document.getElementById("length").value;
    const style = document.getElementById("style").value;

    if (!name || !age || !character || !theme) {
        alert("Please fill all fields");
        return;
    }

    const storyBox =
        document.getElementById("story");

    storyBox.innerHTML =
        "✨ Creating magical bedtime story...";

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify({
                    name,
                    age,
                    character,
                    theme,
                    length,
                    style
                })
            }
        );

        const data =
            await response.json();

        if(data.error){
            storyBox.innerHTML =
                "❌ " + data.error;
            return;
        }

        storyBox.innerHTML =
            data.story;

        const cover =
            document.getElementById(
                "coverDetails"
            );

        if(cover){

            cover.innerHTML = `
            👦 ${name}<br>
            🎂 Age: ${age}<br>
            🦸 Character: ${character}<br>
            📚 Theme: ${theme}<br>
            ✨ Style: ${style}
            `;
        }

        if(typeof saveStory === "function"){
            saveStory(
                name,
                data.story
            );
        }

        if(typeof showStats === "function"){
            showStats(
                data.story
            );
        }

    }

    catch(error){

        console.log(error);

        storyBox.innerHTML =
            "❌ Backend connection failed. Check Flask server.";
    }
}

// ======================
// Typing Animation
// ======================

function typeWriter(text){

    const storyBox =
        document.getElementById("story");

    storyBox.innerHTML = "";

    let i = 0;

    function typing(){

        if(i < text.length){

            storyBox.innerHTML +=
                text.charAt(i);

            i++;

            setTimeout(
                typing,
                15
            );
        }
    }

    typing();
}

// ======================
// Story Statistics
// ======================

function showStats(story){

    const words =
        story.split(" ").length;

    const minutes =
        Math.ceil(words / 180);

    const statsDiv =
        document.getElementById(
            "stats"
        );

    if(statsDiv){

        statsDiv.innerHTML =

        `📖 Words: ${words}
         | ⏱ Reading Time:
         ${minutes} min`;
    }
}

// ======================
// Save Story History
// ======================

function saveStory(name, story){

    let stories =

        JSON.parse(
            localStorage.getItem(
                "stories"
            )
        ) || [];

    stories.unshift({
        name,
        story
    });

    localStorage.setItem(
        "stories",
        JSON.stringify(stories)
    );

    loadHistory();
}

// ======================
// Load History
// ======================

function loadHistory(){

    const historyDiv =
        document.getElementById(
            "history"
        );

    if(!historyDiv)
        return;

    let stories =

        JSON.parse(
            localStorage.getItem(
                "stories"
            )
        ) || [];

    historyDiv.innerHTML =
        "<h3>📚 Story History</h3>";

    stories
    .slice(0,5)
    .forEach(item => {

        historyDiv.innerHTML +=

        `<p>
            🌙 ${item.name}'s Story
         </p>`;
    });

    // ADD THIS PART
    const storyCount =
    document.getElementById("storyCount");

if(storyCount){

    storyCount.innerHTML =
    `📚 Total Stories Created: ${stories.length}`;
}
}
// ======================
// Music
// ======================

function playMusic(){

    document
    .getElementById("music")
    .play();
}

function pauseMusic(){

    document
    .getElementById("music")
    .pause();
}

// ======================
// Read Story
// ======================

function readStory(){

    const story =

        document
        .getElementById("story")
        .innerText;

    const speech =

        new SpeechSynthesisUtterance(
            story
        );

    speech.rate = 0.9;

    speech.pitch = 1;

    speech.volume = 1;

    speechSynthesis.speak(
        speech
    );
}

// ======================
// Stop Reading
// ======================

function stopStory(){

    speechSynthesis.cancel();
}

// ======================
// Dark Mode
// ======================

function toggleTheme(){

    document.body.classList
    .toggle("dark-mode");
}

// ======================
// Voice Input
// ======================

function startVoiceInput(){

    const recognition =

        new (
            window.SpeechRecognition ||
            window.webkitSpeechRecognition
        )();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult =
    function(event){

        document
        .getElementById("theme")
        .value =

        event.results[0][0]
        .transcript;
    };
}

// ======================
// Download PDF
// ======================

function downloadPDF(){

    const { jsPDF } =
        window.jspdf;

    const doc =
        new jsPDF();

    const name =

        document
        .getElementById("name")
        .value;

    const character =

        document
        .getElementById("character")
        .value;

    const theme =

        document
        .getElementById("theme")
        .value;

    const story =

        document
        .getElementById("story")
        .innerText;

    doc.setFontSize(24);

    doc.text(
        "DreamTales AI",
        15,
        20
    );

    doc.setFontSize(16);

    doc.text(
        `${name}'s Bedtime Story`,
        15,
        35
    );

    doc.setFontSize(12);

    doc.text(
        `Character: ${character}`,
        15,
        45
    );

    doc.text(
        `Theme: ${theme}`,
        15,
        55
    );

    const lines =

        doc.splitTextToSize(
            story,
            180
        );

    doc.text(
        lines,
        15,
        70
    );

    doc.save(
        `${name}_Story.pdf`
    );
}

// ======================
// Load History On Start
// ======================

window.onload = function(){

    loadHistory();
};