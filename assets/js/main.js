/*=============== FIREBASE CONFIG ===============*/
// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
	getAuth,
	onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import {
	getFirestore,
	collection,
	getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
	apiKey: "AIzaSyACDeynjEEji0KA0pBRp9dxs3Va7emRS90",
	authDomain: "webdev-1866d.firebaseapp.com",
	projectId: "webdev-1866d",
	storageBucket: "webdev-1866d.firebasestorage.app",
	messagingSenderId: "196883956281",
	appId: "1:196883956281:web:163411a11cc730c72d03e8",
	measurementId: "G-CVSMZKXL46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
	const header = document.getElementById("header");
	if (this.scrollY >= 50) {
		header.classList.add("scroll-header");
	} else {
		header.classList.remove("scroll-header");
	}
}

window.addEventListener("scroll", scrollHeader);

/*=============== HOUSES JSON AND SWIPPER ===============*/
document.addEventListener("DOMContentLoaded", () => {
	const container = document.getElementById("houses-container");
	const db = getFirestore(); // Firestore reference

	// Reference to the 'houses' collection
	const housesRef = collection(db, "houses");

	// Fetch houses from Firestore
	getDocs(housesRef)
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				const house = doc.data(); // Get data from Firestore document

				// Create house card dynamically
				const houseCard = `
                    <article class="popular__card swiper-slide" data-id="${
											doc.id
										}">
                        <img src="${house.image}" alt="${
					house.title
				}" class="popular__img">
                        <div class="popular__data">
                            <h2 class="popular__price">
                                ${house.price.replace(
																	"€",
																	'<span class="euro-symbol">€</span>'
																)}
                            </h2>
                            <h3 class="popular__title">${house.title}</h3>
                            <p class="popular__description">${
															house.location
														}</p>
                        </div>
                    </article>
                `;
				container.innerHTML += houseCard;
			});

			// Initialize Swiper
			const swiperPopular = new Swiper(".popular__container", {
				spaceBetween: 32,
				grabCursor: true,
				centeredSlides: true,
				slidesPerView: "auto",
				loop: true,
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
			});
		})
		.catch((error) =>
			console.error("Error loading houses from Firestore:", error)
		);
});

/*=============== VALUE ACCORDION ===============*/
const accordionItems = document.querySelectorAll(".value__accordion-item");

accordionItems.forEach((item) => {
	const accordionHeader = item.querySelector(".value__accordion-header");

	accordionHeader.addEventListener("click", () => {
		const openItem = document.querySelector(".accordion-open");
		toggleItem(item);
		if (openItem && openItem !== item) {
			toggleItem(openItem);
		}
	});
});

const toggleItem = (item) => {
	const accordionContent = item.querySelector(".value__accordion-content");

	if (item.classList.contains("accordion-open")) {
		accordionContent.removeAttribute("style");
		item.classList.remove("accordion-open");
	} else {
		accordionContent.style.height = accordionContent.scrollHeight + "px";
		item.classList.add("accordion-open");
	}
};

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
	const scrollY = window.pageYOffset;

	sections.forEach((current) => {
		const sectionHeight = current.offsetHeight,
			sectionTop = current.offsetTop - 58,
			sectionId = current.getAttribute("id");

		if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
			document
				.querySelector(".nav__menu a[href*=" + sectionId + "]")
				.classList.add("active-link");
		} else {
			document
				.querySelector(".nav__menu a[href*=" + sectionId + "]")
				.classList.remove("active-link");
		}
	});
}

window.addEventListener("scroll", scrollActive);

/*=============== SHOW SCROLL UP ===============*/
function scrollUp() {
	const scrollUp = document.getElementById("scroll-up");

	if (this.scrollY >= 350) {
		scrollUp.classList.add("show-scroll");
	} else {
		scrollUp.classList.remove("show-scroll");
	}
}

window.addEventListener("scroll", scrollUp);

/*=============== DARK LIGHT THEME ===============*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "bx-sun";

// Get the selected theme and icon from local storage
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// Get the current theme and icon based on the class on the document
const getCurrentTheme = () =>
	document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
	themeButton.classList.contains(iconTheme) ? "bx-moon" : "bx-sun";

// If there's a selected theme and icon in local storage, apply them
if (selectedTheme) {
	document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
		darkTheme
	);
	themeButton.classList[selectedIcon === "bx-moon" ? "add" : "remove"](
		iconTheme
	);
}

// Add event listener to toggle between dark and light mode
themeButton.addEventListener("click", () => {
	document.body.classList.toggle(darkTheme);
	themeButton.classList.toggle(iconTheme);

	// Save the current theme and icon in local storage
	localStorage.setItem("selected-theme", getCurrentTheme());
	localStorage.setItem("selected-icon", getCurrentIcon());
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
	origin: "top",
	distance: "60px",
	duration: 2500,
	delay: 200,
	reset: true,
});

sr.reveal(
	".home__title, .popular__container, subscribe__container, .footer__container, .recommendations__container, .cookie-popup"
);
sr.reveal(".home__description", { delay: 500 });
sr.reveal(".home__search, .footer__info", { delay: 600 });
sr.reveal(".home__value", { delay: 700 });
sr.reveal(".home__images", { delay: 800, origin: "bottom" });
sr.reveal(".logos__img", { interval: 100 });
sr.reveal(".value__images, .contact__content", { origin: "left" });
sr.reveal(".value__content, .contact__images", { origin: "right" });

/*=============== CHECK USER STATUS ===============*/
onAuthStateChanged(auth, (user) => {
	if (user) {
		// Log da info toda do user
		console.log(
			`User is logged in: \nEmail: ${user.email}, \nDisplay Name: ${
				user.displayName || "N/A"
			}, \nUser ID (UID): ${user.uid}, \nPhoto URL: ${
				user.photoURL || "N/A"
			}, \nEmail Verified: ${user.emailVerified ? "Yes" : "No"}`
		);

		// Extrair o primeiro nome do displayName
		const firstName = user.displayName
			? user.displayName.split(" ")[0]
			: "Usuário";

		// Alterar o texto do botão "Login" para o primeiro nome
		const loginButton = document.getElementById("loginButton");
		if (loginButton) {
			const loginSpan = loginButton.querySelector("span");
			loginSpan.textContent = firstName;
		}
	} else {
		console.log("No user logged in");

		// Se o usuário não estiver logado, mostrar "Login"
		const loginButton = document.getElementById("loginButton");
		if (loginButton) {
			const loginSpan = loginButton.querySelector("span");
			loginSpan.textContent = "Login";
		}
	}
});

/*=============== COOKIES POPUP ===============*/
// Cookie Popup Logic
const cookiePopup = document.getElementById("cookiePopup");
const acceptCookies = document.getElementById("acceptCookies");
const declineCookies = document.getElementById("declineCookies");

// Check if cookies are already accepted or declined
if (
	!localStorage.getItem("cookiesAccepted") &&
	!sessionStorage.getItem("cookiesDeclined")
) {
	cookiePopup.style.display = "flex"; // Show popup
}

// Handle Accept button click
acceptCookies.addEventListener("click", () => {
	localStorage.setItem("cookiesAccepted", "true"); // Save in local storage
	cookiePopup.style.display = "none"; // Hide popup
});

// Handle Decline button click
declineCookies.addEventListener("click", () => {
	sessionStorage.setItem("cookiesDeclined", "true"); // Save in session storage
	cookiePopup.style.display = "none"; // Hide popup
});
