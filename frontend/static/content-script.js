(function () {
  const buttonSelectors = [
    ".jobs-save-button",
    // 'button.artdeco-button[type="button"] .jobs-save-button__text',
    // 'button.artdeco-button--secondary[type="button"]',
    'button[class*="jobs-save-button"]',
  ];

  const processedElements = new WeakMap();

  function findSaveButtons() {
    const uniqueButtons = new Set();

    for (const selector of buttonSelectors) {
      try {
        document
          .querySelectorAll(selector)
          .forEach((button) => uniqueButtons.add(button));
        if (uniqueButtons.size >= 5) break;
      } catch (e) {
        console.warn(`[LinkedIn Button] Error with selector "${selector}"`, e);
      }
    }

    return Array.from(uniqueButtons);
  }

  function createCustomButton() {
    const button = document.createElement("button");
    button.className = "custom-linkedin-button";

    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("/favicon.png");
    img.alt = "Logo";

    Object.assign(img.style, {
      height: "16px",
      width: "16px",
      marginRight: "2px",
      verticalAlign: "middle",
    });

    const textSpan = document.createElement("span");
    textSpan.textContent = "Add";

    Object.assign(textSpan.style, {
      maxHeight: "20px"
    })

    button.appendChild(img);
    button.appendChild(textSpan);

    Object.assign(button.style, {
      color: "black",
      border: "1px dashed black",
      borderRadius: "2.4rem",
      padding: ".6rem 2rem .6rem 2rem",
      marginLeft: ".8rem",
      cursor: "pointer",
      fontSize: "1.6rem",
      fontWeight: "600",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      maxHeight: "40px"
    });

    button.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Custom button clicked!");
    });

    return button;
  }

  function addCustomButtons() {
    const saveButtons = findSaveButtons();
    let addedCount = 0;

    saveButtons.forEach((button) => {
      const parent = button.closest("button") || button;
      const container = parent.parentElement;

      if (container && !processedElements.has(container)) {
        container.appendChild(createCustomButton());
        processedElements.set(container, true);
        addedCount++;
      }
    });

    return addedCount > 0;
  }

  function watchForChanges() {
    let timeout = null;
    let pendingUpdates = false;

    const processQueue = () => {
      if (!pendingUpdates) return;
      pendingUpdates = false;

      const hasNewButtons = addCustomButtons();

      if (hasNewButtons) {
        requestAnimationFrame(() => setTimeout(processQueue, 100));
      }
    };

    const observer = new MutationObserver((mutations) => {
      const isRelevant = mutations.some((mutation) => {
        return mutation.type === "childList" && mutation.addedNodes.length > 0;
      });

      if (!isRelevant) return;
      if (timeout) clearTimeout(timeout);
      pendingUpdates = true;
      timeout = setTimeout(() => requestAnimationFrame(processQueue), 250);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });

    return () => observer.disconnect();
  }

  function initialize() {
    const startProcess = () => {
      addCustomButtons();
      watchForChanges();
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(startProcess, { timeout: 1000 });
    } else {
      setTimeout(startProcess, 0);
    }
  }

  if (
    document.readyState !== "complete" &&
    document.readyState !== "interactive"
  ) {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  const navigationEvents = ["popstate", "pushState", "replaceState"];
  navigationEvents.forEach((event) => {
    window.addEventListener(event, () => {
      setTimeout(addCustomButtons, 100);
    });
  });
})();
