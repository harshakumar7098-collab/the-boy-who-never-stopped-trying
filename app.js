const state = {
  chapter: 1,
  query: "",
};

const $ = (selector) => document.querySelector(selector);
const view = $("#view");
const chapters = window.MEMOIR.chapters;
const note = window.MEMOIR.authorNote;
const coverSubtitle = "A Memoir About Love, Hope, Growth, and Learning to Let Go";
function staticChapterSlug(section) {
  if (section.kind === "epilogue") return "epilogue";
  return section.title
    .toLowerCase()
    .replaceAll('"', "")
    .replaceAll("'", "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const memories = [
  ["The morning that stayed", "An ordinary morning that quietly changed a life."],
  ["The glass of water", "A small kindness that stayed longer than anyone expected."],
  ["Pebble", "Warm afternoon comfort, preserved like a page in a scrapbook."],
  ["The road to Mysore", "A journey where messages became weather, distance, and memory."],
  ["Madikeri", "Mist, mountains, and the feeling that forever was possible."],
  ["The letters", "A heart trying to reach another heart without performance."],
  ["The handmade gift", "Effort made visible, something love could hold."],
  ["The silence", "The chapter after goodbye, where healing had not yet begun."],
  ["What remains", "Gratitude after love changes shape."],
];

const chapterAtmospheres = [
  "sunrise", "phone", "calendar", "cafe", "road", "diary", "letter", "threshold", "mountain",
  "interior", "home", "horizon", "glow", "message", "gift", "smoke", "mirror", "release",
  "spark", "sky", "family", "paths", "coffee", "fog", "empty", "rain", "tally", "split",
  "distance", "gate", "photo", "goodbye", "night", "letters", "sunset"
];

function setTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("memoir-theme", theme);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugFor(section) {
  return section.kind === "epilogue" ? "epilogue" : `chapter-${section.number}`;
}

function firstChapter() {
  return chapters.find((chapter) => chapter.kind === "chapter");
}

function chapterBySlug(slug) {
  if (slug === "epilogue") return chapters.find((chapter) => chapter.kind === "epilogue");
  const match = slug.match(/chapter-(\d+)/);
  return match ? chapters.find((chapter) => chapter.number === Number(match[1])) : firstChapter();
}

function chapterIndex(section) {
  return chapters.indexOf(section);
}

function hrefForChapter(section) {
  return `chapters/${staticChapterSlug(section)}/`;
}

function readingMinutes(section) {
  const words = section.paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 210));
}

function completionSet() {
  return new Set(JSON.parse(localStorage.getItem("memoir-completed") || "[]"));
}

function saveCompletion(set) {
  localStorage.setItem("memoir-completed", JSON.stringify([...set]));
}

function markComplete(slug) {
  const done = completionSet();
  done.add(slug);
  saveCompletion(done);
}

function quoteCandidates(section) {
  const candidates = section.paragraphs.filter((p) => {
    const longEnough = p.length >= 62 && p.length <= 170;
    const literary = /(Sometimes|Because|The truth|Love|Memory|hope|worth|trying|forever|heartbreak|grateful|ordinary|silence|growth|remain)/i.test(p);
    return longEnough && literary;
  });
  return [...new Set([section.quote, ...candidates].filter(Boolean))].slice(0, 3);
}

function paragraphClass(paragraph) {
  if (/^(Dear|From,|With love)/i.test(paragraph)) return "letter";
  if (/(letter|I wrote|I sent|message|diary)/i.test(paragraph) && paragraph.length > 85) return "letter";
  if (paragraph.length < 48 && /[,.!?]$/.test(paragraph)) return "poem-line";
  return "";
}

function atmosphereFor(chapter) {
  if (chapter.kind === "epilogue") return "epilogue";
  return chapterAtmospheres[(chapter.number - 1) % chapterAtmospheres.length];
}

