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
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
	arrayUnion,
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
const loginButton = document.getElementById("loginButton");

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
			: "User";

		// Alterar o texto do botão "Login" para o primeiro nome
		if (loginButton) {
			const loginSpan = loginButton.querySelector("span");
			loginSpan.textContent = firstName;
		}

		// Add click event to login button
		loginButton.addEventListener("click", () => {
			// Redirect to user.html if logged in
			window.location.href = "user.html";
		});
	} else {
		console.log("No user logged in");

		if (loginButton) {
			const loginSpan = loginButton.querySelector("span");
			loginSpan.textContent = "Login";
		}

		// Add click event to login button
		loginButton.addEventListener("click", () => {
			// Redirect to user.html if logged in
			window.location.href = "login.html";
		});
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

// Testes
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
                            <button class="reserve-btn">Reservar</button>
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

	// Add event listener for reservations
	document
		.getElementById("houses-container")
		.addEventListener("click", async (e) => {
			// Check if the clicked element is a "Reservar" button
			if (e.target.classList.contains("reserve-btn")) {
				const houseCard = e.target.closest(".popular__card");
				if (houseCard) {
					const houseId = houseCard.dataset.id;
					const user = auth.currentUser;

					if (user) {
						try {
							const userRef = doc(db, "users", user.uid);

							// Update Firestore with the reservation
							await updateDoc(userRef, {
								reservations: arrayUnion(houseId),
							});

							// Show SweetAlert on success
							Swal.fire({
								title: "Sucesso!",
								text: "A sua reserva foi feita com sucesso.",
								icon: "success",
								confirmButtonText: "OK",
							});

							// Optionally update the button to indicate success
							e.target.innerText = "Reserved";
							e.target.disabled = true;
							e.target.style.backgroundColor = "gray";
						} catch (error) {
							console.error("Error making reservation:", error);
							Swal.fire({
								title: "Erro",
								text: "Por favor tente mais tarde.",
								icon: "error",
								confirmButtonText: "OK",
							});
						}
					} else {
						Swal.fire({
							title: "Sessão Inciada",
							text: "Por favor inicie sessão para reservar uma casa.",
							icon: "warning",
							confirmButtonText: "OK",
						});
					}
				}
			}
		});

	// Add event listener for opening popup
	document.getElementById("houses-container").addEventListener("click", (e) => {
		// Only trigger for house cards
		if (e.target.closest(".popular__card")) {
			const houseId = e.target.closest(".popular__card").dataset.id;

			// Fetch the house data again using the houseId
			const houseRef = doc(db, "houses", houseId);
			getDoc(houseRef)
				.then((docSnapshot) => {
					const house = docSnapshot.data();

					// Set the data in the popup
					document.getElementById("popup-title").innerText = house.title;
					document.getElementById("popup-image").src = house.image;
					document.getElementById("popup-description").innerText =
						house.description;
					document.getElementById("popup-price").innerText = house.price;

					// Display the popup
					document.getElementById("house-popup").style.display = "flex";

					// Enable the popup-book-btn event listener
					document
						.getElementById("popup-book-btn")
						.addEventListener("click", function () {
							// Find the corresponding reserve button within the popup
							const reserveBtn = document.querySelector(
								'.popular__card[data-id="' + houseId + '"] .reserve-btn'
							);
							if (reserveBtn) {
								reserveBtn.click();
							}
						});
				})
				.catch((error) =>
					console.error("Error fetching house details:", error)
				);
		}
	});

	// Close the popup when close button is clicked
	document.getElementById("popup-close").addEventListener("click", () => {
		document.getElementById("house-popup").style.display = "none";
	});

	// Optional: Close the popup if clicked outside of the content area
	document.getElementById("house-popup").addEventListener("click", (e) => {
		if (e.target === document.getElementById("house-popup")) {
			document.getElementById("house-popup").style.display = "none";
		}
	});
});

// Function to handle "Reservar" clicks
const handleReservation = async (houseId) => {
	const user = auth.currentUser;

	if (!user) {
		alert("You need to log in to reserve a house.");
		return;
	}

	const userRef = doc(db, "users", user.uid);

	try {
		// Update user's document with the reserved house
		await updateDoc(userRef, {
			reservations: arrayUnion(houseId),
		});

		alert("House reserved successfully!");
	} catch (error) {
		console.error("Error reserving house:", error);

		// If user document doesn't exist, create one with the reservation
		if (error.code === "not-found") {
			try {
				await setDoc(userRef, {
					reservations: [houseId],
				});
				alert("House reserved successfully!");
			} catch (error) {
				console.error("Error creating user document:", error);
				alert("Failed to reserve the house. Please try again.");
			}
		} else {
			alert("Failed to reserve the house. Please try again.");
		}
	}
};

// Add event listener for "Reservar" button
document.addEventListener("click", (event) => {
	if (event.target.classList.contains("reservar-btn")) {
		const houseCard = event.target.closest(".popular__card");
		const houseId = houseCard.dataset.id;

		handleReservation(houseId);
	}
});
