async function loadVideo(videoId, apiUrl) {
    const container = document.getElementById(videoId);
    if (!container) return;
  
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      const video = document.createElement('video');
      video.src = data.videoUrl;
      video.controls = true;
      video.autoplay = true;
      video.style = 'width:100%;height:100%;object-fit:contain;border:4px solid black;';
      container.appendChild(video);
    } catch (err) {
      container.innerHTML = '<p style="color:red;">Failed to load video</p>';
      console.error(err);
    }
  }
  