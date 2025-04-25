async function showVideo(containerId) {
  const container = document.getElementById(containerId);
  const cache = document.getElementById('cachedVideo');
  const savedUrl = cache?.dataset.url || '';
  const savedExpiry = parseInt(cache?.dataset.expiry || '0', 10);
  const now = Math.floor(Date.now() / 1000);

  let videoUrl = savedUrl;

  // If no saved URL or the expiry is in the past
  const needsRefresh = !savedUrl || now >= savedExpiry;

  if (needsRefresh) {
    container.innerHTML = '<div class="text-white text-lg">⏳ Loading video...</div>';

    const apiUrl = 'https://streamlink-production-f6c9.up.railway.app/player?url=https://streamtape.com/v/KPrblX7al1s0XVQ/Chhaava_2025.mkv.mp4';

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      videoUrl = data.videoUrl;

      // Extract expires timestamp from videoUrl
      const expiresMatch = /[?&]expires=(\d+)/.exec(videoUrl);
      if (expiresMatch && expiresMatch[1]) {
        const newExpiry = parseInt(expiresMatch[1], 10);
        cache.dataset.url = videoUrl;
        cache.dataset.expiry = newExpiry;
        console.log('✅ Cached new video URL + expiry:', videoUrl, newExpiry);
      } else {
        console.warn('⚠️ Expiry timestamp not found in video URL.');
      }

    } catch (err) {
      container.innerHTML = '<div class="text-red-500 text-lg">⚠️ Failed to load video.</div>';
      console.error('❌ Error fetching video URL:', err);
      return;
    }
  }

  // Show the video player
  container.innerHTML = `
    <video src="${videoUrl}" controls autoplay class="w-full max-w-3xl mx-auto rounded-lg shadow-xl"></video>
  `;
}
async function getCachedVideo(divId) {
  const response = await fetch('/data/video-cache.json');
  const data = await response.json();

  const currentTime = Math.floor(Date.now() / 1000);
  if (data.expires > currentTime) {
    // Use cached link
    return data.url;
  } else {
    return null;
  }
}
