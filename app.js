const state = {
  chapter: 1,
  query: "",
};

const $ = (selector) => document.querySelector(selector);
const view = $("#view");
const chapters = window.MEMOIR.chapters;
const note = window.MEMOIR.authorNote;
const allSections = [note, ...chapters];

const motifs = ["✦", "☉", "✉", "⌁", "☽", "♢"];
const memories = [
  ["The morning that stayed", "An ordinary morning that quietly changed a life."],
  ["The glass of water", "A small kindness that stayed longer than anyone expected."],
  ["Pebble", "A simple day that survived because it felt untouched."],
  ["The road to Mysore", "The place where messages became memories."],
  ["Madikeri", "Mountains, motion, and the feeling of forever."],
  ["The letters", "A heart trying to reach another heart without performance."],
  ["The handmade gift", "Effort turned into an object she could hold."],
  ["The silence", "The chapter after goodbye, where healing had not yet begun."],
  ["What remains", "Gratitude after love changes shape."],
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

function meaningfulQuote(section) {
  return section.quote || section.paragraphs.find((p) => p.length > 55 && p.length < 150) || section.paragraphs[0] || "";
}

function renderHome() {
  const bookmark = localStorage.getItem("memoir-bookmark");
  view.innerHTML = `
    <section class="hero reveal">
      <div class="hero-inner">
        <p class="kicker">A public literary memoir</p>
        <h1>${escapeHtml(window.MEMOIR.title)}</h1>
        <p class="subtitle">${escapeHtml(window.MEMOIR.subtitle)}</p>
        <p class="byline">Written by H.K Anand · Narrated through the character Arjun</p>
        <p class="note">Some names, places, timelines, and identifying details have been changed. This memoir is inspired by real emotions, memories, and experiences. Its purpose is not to decide who was right or wrong, but to hold love, effort, growth, hope, heartbreak, memory, and release with honesty.</p>
        <p class="dedication">For the memories, the conversations, the road trips, the letters, the love, the lessons, the growth, and the goodbye.</p>
        <div class="pullquote">Some stories are written to be remembered. Others are written so they can finally be released.</div>
        <div class="hero-actions">
          <a class="btn" href="#read/chapter-1">Begin reading</a>
          ${bookmark ? `<a class="btn secondary" href="#read/${bookmark}">Return to bookmark</a>` : ""}
          <a class="btn secondary" href="#toc">Table of contents</a>
        </div>
      </div>
    </section>`;
}

function renderToc() {
  view.innerHTML = `
    <section class="page reveal">
      <div class="section-head">
        <div>
          <p class="kicker">Book contents</p>
          <h2>Thirty-five chapters and an epilogue.</h2>
          <p>Each chapter keeps the manuscript intact while giving the memory its own visual atmosphere.</p>
        </div>
        <a class="btn secondary" href="#read/chapter-1">Start</a>
      </div>
      <div class="toc-grid">
        ${chapters.map((chapter, index) => `
          <a class="chapter-card" href="#read/${slugFor(chapter)}" data-motif="${motifs[index % motifs.length]}">
            <span>${chapter.kind === "epilogue" ? "Epilogue" : `Chapter ${chapter.number}`}</span>
            <h3>${escapeHtml(chapter.title)}</h3>
            <p>${escapeHtml(chapter.theme)}</p>
          </a>
        `).join("")}
      </div>
    </section>`;
}

function renderReader(slug) {
  const chapter = chapterBySlug(slug);
  state.chapter = chapter.number || chapters.length;
  const idx = chapters.indexOf(chapter);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];
  const quote = meaningfulQuote(chapter);
  view.innerHTML = `
    <article class="reader-shell reveal" style="--theme-a:${chapter.colors[0]};--theme-b:${chapter.colors[1]}">
      <header class="chapter-hero chapter-${chapter.number || "epilogue"}">
        <div>
          <p class="meta">${chapter.kind === "epilogue" ? "Epilogue" : `Chapter ${chapter.number}`} · ${escapeHtml(chapter.motif)}</p>
          <h2>${escapeHtml(chapter.title)}</h2>
        </div>
      </header>
      <div class="chapter-body">
        <div class="pullquote">${escapeHtml(quote)}</div>
        ${chapter.paragraphs.map((paragraph) => {
          const text = escapeHtml(paragraph);
          const letterish = /letter|Dear |I wrote|message/i.test(paragraph) && paragraph.length > 80;
          return `<p class="${letterish ? "letter" : ""}">${text}</p>`;
        }).join("")}
      </div>
      <nav class="chapter-nav" aria-label="Chapter navigation">
        ${prev ? `<a href="#read/${slugFor(prev)}">← ${prev.kind === "epilogue" ? "Epilogue" : `Chapter ${prev.number}`}<br>${escapeHtml(prev.title)}</a>` : `<a href="#toc">← Table of contents</a>`}
        ${next ? `<a href="#read/${slugFor(next)}">${next.kind === "epilogue" ? "Epilogue" : `Chapter ${next.number}`} →<br>${escapeHtml(next.title)}</a>` : `<a href="#final">Final page →<br>The answer is yes</a>`}
      </nav>
    </article>`;
}

