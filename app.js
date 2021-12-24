const templateElements = document.querySelectorAll("template.component");
const layoutElement = document.querySelector("#layout");
const selectTemplateElement = document.querySelector("#selectedTemplate");
const previewElement = document.querySelector("#preview");
const codeElement = document.querySelector("#code");
const dropLayoutElement = document.querySelector(".appContent");

let selectedTemplateId = "None";
let selectedItemId = undefined;

class LayoutItem {
  static uuid;
  static templateId;
  constructor(templateId) {
    // this.uuid = uuidv4();
    this.uuid = uuid();
    this.templateId = templateId;
  }
}
let layout = [];

/**
 * Update template preview
 */
const updateTemplatePreview = () => {
  const selector = `[data-template-id="${selectedTemplateId}"]`;
  const templateHTML = document.querySelector(selector).innerHTML;
  previewElement.innerHTML = templateHTML;
  if (selectedTemplateId !== "None") codeElement.innerHTML = templateHTML;
  else codeElement.innerHTML = "";
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
  let templateHTML = document.querySelector(".layoutWrapper").innerHTML;
  codeElement.innerHTML = templateHTML;
};

/**
 * Add template to layout
 **/
const add = () => {
  if (selectedTemplateId !== "None") {
    layout.push(new LayoutItem(selectedTemplateId, layout.length));
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
  } else {
    clearLayout();
  }
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
  if (item.uuid === selectedItemId) clone.classList.add("isSelected");
  layoutElement.appendChild(clone);
};

/**
 * Get a UUID v4
 * @returns {string} RFC4122-complaint UUID
 */
const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
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
  const toggleValue =
    localStorage.getItem("theme") === Theme.Lagerhaus
      ? Theme.RWA
      : Theme.Lagerhaus;
  localStorage.setItem("theme", toggleValue);
  setTheme();
};

const themeSwitcher = document.querySelector("#theme");

/**
 * Set theme
 **/
const setTheme = () => {
  const currentTheme = localStorage.getItem("theme") || Theme.Lagerhaus;
  document.body.dataset.theme = currentTheme;
  const innerText = currentTheme === Theme.Lagerhaus ? Theme.RWA : Theme.Lagerhaus;
  themeSwitcher.innerText = "Switch to " + innerText;
};

// set theme on inital load
setTheme();

const populateSelectedTemplateOptions = () => {
  templateElements.forEach((template) => {
    var opt = document.createElement("option");
    opt.value = template.dataset.templateId;
    opt.innerHTML = template.dataset.templateId;
    selectTemplateElement.appendChild(opt);
  });
};

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
  console.log(layout);
  render();
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
      const files = event.dataTransfer.files;
      const file = files[0];
      const fr = new FileReader();
      fr.onload = receivedText;
      fr.readAsText(file);
    });
    dropLayoutElement.addEventListener(
      "receivedFile",
      (e) => {
        console.log(e);
        loadLayout(e.detail);
      },
      false
    );
  }
};

const run = () => {
  // Populate options
  attachlayoutDropZone();
  populateSelectedTemplateOptions();
  clearLayout();
  // loadLayout();
};
run();
