document.getElementById('search-btn').addEventListener('click', fetchSurah);
document.getElementById('surah-name').addEventListener('keydown', handleEnterKeyPress);

function handleEnterKeyPress(event) {
  if (event.key === 'Enter') {
    fetchSurah();
  }
}

async function fetchSurah() {
  const surahName = document.getElementById('surah-name').value.trim();
  const resultContainer = document.getElementById('result');

  if (!surahName) {
    resultContainer.innerHTML = '<p>Please enter a surah name.</p>';
    return;
  }

  const chapterResponse = await fetch('https://api.quran.com/api/v4/chapters');
  if (!chapterResponse.ok) {
    resultContainer.innerHTML =
      '<p>There was an error fetching the surah data. Please try again later.</p>';
    return;
  }
  const chapterData = await chapterResponse.json();
  const chapter = chapterData.chapters.find(
    (c) => c.name_arabic === surahName
  );

  if (!chapter) {
    resultContainer.innerHTML =
      '<p>Surah not found. Please check the surah name and try again.</p>';
    return;
  }

  const surahResponse = await fetch(
    `https://api.quran.com/api/v4/quran/verses/ar.alafasy?chapter_id=${chapter.id}`
  );
  if (!surahResponse.ok) {
    resultContainer.innerHTML =
      '<p>There was an error fetching the surah data. Please try again later.</p>';
    return;
  }

  const surahData = await surahResponse.json();
  const verses = surahData.verses
    .map((verse) => `<p>${verse.number || verse.id}. ${verse.text_uthmani}</p>`)
    .join('');
  resultContainer.innerHTML = `<h2 dir="rtl">${chapter.name_arabic} (${chapter.translated_name.name})</h2><div dir="rtl">${verses}</div>`;
  
  // Show the card after fetching the surah
  resultContainer.style.display = 'block';
}
