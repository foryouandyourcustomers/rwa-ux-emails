const templateElements = document.querySelectorAll("template.component");
const layoutElement = document.querySelector("#layout");
const selectElement = document.querySelector("#selectedTemplate");
const previewElement = document.querySelector("#preview");
const codeElement = document.querySelector("#code");

let currentSelection = "None";
let layout = [];

/**
 * Select template for preview
 **/
const selectTemplate = () => {
  const selector = `[data-template-id="${selectElement.value}"]`;
  console.log(selector);
  const templateHTML = document.querySelector(selector).innerHTML;
  currentSelection = selectElement.value;
  previewElement.innerHTML = templateHTML;
  if (selectElement.value !== "None") codeElement.innerHTML = templateHTML;
  else codeElement.innerHTML = "";
};

/**
 * Select template for preview from Layout
 **/
const selectTemplateFromLayout = (that) => {
  console.log(that.dataset.templateId);
  // const templateHTML = document.querySelector(
  //   "#" + selectElement.value
  // ).innerHTML;
  // currentSelection = selectElement.value;
  // previewElement.innerHTML = templateHTML;
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
 * Add template to layout
 **/
const add = () => {
  if (currentSelection !== "None") {
    if (layout.length === 0) layoutElement.innerHTML = "";
    const clone = document
      .querySelector(`[data-template-id="${currentSelection}"]`)
      .content.cloneNode(true);
    // Wrap in container
    const container = document
      .querySelector("#componentContainer")
      .content.cloneNode(true);
    container.querySelector(".componentContent").appendChild(clone);
    layoutElement.appendChild(container);
    layout.push(currentSelection);
  } else {
    alert("Select template first!");
  }
};

/**
 * Remove component reference from DOM only
 **/
const remove = (elementRef) => {
  elementRef.parentNode.parentNode.parentNode.parentNode.removeChild(
    elementRef.parentNode.parentNode.parentNode
  );
};

const showTree = () => {
  alert(layout.join("\n"));
};

/**
 * Clear layout
 **/
const clearLayout = () => {
  layout = [];
  layoutElement.innerHTML = `<div class="blank blank--full-height">None</div>`;
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
  console.log(themeSwitcher.innerText, Theme.Lagerhaus);
  themeSwitcher.innerText =
    currentTheme === Theme.Lagerhaus ? Theme.RWA : Theme.Lagerhaus;
};

// set theme on inital load
setTheme();

const run = () => {
  // Populate options
  templateElements.forEach((template) => {
    var opt = document.createElement("option");
    opt.value = template.dataset.templateId;
    opt.innerHTML = template.dataset.templateId;
    selectElement.appendChild(opt);
  });
  clearLayout();
};
run();
