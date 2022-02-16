const templateElements = document.querySelectorAll("template.component");
const layoutElement = document.querySelector("#layout");
const selectTemplateElement = document.querySelector("#selectedTemplate");
const previewElement = document.querySelector("#preview");
const codeElement = document.querySelector("#code");
const dropLayoutElement = document.querySelector(".appContent");
const themeSwitcher = document.querySelector("#theme");

let currentTheme = undefined;

let selectedTemplateId = "None";
let selectedItemId = undefined;

let draggingItem = undefined;
let draggedOverItem = undefined;

class LayoutItem {
  static uuid;
  static templateId;
  constructor(templateId) {
    this.uuid = uuid();
    this.templateId = templateId;
  }
}
let layout = [];

function isPositiveInteger(str) {
  if (typeof str !== "string") {
    return false;
  }

  const num = Number(str);

  if (Number.isInteger(num) && num > 0) {
    return true;
  }

  return false;
}

/**
 * Convert color to hex for older email clients 😭
 * @param {string} string
 * @returns
 */
const rgb2hex = (string) => {
  const match = string.match(
    /(\s+)?^rgb?\((\d+),\s*(\d+),\s*(\d+)\)(\s+)?[\W]?$/
  );
  console.log(string, match);
  if (match) {
    const result = `#${match
      .slice(2, 5)
      .map((n, i) =>
        (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
          .toString(16)
          .padStart(2, "0")
          .replace("NaN", "")
      )
      .join("")}`;

    console.log(result);
    return string.replace(result);
  } else string;
};

/**
 * Add CSS rule as inline style
 * @param {HTMLElement} element
 * @param {CSSRule} style
 * @returns {HTMLElement}
 */
const css = (element, cssRule) => {
  for (const property in cssRule.style) {
    if (
      !isPositiveInteger(property) &&
      property !== "0" &&
      cssRule.style[property] !== "" &&
      typeof cssRule.style[property] === "string" &&
      property !== "cssText"
    ) {
      element.style[property] = cssRule.style[property];
    }
  }
  return element;
};

/**
 * Get CSS rules from a className
 * @param {HTMLElement} el
 * @param {string} className
 * @returns
 */
function getCSSRules(el, className) {
  var sheets = document.styleSheets,
    ret = [];
  el.matches =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector ||
    el.oMatchesSelector;
  for (var i in sheets) {
    var rules = sheets[i].cssRules;
    for (const r in rules) {
      if (rules[r].selectorText) {
        if (rules[r].selectorText === "." + className) {
          ret.push(rules[r]);
        }
      }
      continue;
    }
  }
  return ret;
}

/**
 * TODO: Add accumulated styles (---> do it the tailwind way)
 */

/**
 * Update template preview
 */
const updateTemplatePreview = () => {
  const selector = `[data-template-id="${selectedTemplateId}"]`;
  const templateElement = document
    .querySelector(selector)
    .content.cloneNode(true);
  var nodes = templateElement.querySelectorAll("*");

  nodes.forEach((n) => {
    n.classList.forEach((className) => {
      const cssRules = getCSSRules(templateElement, className);
      cssRules.forEach((style) => {
        css(n, style);
      });
    });
  });

  const node = document.importNode(templateElement, true);

  previewElement.innerHTML = "";
  previewElement.appendChild(node);
  if (selectedTemplateId !== "None") {
    codeElement.innerHTML = previewElement.innerHTML;
  } else codeElement.innerHTML = "";
};

/**
 * Select template for preview
 **/
const selectTemplate = () => {
  selectedTemplateId = selectTemplateElement.value;
  updateTemplatePreview();
};

/**
 * Select template for preview from click on layout item
 **/
const selectItem = (item) => {
  selectedItemId = item.uuid;
  selectedTemplateId = item.templateId;
  updateTemplatePreview();
  render();
};

/**
 * Copy template code to clipboard
 **/
const copy = () => {
  let textarea = document.getElementById("code");
  textarea.select();
  document.execCommand("copy");
  alert("Copied source code to your clipboard!");
};

