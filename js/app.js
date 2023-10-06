/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Comments should be present at the beginning of each procedure and class.
 * Great to have comments before crucial code sections within the procedure.
 */

/**
 * Define Global Variables
 *
 */
const nav = document.querySelector("nav.navbar__menu");
const navList = nav.querySelector("ul");

let sections;

/**
 * End Global Variables
 * Start Helper Functions
 *
 */
function storeSectionsData() {
  const sectionsElms = document.querySelectorAll("main section");
  if (!sectionsElms || sectionsElms.length === 0) return;

  const data = [];
  for (const secElm of sectionsElms) {
    data.push({
      id: secElm.id,
      navName: secElm.dataset.nav,
    });
  }

  return data;
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav
function buildNav() {
  sections = storeSectionsData();
  if (!sections) return;

  const fragment = document.createDocumentFragment();
  for (const sec of sections) {
    const navLi = document.createElement("li");
    const navAnchor = document.createElement("a");

    navAnchor.textContent = sec.navName;
    navAnchor.href = `#${sec.id}`;

    // I added this data on top of the href because i want to use
    // .getElementById without using string manipulations.
    navAnchor.dataset.scrollTo = sec.id;

    navLi.appendChild(navAnchor);
    fragment.appendChild(navLi);
  }

  navList.appendChild(fragment);
}
buildNav();

// Add class 'active' to section when near top of viewport

// Scroll to anchor ID using scrollTO event

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu

// Scroll to section on link click

// Set sections as active