function renderHome() {
  const bookmark = localStorage.getItem("memoir-bookmark");
  view.innerHTML = `
    <section class="hero cover-experience reveal">
      <div class="cover-light"></div>
      <div class="hero-inner cover-inner">
        <p class="kicker">A premium digital memoir</p>
        <h1>${escapeHtml(window.MEMOIR.title)}</h1>
        <p class="subtitle">${escapeHtml(coverSubtitle)}</p>
        <p class="byline">Written by H.K Anand</p>
        <p class="byline">Narrated through the character Arjun</p>
        <p class="note">Some names, places, timelines, and identifying details have been changed. This memoir is inspired by real emotions, memories, and experiences. Its purpose is not to decide who was right or wrong, but to hold love, effort, growth, hope, heartbreak, memory, and release with honesty.</p>
        <p class="dedication">For the memories, the conversations, the road trips, the letters, the love, the lessons, the growth, and the goodbye.</p>
        <div class="hero-actions">
          <a class="btn" href="${hrefForChapter(firstChapter())}">Begin Reading</a>
          ${bookmark ? `<a class="btn secondary" href="${hrefForChapter(chapterBySlug(bookmark))}">Continue Reading</a><a class="btn secondary" href="${hrefForChapter(chapterBySlug(bookmark))}">Return to Last Chapter</a>` : ""}
          <a class="btn secondary" href="#toc">Table of Contents</a>
        </div>
      </div>
    </section>`;
}

function renderToc() {
  const done = completionSet();
  view.innerHTML = `
    <section class="page reveal">
      <div class="section-head">
        <div>
          <p class="kicker">Book contents</p>
          <h2>Thirty-five chapters and an epilogue.</h2>
          <p>Each chapter keeps the manuscript intact while giving the memory its own visual atmosphere.</p>
        </div>
        <a class="btn secondary" href="${hrefForChapter(firstChapter())}">Start</a>
      </div>
      <div class="toc-grid">
        ${chapters.map((chapter) => `
          <a class="chapter-card atmosphere-${atmosphereFor(chapter)}" href="${hrefForChapter(chapter)}" data-done="${done.has(slugFor(chapter)) ? "Complete" : ""}">
            <span>${chapter.kind === "epilogue" ? "Epilogue" : `Chapter ${chapter.number}`} / ${readingMinutes(chapter)} min</span>
            <h3>${escapeHtml(chapter.title)}</h3>
            <p>${escapeHtml(chapter.theme)}</p>
          </a>
        `).join("")}
      </div>
    </section>`;
}

function renderReader(slug) {
  const chapter = chapterBySlug(slug);
  const idx = chapterIndex(chapter);
  state.chapter = chapter.number || chapters.length;
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];
  const quotes = quoteCandidates(chapter);
  const completed = completionSet().has(slugFor(chapter));
  localStorage.setItem("memoir-bookmark", slugFor(chapter));
  view.innerHTML = `
    <article class="reader-shell reveal" data-current-slug="${slugFor(chapter)}" style="--theme-a:${chapter.colors[0]};--theme-b:${chapter.colors[1]}">
      <header class="chapter-hero chapter-${chapter.number || "epilogue"} atmosphere-${atmosphereFor(chapter)}">
        <div class="chapter-scene" aria-hidden="true"><span></span><span></span><span></span></div>
        <div>
          <p class="meta">${chapter.kind === "epilogue" ? "Epilogue" : `Chapter ${chapter.number}`} / ${readingMinutes(chapter)} min read / <span id="chapterPercent">0%</span></p>
          <h2>${escapeHtml(chapter.title)}</h2>
          <p class="chapter-theme">${escapeHtml(chapter.theme)}</p>
        </div>
      </header>
      <div class="chapter-tools">
        <button id="chapterBookmark" class="btn secondary" type="button">Bookmark Chapter</button>
        <button id="completeChapter" class="btn secondary" type="button">${completed ? "Chapter Complete" : "Mark Complete"}</button>
      </div>
      <div class="chapter-body">
        <div class="pullquote premium-quote">${escapeHtml(quotes[0] || "")}</div>
        ${chapter.paragraphs.map((paragraph, i) => {
          const text = escapeHtml(paragraph);
          const cls = paragraphClass(paragraph);
          const quote = i === Math.floor(chapter.paragraphs.length * 0.45) && quotes[1]
            ? `<div class="pullquote inset-quote">${escapeHtml(quotes[1])}</div>`
            : "";
          return `${quote}<p class="${cls}">${text}</p>`;
        }).join("")}
      </div>
      <nav class="chapter-nav" aria-label="Chapter navigation">
        ${prev ? `<a href="#read/${slugFor(prev)}">Previous<br>${escapeHtml(prev.title)}</a>` : `<a href="#toc">Previous<br>Table of Contents</a>`}
        ${next ? `<a class="next-chapter" href="#read/${slugFor(next)}">Next<br>${escapeHtml(next.title)}</a>` : `<a class="next-chapter" href="#final">Final Page<br>The answer is yes</a>`}
      </nav>
    </article>`;

  $("#chapterBookmark").addEventListener("click", () => {
    localStorage.setItem("memoir-bookmark", slugFor(chapter));
    $("#chapterBookmark").textContent = "Bookmarked";
  });
  $("#completeChapter").addEventListener("click", () => {
    markComplete(slugFor(chapter));
    $("#completeChapter").textContent = "Chapter Complete";
  });
}