/**
 * Select Layout source code
 **/
const selectLayout = () => {
  let templateHTML = layoutElement.innerHTML;
  codeElement.innerHTML = templateHTML;
};

const selectDocument = () => {
  const clone = document.firstElementChild.cloneNode(true);
  // Remove the other font style sheet
  clone
    .querySelector(
      `[data-brand-specific-for*=${
        document.body.dataset.theme === Theme.Lagerhaus
          ? Theme.RWA
          : Theme.Lagerhaus
      }]`
    )
    .remove();
  // Remove app styles
  clone.querySelector(`[data-styles-partial*=app]`).remove();
  let layoutWrapper = document.querySelector(".layoutWrapper").cloneNode(true);
  // Clear body
  clone.querySelector("body").innerHTML = "";
  // Re-attach layout wrapper
  clone.querySelector("body").appendChild(layoutWrapper);
  // Replace layout with placeholder comment
  clone.querySelector("#layout").innerHTML =
    "<!-- Add your components here -->";
  codeElement.innerHTML = clone.innerHTML;
};

/**
 * Add template to layout
 **/
const add = () => {
  if (selectedTemplateId !== "None") {
    const index = layout.findIndex((item) => item.uuid === selectedItemId);
    layout.splice(
      index ? index + 1 : layout.length + 1,
      0,
      new LayoutItem(selectedTemplateId, layout.length)
    );
  } else {
    alert("Select template first!");
  }
  render();
};

/**
 * Render layout
 **/
const render = () => {
  if (layout.length > 0) {
    layoutElement.innerHTML = "";
    layout.forEach((item) => {
      attach(item);
    });
    localStorage.setItem("presetLayout", JSON.stringify(layout));
  } else {
    clearLayout();
  }
};

/**
 * Compare if dragged element is over another
 * @param {Event} e
 */
const compare = (e) => {
  var index1 = layout.findIndex((i) => i.uuid === draggingItem);
  var index2 = layout.findIndex((i) => i.uuid === draggedOverItem);
  var item = layout.find((i) => i.uuid === draggingItem);
  layout.splice(index1, 1);
  layout.splice(index2, 0, item);
  render();
};

/**
 * Set draggedOverItem to the uuid of the last hoverd item
 * @param {Event} e
 */
const setDraggedOverItem = (e) => {
  e.preventDefault();
  const uuid = e.target.closest(".componentRoot").getAttribute("data-uuid");
  if (uuid) draggedOverItem = uuid;
};

/**
 * Set draggingItem to uuid
 * @param {Event} e
 */
const setDraggingItem = (e) => {
  draggingItem = e.target.getAttribute("data-uuid");
};

/**
 * Attach item
 * @param {LayoutItem} item
 */
const attach = (item) => {
  const clone = document
    .querySelector(`[data-template-id="${item.templateId}"]`)
    .content.firstElementChild.cloneNode(true);
  clone.addEventListener("click", () => {
    selectItem(item);
  });
  clone.draggable = true;
  clone.dataset.uuid = item.uuid;
  clone.addEventListener("drag", setDraggingItem);
  clone.addEventListener("dragover", setDraggedOverItem);
  document.querySelector("#layout").addEventListener("drop", compare);
  if (item.uuid === selectedItemId) clone.classList.add("isSelected");
  layoutElement.appendChild(clone);
};

/**
 * Get a UUID
 * @returns {string} Simple uuid
 */
