/* Displays content managed by the private Telegram editor. */
(() => {
  const pageByFile = {
    "index.html": "home",
    "reading.html": "reading",
    "education.html": "education",
    "travel.html": "travel",
    "achievements.html": "achievements",
    "personalresearches.html": "research",
  };
  const page = pageByFile[location.pathname.split("/").pop() || "index.html"];
  if (!page) return;

  const style = document.createElement("style");
  style.textContent = `
    .bot-content-section { margin: 42px 0; }
    .bot-content-item { padding: 20px 0; border-bottom: 1px solid #e8e8e8; }
    .bot-content-item h2 { margin: 0 0 8px; font-size: 21px; font-weight: 500; }
    .bot-content-item p { margin: 0 0 10px; color: #666; line-height: 1.8; white-space: pre-wrap; }
    .bot-content-item a { color: inherit; }
  `;
  document.head.append(style);

  fetch("data/content.json", { cache: "no-store" })
    .then((response) => (response.ok ? response.json() : Promise.reject(new Error("content unavailable"))))
    .then(({ home = {}, items = [] }) => {
      if (page === "home") {
        const headings = document.querySelectorAll(".site-header h1");
        if (home.name && headings[0]) headings[0].textContent = home.name;
        if (home.tagline && headings[1]) headings[1].textContent = home.tagline;
        const intro = document.querySelector(".site-header .lead");
        if (home.intro && intro) intro.textContent = home.intro;
      }

      const visible = items.filter((item) => item.page === page);
      if (!visible.length) return;
      const section = document.createElement("section");
      section.className = "bot-content-section";
      for (const item of visible) {
        const article = document.createElement("article");
        article.className = "bot-content-item";
        const title = document.createElement("h2");
        title.textContent = item.title || "";
        article.append(title);
        if (item.body) {
          const body = document.createElement("p");
          body.textContent = item.body;
          article.append(body);
        }
        if (item.url) {
          const link = document.createElement("a");
          link.href = item.url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = "More ↗";
          article.append(link);
        }
        section.append(article);
      }

      const main = document.querySelector("main.container") || document.querySelector("main") || document.body;
      const nav = page === "home" ? main.querySelector(".nav") : null;
      const intro = page === "home" ? null : main.querySelector(".page-intro");
      const footer = main.querySelector("footer");
      if (nav) nav.insertAdjacentElement("afterend", section);
      else if (intro) intro.insertAdjacentElement("afterend", section);
      else if (footer) footer.insertAdjacentElement("beforebegin", section);
      else main.append(section);
    })
    .catch(() => {});
})();