function renderTimeline() {
  const picks = [1, 2, 4, 5, 7, 9, 11, 16, 20, 23, 25, 28, 32, 33, 34, 35];
  view.innerHTML = `
    <section class="page timeline-page reveal">
      <div class="section-head">
        <div>
          <p class="kicker">Emotional timeline</p>
          <h2>The path through memory.</h2>
          <p>A visual thread through first sight, closeness, roads, change, distance, heartbreak, and gratitude.</p>
        </div>
      </div>
      <div class="timeline">
        ${picks.map((n, i) => {
          const c = chapters.find((chapter) => chapter.number === n);
          return `<a class="timeline-item atmosphere-${atmosphereFor(c)}" href="${hrefForChapter(c)}">
            <p class="meta">Milestone ${String(i + 1).padStart(2, "0")} / Chapter ${c.number}</p>
            <h3>${escapeHtml(c.title)}</h3>
            <p>${escapeHtml(c.theme)}</p>
          </a>`;
        }).join("")}
      </div>
    </section>`;
}

function renderSearch() {
  view.innerHTML = `
    <section class="page reveal">
      <div class="section-head">
        <div>
          <p class="kicker">Full-text search</p>
          <h2>Find a memory.</h2>
          <p>Search chapter titles and manuscript text locally in your browser.</p>
        </div>
      </div>
      <div class="search-panel">
        <input id="searchInput" type="search" value="${escapeHtml(state.query)}" placeholder="Try Madikeri, letter, silence, or worth it" autofocus>
        <div id="results" class="results"></div>
      </div>
    </section>`;
  const input = $("#searchInput");
  const results = $("#results");
  const update = () => {
    state.query = input.value.trim();
    if (!state.query) {
      results.innerHTML = `<p class="note">Begin typing to search the memoir.</p>`;
      return;
    }
    const q = state.query.toLowerCase();
    const matches = chapters.filter((chapter) => `${chapter.title} ${chapter.paragraphs.join(" ")}`.toLowerCase().includes(q));
    results.innerHTML = matches.length ? matches.map((chapter) => {
      const body = chapter.paragraphs.join(" ");
      const at = body.toLowerCase().indexOf(q);
      const excerpt = at >= 0 ? body.slice(Math.max(0, at - 90), at + 180) : chapter.theme;
      return `<a class="result-card" href="${hrefForChapter(chapter)}">
        <p class="meta">${chapter.kind === "epilogue" ? "Epilogue" : `Chapter ${chapter.number}`}</p>
        <h3>${escapeHtml(chapter.title)}</h3>
        <p>${escapeHtml(excerpt)}...</p>
      </a>`;
    }).join("") : `<p class="note">No matches found.</p>`;
  };
  input.addEventListener("input", update);
  update();
}

