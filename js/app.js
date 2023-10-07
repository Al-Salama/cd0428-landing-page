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
const ACTIVE_SEC_CLASS_NAME = "sec-active";
const ACTIVE_ITEM_CLASS_NAME = "item-active";

let nav = HTMLElement.prototype;
let navList = HTMLUListElement.prototype;

let sections = [HTMLElement.prototype];
const navItems = [
  { li: HTMLLIElement.prototype, a: HTMLAnchorElement.prototype },
];

let currentIntersection = {
  secId: "",
  ratio: 0,
};
let scrollingIntoSection = false;

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

/**
* @description Gets section elements
* @returns {HTMLElement[] | undefined} An array of HTMLElement or undefined if there are no sections in the DOM.
*/
function getSectionsData() {
  const sectionsElms = document.querySelectorAll("main section");
  if (!sectionsElms || sectionsElms.length === 0) return;

  const data = [];
  for (const secElm of sectionsElms) {
    if (secElm instanceof HTMLElement) {
      // to tell javascript that this is an HTMLElement.
      data.push(secElm);
    }
  }

  return data;
}

/**
* @description Sets a section to be an active section.
* @param {string} activeSectionId - The section id.
* @returns {void}
*/
function setActiveSection(activeSectionId) {
  for (const sec of sections) {
    if (sec.id === activeSectionId) {
      sec.classList.add(ACTIVE_SEC_CLASS_NAME);
      /*
        Do not scroll to the closest section while the user
        is navigating to another section using the Navigation Menu.
      */
      if (!scrollingIntoSection) scrollToSectionView(sec.id);
    } else sec.classList.remove(ACTIVE_SEC_CLASS_NAME);
  }

  for (const navItem of navItems) {
    if (navItem.a.href.split("#")[1] === activeSectionId) {
      navItem.li.classList.add(ACTIVE_ITEM_CLASS_NAME);
    } else navItem.li.classList.remove(ACTIVE_ITEM_CLASS_NAME);
  }
}

/**
* @description Perform a smooth scrolling to a specific section.
* @param {string} sectionId - The section id.
* @returns {HTMLElement[] | undefined} An array of HTMLElement or undefined if there are no sections in the DOM.
*/
function scrollToSectionView(sectionId) {
  const sec = sections.find((value) => value.id === sectionId);
  if (sec) scrollingIntoSection = true;
  sec.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav using DocumentFragment and setup our events.
function buildNav() {
  sections = getSectionsData();
  if (!sections) return;

  nav = document.querySelector("nav.navbar__menu");
  navList = nav.querySelector("ul.navbar__list");

  // remove the initial value.
  navItems.splice(0, navItems.length);

  const fragment = document.createDocumentFragment();
  for (const sec of sections) {
    const navItem = document.createElement("li");
    const navAnchor = document.createElement("a");

    navAnchor.classList.add("menu__link");
    navAnchor.href = `#${sec.id}`;
    navAnchor.textContent = sec.dataset.nav;

    if (sec.classList.contains(ACTIVE_SEC_CLASS_NAME))
      navItem.classList.add(ACTIVE_ITEM_CLASS_NAME);

    navItems.push({
      li: navItem,
      a: navAnchor,
    });

    navItem.appendChild(navAnchor);
    fragment.appendChild(navItem);
  }

  navList.appendChild(fragment);
  setupEvents();
}

// The callback function that will be called when there is a change of intersection states or ratio.
function sectionObserverCallback(
  entries = [IntersectionObserverEntry.prototype]
) {
  const intersectingSec = {
    secId: "",
    ratio: 0,
  };

  let removeCurrentIntersection = false;
  for (const entry of entries) {
    if (entry.target.id === currentIntersection.secId) {
      // if this entry is the current active section.

      if (!entry.isIntersecting) {
        // if it's not intersecting anymore, then set it to be removed if there is no other section is intersecting.
        removeCurrentIntersection = true;
      } else {
        // otherwise, update its intersection ratio.
        currentIntersection.ratio = entry.intersectionRatio;
      }
    } else {
      // skip this entry if it's not intersecting.
      if (!entry.isIntersecting) continue;

      // Compare with the current section intersection ratio and select the beggest ratio.
      if (entry.intersectionRatio > currentIntersection.ratio) {
        if (entry.intersectionRatio > intersectingSec.ratio) {
          intersectingSec.secId = entry.target.id;
          intersectingSec.ratio = entry.intersectionRatio;
        }
      }
    }
  }
  if (removeCurrentIntersection && intersectingSec.ratio === 0) {
    /*
    If the current section is set to be remove and there is no other
    sections that is intersecting, then remove the current active section.
    */
    currentIntersection.secId = "";
    currentIntersection.ratio = 0;
    setActiveSection("");
  } else if (intersectingSec.secId !== currentIntersection.secId && intersectingSec.ratio > 0) {
    /*
    Otherwise, check if there is new section
    that is intersecting and set it to be active.
    */
    currentIntersection = intersectingSec;
    setActiveSection(currentIntersection.secId);
  }
}

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu
document.addEventListener("DOMContentLoaded", buildNav);

function setupEvents() {
  // Scroll to section on link click
  navList.addEventListener("click", (ev) => {
    const target = ev.target;
    if (target instanceof HTMLAnchorElement) {
      // Might be a wierd check, but this will give my variable auto-completion.

      ev.preventDefault();
      scrollToSectionView(target.href.split("#")[1]);
    }
  });

  /*
  Setup the Intersection Observer of our sections so that we
  are aware ofwhich section the user is intersecting with.
  */
  const threshold = [];
  for (let index = 7; index <= 20; index++) {
    // Thresh holds starts from 7*0.05 = 0.35, where it is the minimum ratio for the section to be considered intersecting.
    threshold.push(index * 0.05);
  }
  // Setup intersection observer to observe the sections.
  // See: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
  const sectionObserver = new IntersectionObserver(sectionObserverCallback, {
    threshold,
  });

  for (const sec of sections) {
    sectionObserver.observe(sec);
  }

  // Set the variable 'scrollingIntoSection' to false when the user stops scrolling.
  // 'scrollingIntoSection' is true when the user clicks on a navigation item, e.g: Section 3.
  document.onscrollend = (ev) => {
    if (scrollingIntoSection) scrollingIntoSection = false;
  };
}