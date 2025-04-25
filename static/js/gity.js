import fetch from 'node-fetch';
import { Buffer } from 'buffer';

const owner = 'harlogs';  // change this
const repo = 'streamlink';         // change this
const path = 'static/data/video-cache.json'; // where the file lives in your Hugo repo
const token = process.env.GH_TOKEN;

export async function updateVideoCacheById(id, newUrl, newExpiry) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  // Get the current file to retrieve content and SHA
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });

  if (!res.ok) throw new Error(`❌ Failed to fetch current file: ${await res.text()}`);
  const fileData = await res.json();
  const contentJson = Buffer.from(fileData.content, 'base64').toString();
  let cacheArray = JSON.parse(contentJson);

  // Find the movie by id and update or push if not exists
  const index = cacheArray.findIndex(item => item.id === id);
  if (index !== -1) {
    cacheArray[index].url = newUrl;
    cacheArray[index].expires = newExpiry;
  } else {
    cacheArray.push({ id, url: newUrl, expires: newExpiry });
  }

  // Encode and push new file
  const updatedContent = Buffer.from(JSON.stringify(cacheArray, null, 2)).toString('base64');

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Update video URL for movie ID ${id}`,
      content: updatedContent,
      sha: fileData.sha
    })
  });

  if (!putRes.ok) throw new Error(`❌ Failed to update file: ${await putRes.text()}`);

  console.log(`✅ Updated video-cache.json for movie ID ${id}`);
}
