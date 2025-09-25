// Store responses
let responses = {};

// Create heart particles
function createHearts() {
    const heartsContainer = document.getElementById('hearts');
    heartsContainer.innerHTML = ''; // إزالة أي قلوب قديمة
    for (let i = 0; i < 40; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.textContent = '💖';
        heartsContainer.appendChild(heart);
    }
}
window.addEventListener('load', createHearts);

// Start survey
function startSurvey() {
    const username = document.getElementById('username').value.trim();
    const userid = document.getElementById('userid').value.trim();

    if (!username || !userid) {
        alert('Please enter both Name and ID to continue!');
        return;
    }

    responses = { username, userid };

    document.getElementById('userBox').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('level1').classList.add('active');
}

// Next level
function nextLevel(current) {
    const currentLevel = document.getElementById('level' + current);
    const inputs = currentLevel.querySelectorAll('input, select');
    let answered = true;

    inputs.forEach(input => {
        if (input.type === "checkbox") {
            if (!responses[input.name]) responses[input.name] = [];
            if (input.checked) responses[input.name].push(input.value);
        } else if (input.type === "radio") {
            if (input.checked) responses[input.name] = input.value;
        } else if (input.multiple) {
            responses[input.id] = Array.from(input.selectedOptions).map(o => o.value);
        } else if (input.value.trim() !== "") {
            responses[input.id] = input.value.trim();
        } else {
            answered = false;
        }
    });

    if (!answered) {
        alert('Please answer all required questions before continuing!');
        return;
    }

    currentLevel.classList.remove("active");
    const next = current + 1;
    const nextLevelEl = document.getElementById("level" + next);

    if (nextLevelEl) {
        nextLevelEl.classList.add("active");
    } else {
        submitSurvey();
    }
}

// Submit survey to API
function submitSurvey() {
    fetch("http://localhost:5000/api/survey", {   // غيّر الرابط حسب السيرفر بتاعك
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(responses)
    })
    .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
    })
    .then(data => {
        console.log("SUCCESS!", data);
        alert('Survey submitted successfully! ✅');
        restartSurvey();
    })
    .catch(err => {
        console.error("FAILED...", err);
        alert('Failed to send survey. Please try again.');
    });
}

// Restart survey
function restartSurvey() {
    responses = {};
    document.querySelectorAll('input, select').forEach(el => {
        if (el.type === "checkbox" || el.type === "radio") {
            el.checked = false;
        } else {
            el.value = '';
        }
    });

    document.querySelectorAll('.level').forEach(level => level.classList.remove('active'));

    document.getElementById('userBox').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    createHearts();
}