function renderMemory() {
  view.innerHTML = `
    <section class="memory-cinema reveal">
      <div class="memory-veil"></div>
      <div class="page">
        <div class="section-head">
          <div>
            <p class="kicker">In memory of us</p>
            <h2>A memorial to what lived.</h2>
            <p>Not a death memorial. A quiet place for memories, conversations, dreams, letters, road trips, hope, love, growth, and goodbyes.</p>
          </div>
        </div>
        <div class="memory-grid">
          ${memories.map(([title, copy], i) => `<article class="memory-card">
            <p class="meta">Memory ${String(i + 1).padStart(2, "0")}</p>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(copy)}</p>
          </article>`).join("")}
        </div>
        <div class="pullquote">The memories remain. The lessons remain. The growth remains. The gratitude remains.</div>
      </div>
    </section>`;
}

function renderAuthor() {
  view.innerHTML = `
    <section class="page author-page reveal">
      <div class="author-layout">
        <div class="author-portrait" aria-label="Author photograph placeholder silhouette">
          <span></span>
        </div>
        <div>
          <p class="kicker">About the author</p>
          <h2>Written by H.K Anand.</h2>
          <div class="signature">H.K Anand</div>
          <p class="author-bio">H.K Anand writes this memoir as an act of remembrance and release, allowing Arjun's voice to hold love, effort, misunderstanding, heartbreak, growth, and gratitude without turning the story into blame.</p>
          <p class="author-bio">The work is intimate by design: a literary record of ordinary moments that became permanent, and a reflection on what remains after a future imagined with someone slowly becomes a lesson in letting go.</p>
        </div>
      </div>
      <div class="chapter-body author-note">
        ${note.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
        <div class="pullquote">Some stories are written to be remembered.<br>Others are written so they can finally be released.</div>
      </div>
    </section>`;
}

function renderFinal() {
  view.innerHTML = `
    <section class="ending reveal">
      <div class="ending-clouds" aria-hidden="true"></div>
      <blockquote><span>"If you ask me whether it was worth it,</span><span>the answer is yes."</span></blockquote>
    </section>`;
}

function route() {
  const hash = location.hash.replace(/^#\/?/, "") || "home";
  if (hash.startsWith("read/")) {
    const chapter = chapterBySlug(hash.split("/")[1]);
    location.href = hrefForChapter(chapter);
    return;
  }
  if (hash === "toc") location.href = "chapters/";
  else if (hash === "timeline") renderTimeline();
  else if (hash === "search") renderSearch();
  else if (hash === "memory") renderMemory();
  else if (hash === "author") renderAuthor();
  else if (hash === "final") renderFinal();
  else renderHome();
  window.scrollTo({ top: 0, behavior: "smooth" });
  updateProgress();
}

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  $("#progressBar").style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  const shell = document.querySelector(".reader-shell");
  const percent = $("#chapterPercent");
  if (shell && percent) {
    const rect = shell.getBoundingClientRect();
    const total = shell.offsetHeight - window.innerHeight;
    const read = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
    const chapterRatio = Math.max(0, Math.min(1, read / Math.max(total, 1)));
    percent.textContent = `${Math.round(chapterRatio * 100)}%`;
    if (chapterRatio > 0.92) markComplete(shell.dataset.currentSlug);
  }
}

$("#themeToggle").addEventListener("click", () => {
  setTheme(document.body.classList.contains("dark") ? "light" : "dark");
});

$("#bookmarkBtn").addEventListener("click", () => {
  const hash = location.hash.replace(/^#\/?read\//, "");
  if (hash && location.hash.startsWith("#read/")) {
    localStorage.setItem("memoir-bookmark", hash);
    $("#bookmarkBtn").textContent = "OK";
    setTimeout(() => { $("#bookmarkBtn").textContent = "B"; }, 1100);
  }
});

$("#immersiveBtn").addEventListener("click", () => {
  document.body.classList.toggle("immersive");
});

window.addEventListener("hashchange", route);
window.addEventListener("scroll", updateProgress, { passive: true });
setTheme(localStorage.getItem("memoir-theme") || "light");
route();
updateProgress();
