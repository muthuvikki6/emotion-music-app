const generateSongRecommendation = async (emotion, language) => {
    try {
      const prompt = `Suggest a ${language} song that matches the emotion: ${emotion}. 
      Return in strict JSON format with only these fields:
      {
        "title": "song title",
        "artist": "artist name",
        "language": "${language}",
        "spotifySearchQuery": "song title artist name"
      }
      Choose a popular, well-known song that strongly matches the emotional tone.`;
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 150
        })
      });
  
      const data = await response.json();
      const songData = JSON.parse(data.choices[0].message.content);
      
      // Create Spotify search URL
      songData.spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(songData.spotifySearchQuery)}`;
      
      return songData;
    } catch (error) {
      console.error('Error getting song recommendation:', error);
      throw error;
    }
  };
  
  export { generateSongRecommendation };