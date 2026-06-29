(() => {
  const enterLink = document.querySelector("[data-tvl-enter]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!enterLink || reduceMotion.matches) return;

  enterLink.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.add("tvl-leaving");
    window.setTimeout(() => {
      window.location.href = enterLink.href;
    }, 520);
  });
})();
