//import { updateVideoCacheById } from './gity.js';  // Import the update function from gity.js

async function showVideo(containerId, apiUrl, videoId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<div class="text-white text-lg">⏳ Loading video...</div>';

  let videoUrl = '';

  try {
    // No need to load cache JSON
    // const cacheResponse = await fetch('/gridmov/data/video-cache.json');
    // const cacheData = await cacheResponse.json();
    // console.log(cacheData);

    apiUrl = "https://streamlink-production-f6c9.up.railway.app/player?url=https://streamtape.com/v/" + apiUrl;

    // No need to find entry
    // const entry = cacheData.find(item => item.id === videoId);
    // console.log(entry);

    // Always fetch fresh video URL
    const response = await fetch(apiUrl);
    const data = await response.json();
    videoUrl = data.videoUrl;

    console.log('💾 New video URL loaded:', videoUrl);

    /*
    // Skipping update to cache API call
    const match = /[?&]expires=(\d+)/.exec(videoUrl);
    if (match && match[1]) {
      expires = parseInt(match[1], 10);
    }

    const apiBaseUrl = window.location.hostname.includes('localhost')
      ? 'http://localhost:3000'
      : 'https://streamlink-production-f6c9.up.railway.app';

    const updateResponse = await fetch(`${apiBaseUrl}/update-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: videoId,
        newUrl: videoUrl,
        newExpiry: expires,
      }),
    });

    const updateData = await updateResponse.json();
    console.log(updateData.message);
    */
  } catch (err) {
    container.innerHTML = '<div class="text-red-500 text-lg">⚠️ Failed to load video.</div>';
    console.error('❌ Error fetching video URL:', err);
    return;
  }

  // Show video player
  container.innerHTML = `
    <video src="${videoUrl}" controls autoplay class="w-full max-w-3xl mx-auto rounded-lg shadow-xl"></video>
  `;
}
// window.showVideo = showVideo;
