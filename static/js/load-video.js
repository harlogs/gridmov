import { updateVideoCacheById } from './gity.js';  // Import the update function from gity.js

async function showVideo(containerId, apiUrl, videoId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<div class="text-white text-lg">⏳ Loading video...</div>';

  let videoUrl = '';
  let expires = 0;
  const now = Math.floor(Date.now() / 1000);

  try {
    // Load and parse the cache JSON
    const cacheResponse = await fetch('/gridmov/data/video-cache.json');
    const cacheData = await cacheResponse.json();

    // Find the entry with the matching ID
    const entry = cacheData.find(item => item.id === videoId);

    if (entry && entry.url && entry.expires > now) {
      // Use cached URL
      videoUrl = entry.url;
      console.log('✅ Using cached video URL:', videoUrl);
    } else {
      // No valid cache, fetch a new one from the API
      const response = await fetch(apiUrl);
      const data = await response.json();
      videoUrl = data.videoUrl;

      // Extract the expiry time from the video URL
      const match = /[?&]expires=(\d+)/.exec(videoUrl);
      if (match && match[1]) {
        expires = parseInt(match[1], 10);
      }

      console.log('💾 New video URL loaded:', videoUrl);

      // Call updateVideoCacheById to update GitHub with the new video URL and expiry time
      await updateVideoCacheById(videoId, videoUrl, expires);
    }
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
window.showVideo = showVideo;