const userId = "1073919144963084308";

let startTimestamp = null;

async function fetchActivity() {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    const json = await res.json();
    const data = json.data;

    const activity = data.activities.find(a => a.type === 0); // playing activity

    const nameEl = document.getElementById("activity-name");
    const detailsEl = document.getElementById("activity-details");
    const stateEl = document.getElementById("activity-state");
    const timeEl = document.getElementById("activity-time");
    const imageEl = document.querySelector(".activity-image");

    if (!activity) {
        nameEl.textContent = "Doing nothing";
        detailsEl.textContent = "";
        stateEl.textContent = "";
        timeEl.textContent = "";
        return;
    }

    // TEXT
    nameEl.textContent = activity.name || "";
    detailsEl.textContent = activity.details || "";
    stateEl.textContent = activity.state || "";

    // IMAGE (Discord CDN)
    if (activity.assets && activity.assets.large_image) {
        const appId = activity.application_id;
        const imageId = activity.assets.large_image;

        imageEl.src = `https://cdn.discordapp.com/app-assets/${appId}/${imageId}.png`;
    }

    // TIMER
    if (activity.timestamps && activity.timestamps.start) {
        startTimestamp = activity.timestamps.start;
    } else {
        startTimestamp = null;
        timeEl.textContent = "";
    }
}

function updateTimer() {
    const timeEl = document.getElementById("activity-time");

    if (!startTimestamp) return;

    const now = Date.now();
    const diff = Math.floor((now - startTimestamp) / 1000);

    const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
    const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const secs = String(diff % 60).padStart(2, "0");

    timeEl.textContent = `Time elapsed: ${hrs}:${mins}:${secs}`;
}

// fetch every 10s (lanyard updates)
setInterval(fetchActivity, 10000);

// update timer every second
setInterval(updateTimer, 1000);

// initial load
fetchActivity();