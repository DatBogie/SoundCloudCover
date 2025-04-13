async function getSoundCloudData(trackUrl) {
    try {
        var url = trackUrl;
        if (!url.startsWith("https://")) {
            url = "https://" + url;
        }

        console.log(url);

        const proxy = "https://corsproxy.io/?url=";
        const response = await fetch(proxy + encodeURIComponent(url));
        const html = await response.text();

        const trackInfo = new Map();
        trackInfo.set("title", null);
        trackInfo.set("artist", url.split("/")[3]);
        trackInfo.set("cover", null);

        const matcht = html.match(/<meta property="og:title" content="([^"]+)"/);
        if (matcht && matcht[1]) {
            trackInfo.set("title", matcht[1]);
        } else {
            throw new Error("Title not found");
        }

        const match = html.match(/<meta property="og:image" content="([^"]+)"/);
        if (match && match[1]) {
            trackInfo.set("cover", match[1]);
        } else {
            throw new Error("Cover image not found");
        }
        return trackInfo;
    } catch (err) {
        console.error("Error fetching track info:", err);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("load").addEventListener("click", async () => {
        const trackUrl = document.getElementById("url").value;
        const trackData = await getSoundCloudData(trackUrl);
    
        if (trackData.get("cover")) {
            document.getElementById("cover-image").src = trackData.get("cover");
            document.getElementById("cover-image").style.display = "block";
        } else {
            alert("Failed to load cover image.");
        }

        if (trackData.get("title") && trackData.get("artist")) {
            document.getElementById("title").innerText = trackData.get("title") + " — " + trackData.get("artist");
        } else {
            alert("Failed to fetch title.");
        }
    });
    document.getElementById("dl").addEventListener("click", async () => {
        const coverImage = document.getElementById("cover-image").src;
        if (coverImage) {
            const a = document.createElement("a");
            a.href = coverImage;
            a.download = "cover-image.jpg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert("No cover image to download.");
        }
    });
});