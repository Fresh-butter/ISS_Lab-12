const rssConverter = "https://api.rss2json.com/v1/api.json?rss_url=";
const feeds = [
  { name: "bbc", url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "guardian", url: "https://www.theguardian.com/international/rss" }
];
let allArticles = [];

async function loadNews(searchTerm = "", source = "all", reset = false) {
  const list = document.getElementById("newsList");
  const loading = document.getElementById("loading");
  
  // Always clear the old articles before loading new ones
allArticles = []; // Akshat
if (reset) list.innerHTML = ""; // Akshat 

  
  loading.style.display = "block";
  
  try {
    const selectedFeeds = source === "all" ? feeds : feeds.filter(f => f.name === source);
    
    for (const feed of selectedFeeds) {
      const res = await fetch(`${rssConverter}${encodeURIComponent(feed.url)}`);
      if (!res.ok) throw new Error(`Failed to fetch ${feed.name}`);
      const data = await res.json();
      
// Filter articles from each feed based on search term Akshat
const filtered = searchTerm
  ? articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : articles;

allArticles.push(...filtered); // Push filtered articles only Akshat
      allArticles.push(...articles);
    }
    
    // Update total article count and render filtered articles directly from allArticles
document.getElementById("articleCount").textContent = `Total articles: ${allArticles.length}`; //Akshat
list.innerHTML = ""; //Akshat
allArticles.forEach(article => {// Akshat
      const div = document.createElement("div");
      div.className = "news-item";
      div.innerHTML = `
        <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
        <p><strong>Source:</strong> ${article.source} | 
           <strong>Date:</strong> ${article.pubDate}</p>
        <p>${article.description}</p>
      `;
      list.appendChild(div);
    });
    
  } catch (err) {
    list.innerHTML += `<p style="color: red;">Error: ${err.message}</p>`;
  } finally {
    loading.style.display = "none";
  }
}


loadNews();

// added event listeners for search and source change in news.js by Navneet
document.getElementById("search").addEventListener("input", (e) => {
  const searchTerm = e.target.value;
  const source = document.getElementById("source").value;
  loadNews(searchTerm, source, false);
});

document.getElementById("source").addEventListener("change", (e) => {
  const source = e.target.value;
  const searchTerm = document.getElementById("search").value;
  loadNews(searchTerm, source, true);
});