const uuid = () => {
  return ([1e7] + -1e3).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

/**
 * Move item in array
 * @param {LayoutItem[]} arr
 * @param {number} fromIndex
 * @param {number} toIndex
 */
const arrayMove = (arr, fromIndex, toIndex) => {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
};

/**
 * Move component instance down in tree
 **/
const moveDown = () => {
  if (!selectedItemId) return;
  const index = layout.findIndex((item) => item.uuid === selectedItemId);
  if (index < layout.length) arrayMove(layout, index, index + 1);
  render();
};

/**
 * Move component instance up in tree
 */
const moveUp = () => {
  if (!selectedItemId) return;
  const index = layout.findIndex((item) => item.uuid === selectedItemId);
  if (index > 0) arrayMove(layout, index, index - 1);
  render();
};

/**
 * Remove component reference from DOM only
 **/
const remove = () => {
  layout =
    layout.length > 0
      ? layout.filter((item) => item.uuid !== selectedItemId)
      : [];
  render();
};

/**
 * Clear layout
 **/
const clearLayout = () => {
  layout = [];
  selectedItemId = undefined;
  layoutElement.innerHTML = `<div class="appFontMd blank"><p>You can add components from the sidebar and simulate your layouts.</p></div>`;
};

class Theme {
  static Lagerhaus = "Lagerhaus";
  static RWA = "RWA";
}

/**
 * Switch theme
 **/
const switchTheme = () => {
  const toggleValue = toggledTheme(localStorage.getItem("theme"));
  localStorage.setItem("theme", toggleValue);
  populateSelectedTemplateOptions();
  setTheme();
};

/**
 * Set theme
 **/
const setTheme = () => {
  currentTheme = localStorage.getItem("theme") || Theme.Lagerhaus;
  document.body.dataset.theme = currentTheme;

  alert(`Theme for ${currentTheme} is activated!`);
};

const populateSelectedTemplateOptions = () => {
  selectTemplateElement.innerHTML = "";
  templateElements.forEach((template) => {
    const isBrand = template.getAttribute("data-brand");
    if (currentTheme !== isBrand) {
      var opt = document.createElement("option");
      opt.value = template.dataset.templateId;
      opt.innerHTML = `${template.dataset.templateId} (${
        template.dataset.templateVersion
      }) ${currentTheme === isBrand ? "*" : ""}`;
      selectTemplateElement.appendChild(opt);
    }
  });
};

function toggledTheme(theme) {
  return theme === Theme.Lagerhaus ? Theme.RWA : Theme.Lagerhaus;
}

/**
 * Prompt file for download
 * @param {string} content
 * @param {string} fileName
 * @param {string} contentType
 */
function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

/**
 * Save layout to file
 */
const saveLayout = () => {
  if (layout.length > 0)
    download(JSON.stringify(layout), "layout.json", "text/plain");
  else alert("Nothing worth saving!");
};

const loadLayout = (_layout) => {
  layout = _layout;
  render();
};

const getLayoutFromStorage = () => {
  _layout = JSON.parse(localStorage.getItem("presetLayout"));
  if (_layout) loadLayout(_layout);
};

function receivedText(e) {
  let lines = e.target.result;
  const layout = JSON.parse(lines);
  const event = new CustomEvent("receivedFile", { detail: layout });
  document.querySelector(".appContent").dispatchEvent(event);
}

const attachlayoutDropZone = () => {
  if (window.FileList && window.File) {
    dropLayoutElement.addEventListener("dragover", (event) => {
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    });
    dropLayoutElement.addEventListener("drop", (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (event.dataTransfer.files.length > 0) {
        const files = event.dataTransfer.files;
        const file = files[0];
        const fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
      }
    });
    dropLayoutElement.addEventListener(
      "receivedFile",
      (e) => {
        loadLayout(e.detail);
      },
      false
    );
  }
};

attachKeyEvents = () => {
  const checkKey = (e) => {
    e = e || window.event;
    if (e.key == "ArrowUp") {
      moveUp();
    } else if (e.key == "ArrowDown") {
      moveDown();
    } else if (e.key == "ArrowLeft") {
      add();
    } else if (e.key == "Delete" || e.key == "Backspace") {
      remove();
    }
  };
  document.onkeydown = checkKey;
};

/**
 * Run the app
 */
const run = () => {
  // Populate options
  setTheme();
  attachlayoutDropZone();
  populateSelectedTemplateOptions();
  clearLayout();
  attachKeyEvents();
  getLayoutFromStorage();
};
run();