function renderTimeline() {
  const picks = [1, 2, 4, 5, 7, 9, 11, 16, 20, 23, 25, 28, 32, 33, 34, 35];
  view.innerHTML = `
    <section class="page reveal">
      <div class="section-head">
        <div>
          <p class="kicker">Emotional timeline</p>
          <h2>The path through memory.</h2>
          <p>Not a chronology of dates so much as a record of what each season did to Arjun.</p>
        </div>
      </div>
      <div class="timeline">
        ${picks.map((n) => {
          const c = chapters.find((chapter) => chapter.number === n);
          return `<a class="timeline-item" href="#read/${slugFor(c)}">
            <p class="meta">Chapter ${c.number}</p>
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
        <input id="searchInput" type="search" value="${escapeHtml(state.query)}" placeholder="Try “Madikeri”, “letter”, “silence”, or “worth it”" autofocus>
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
      return `<a class="result-card" href="#read/${slugFor(chapter)}">
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
    <section class="page reveal">
      <div class="section-head">
        <div>
          <p class="kicker">In memory of us</p>
          <h2>A memorial to what lived.</h2>
          <p>Not a death memorial. A quiet place for conversations, road trips, letters, dreams, effort, hope, growth, and goodbyes.</p>
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
    </section>`;
}

function renderAuthor() {
  view.innerHTML = `
    <section class="page reveal">
      <div class="section-head">
        <div>
          <p class="kicker">About the author</p>
          <h2>Written by H.K Anand.</h2>
          <p>Narrated through the character Arjun.</p>
        </div>
      </div>
      <div class="chapter-body">
        ${note.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
        <div class="pullquote">Some stories are written to be remembered. Others are written so they can finally be released.</div>
      </div>
    </section>`;
}

function renderFinal() {
  view.innerHTML = `
    <section class="ending reveal">
      <blockquote>"If you ask me whether it was worth it, the answer is yes."</blockquote>
    </section>`;
}

function route() {
  const hash = location.hash.replace(/^#\/?/, "") || "home";
  if (hash.startsWith("read/")) renderReader(hash.split("/")[1]);
  else if (hash === "toc") renderToc();
  else if (hash === "timeline") renderTimeline();
  else if (hash === "search") renderSearch();
  else if (hash === "memory") renderMemory();
  else if (hash === "author") renderAuthor();
  else if (hash === "final") renderFinal();
  else renderHome();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  $("#progressBar").style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
}

$("#themeToggle").addEventListener("click", () => {
  setTheme(document.body.classList.contains("dark") ? "light" : "dark");
});

$("#bookmarkBtn").addEventListener("click", () => {
  const hash = location.hash.replace(/^#\/?read\//, "");
  if (hash && location.hash.startsWith("#read/")) {
    localStorage.setItem("memoir-bookmark", hash);
    $("#bookmarkBtn").textContent = "✓";
    setTimeout(() => { $("#bookmarkBtn").textContent = "⌑"; }, 1100);
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
