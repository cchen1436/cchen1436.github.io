(() => {
  const nextPage = document.body.dataset.nextPage;

  if (!nextPage) {
    return;
  }

  const edgeTolerance = 3;
  const wheelThreshold = 18;
  const touchThreshold = 44;
  let wheelDistance = 0;
  let wheelResetTimer;
  let touchStartY = null;
  let isLeaving = false;

  const isAtPageEnd = () =>
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - edgeTolerance;

  const openNextPage = () => {
    if (isLeaving) {
      return;
    }

    isLeaving = true;
    document.body.classList.add("page-leaving");

    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 140;

    window.setTimeout(() => {
      window.location.assign(nextPage);
    }, delay);
  };

  window.addEventListener(
    "wheel",
    (event) => {
      if (event.deltaY <= 0 || !isAtPageEnd()) {
        wheelDistance = 0;
        return;
      }

      wheelDistance += event.deltaY;
      window.clearTimeout(wheelResetTimer);
      wheelResetTimer = window.setTimeout(() => {
        wheelDistance = 0;
      }, 240);

      if (wheelDistance >= wheelThreshold) {
        openNextPage();
      }
    },
    { passive: true },
  );

  window.addEventListener(
    "touchstart",
    (event) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      const currentY = event.touches[0]?.clientY;

      if (
        touchStartY !== null &&
        currentY !== undefined &&
        touchStartY - currentY >= touchThreshold &&
        isAtPageEnd()
      ) {
        openNextPage();
      }
    },
    { passive: true },
  );

  window.addEventListener("keydown", (event) => {
    const target = event.target;
    const isUsingControl =
      target instanceof Element &&
      target.closest("a, button, input, select, textarea, video, [contenteditable='true']");
    const continuesDownward =
      event.key === "ArrowDown" ||
      event.key === "PageDown" ||
      (event.key === " " && !event.shiftKey);

    if (!isUsingControl && continuesDownward && isAtPageEnd()) {
      openNextPage();
    }
  });

  window.addEventListener("pageshow", () => {
    isLeaving = false;
    wheelDistance = 0;
    document.body.classList.remove("page-leaving");
  });
})();
