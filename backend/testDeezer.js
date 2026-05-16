const axios = require('axios');

async function testDeezer() {
  try {
    console.log('Testing Deezer API...\n');
    
    const response = await axios.get('https://api.deezer.com/search', {
      params: { q: 'perfect ed sheeran' },
    });

    console.log('Status:', response.status);
    console.log('Total Results:', response.data.total);
    console.log('Data Length:', response.data.data ? response.data.data.length : 0);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('\n✅ First Song:');
      const song = response.data.data[0];
      console.log('  Title:', song.title);
      console.log('  Artist:', song.artist.name);
      console.log('  Album:', song.album.title);
      console.log('  Preview:', song.preview);
      console.log('\n✅ Deezer API is working!');
    } else {
      console.log('\n❌ No songs found in response');
      console.log('Full response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testDeezer();
