/* =============== FIREBASE CONFIG =============== */
// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
	getAuth,
	onAuthStateChanged,
	signOut,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import {
	getFirestore,
	collection,
	doc,
	getDocs,
	getDoc,
	setDoc,
	updateDoc,
	query,
	increment,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import {
	getAnalytics,
	logEvent,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";

// Firebase configuration
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
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Reference to the houses collection
const housesCollection = collection(db, "houses");

// Log page view
logEvent(analytics, "page_view");

/* =============== WELCOME USER =============== */
async function welcomeUser(user) {
	const profileElement = document.getElementById("profile");
	if (!profileElement) {
		console.error("Elemento 'profile' não encontrado.");
		return;
	}

	if (user) {
		// Monitor user login state
		logEvent(analytics, "user_login", {
			user_email: user.email,
		});

		// Fetch the user document from Firestore
		const userRef = collection(db, "users");
		const querySnapshot = await getDocs(userRef);
		let userDoc = null;

		// Find the document for the logged-in user by email
		querySnapshot.forEach((doc) => {
			if (doc.data().email === user.email) {
				userDoc = doc.data();
			}
		});

		// If the document exists, update the profile with the first name
		if (userDoc && userDoc.firstName) {
			profileElement.innerHTML = `
				<i class='bx bx-user'></i>
				<span>Bem-vindo, ${userDoc.firstName}!</span>
			`;
		} else {
			// Fallback message if userDoc or firstName is missing
			profileElement.innerHTML = `
				<i class='bx bx-user'></i>
				<span>Bem-vindo!</span>
			`;
		}
	} else {
		// Default message if no user is logged in
		profileElement.innerHTML = `
			<i class='bx bx-user'></i>
			<span>Bem-vindo!</span>
		`;
	}
}

/* =============== DISPLAY USER INFO =============== */
// Function to display user info
async function displayUserInfo(user) {
	const userInfoContainer = document.getElementById("user-info");
	const lastLoginCell = document.getElementById("last-login");

	if (!userInfoContainer || !lastLoginCell) {
		console.error(
			'Elemento "user-info" ou o <td> do último login não encontrado.'
		);
		return;
	}

	if (user) {
		// Fetch the user document from Firestore
		const userRef = collection(db, "users");
		const querySnapshot = await getDocs(userRef);
		let userDoc = null;

		// Find the document for the logged-in user by email
		querySnapshot.forEach((doc) => {
			if (doc.data().email === user.email) {
				userDoc = doc.data();
			}
		});

		// If the document exists, use the firstName and lastName from Firestore
		if (userDoc) {
			const displayName = `${userDoc.firstName} ${userDoc.lastName}`;
			const lastLogin = user.metadata.lastSignInTime;

			// Convert the lastLogin to a readable format
			const lastLoginDate = new Date(lastLogin).toLocaleString();

			// Display the user info
			userInfoContainer.innerHTML = `
				<p>${displayName}</p>
			`;

			// Display the last login
			lastLoginCell.innerHTML = lastLoginDate;
		} else {
			// If no document is found, display a fallback
			userInfoContainer.innerHTML =
				"<p>Utilizador não encontrado no Firestore.</p>";
			lastLoginCell.innerHTML = "Nenhum login registrado";
		}
	} else {
		// If the user is not logged in
		userInfoContainer.innerHTML = "<p>Não há utilizador autenticado.</p>";
		lastLoginCell.innerHTML = "Nenhum login registrado";
	}
}

/* =============== LOG USERS FIREBASE =============== */
// Function to log all users saved in Firestore
async function logAllUsers() {
	const usersRef = collection(db, "users"); // Reference to the 'users' collection
	const querySnapshot = await getDocs(usersRef); // Get all documents in the 'users' collection

	// Loop through the documents and log the data
	querySnapshot.forEach((doc) => {
		console.log(doc.id, " => ", doc.data()); // Log the user document ID and data
	});
}

// Call the function to log all users
logAllUsers();

/* =============== FETCH ALL USERS AND DISPLAY =============== */
// Function to fetch and display all users in the table
async function displayUsersInTable() {
	const usersRef = collection(db, "users"); // Reference to the 'users' collection
	const querySnapshot = await getDocs(usersRef); // Get all documents

	const tableBody = document.getElementById("userTableBody"); // Replace with the correct table body ID
	const addedUserIds = new Set(); // Track added user IDs

	// Clear existing rows in the table body
	tableBody.innerHTML = "";

	querySnapshot.forEach((doc) => {
		const userId = doc.id; // Unique user document ID
		if (addedUserIds.has(userId)) return; // Skip if user already added

		const userData = doc.data();
		const firstName = userData.firstName || "Nome não disponível"; // Use Firestore firstName or fallback
		const lastName = userData.lastName || ""; // Use Firestore lastName or fallback
		const lastLogin = userData.lastLogin
			? new Date(userData.lastLogin.seconds * 1000).toLocaleString()
			: "Não disponível"; // Format last login date

		// Create a new row for each user
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>
				<i class='bx bx-user'></i>
				<div id="user-info">
					<p>${firstName} ${lastName}</p>
				</div>
			</td>
			<td>${lastLogin}</td>
			<td><span class="status completed">Online</span></td>
		`;

		// Append the new row to the table body
		tableBody.appendChild(row);

		// Mark this user as added
		addedUserIds.add(userId);
	});
}

// Call the function to display users in the table
displayUsersInTable();

/* =============== AUTHENTICATION CHECK =============== */
onAuthStateChanged(auth, async (user) => {
	if (user) {
		// Fetch user details from Firestore
		const userRef = collection(db, "users");
		const querySnapshot = await getDocs(userRef);
		let userDoc = null;

		// Find the document for the logged-in user by email
		querySnapshot.forEach((doc) => {
			if (doc.data().email === user.email) {
				userDoc = doc.data();
			}
		});

		if (userDoc) {
			const firstName = userDoc.firstName || "Utilizador";

			// Dynamically add the welcome message
			const profile = document.getElementById("profile");
			const welcomeMessage = document.createElement("span");
			welcomeMessage.textContent = `Bem-vindo, ${firstName}`;
			welcomeMessage.style.marginLeft = "8px"; // Add some spacing
			welcomeMessage.style.fontSize = "1rem"; // Adjust size for responsiveness
			welcomeMessage.style.whiteSpace = "nowrap"; // Prevent breaking
			profile.appendChild(welcomeMessage);
		}

		// User is signed in
		const userName = user.displayName || "Nome não disponível";
		const userEmail = user.email;
		const userLastLogin = user.metadata.lastSignInTime;

		// Populate the HTML elements with the user data
		document.getElementById("userName").textContent = userName;
		document.getElementById("userEmail").textContent = userEmail;
		document.getElementById("userLastLogin").textContent = new Date(
			userLastLogin
		).toLocaleString();
	} else {
		console.log("User is not logged in");
	}
});

/* =============== LOGOUT BUTTON =============== */
// Reference to the logout button
const logoutButton = document.getElementById("logoutButton");

// Adding an event listener to the logout button
logoutButton.addEventListener("click", (e) => {
	e.preventDefault();

	// Log out the user
	signOut(auth)
		.then(() => {
			// Show success message or redirect user
			Swal.fire({
				icon: "success",
				title: "Logout Bem-Sucedido",
				text: "Você saiu da sua conta com sucesso!",
				confirmButtonText: "OK",
				willClose: () => {
					window.location.href = "index.html"; // Redirect to login page or homepage
				},
			});
		})
		.catch((error) => {
			let errorMessage = "Ocorreu um erro ao tentar sair.";
			Swal.fire({
				icon: "error",
				title: "Erro ao Sair",
				text: errorMessage,
				confirmButtonText: "OK",
			});
		});
});

/* =============== TOGGLE SIDEBAR =============== */
const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

allSideMenu.forEach((item) => {
	const li = item.parentElement;

	item.addEventListener("click", function () {
		allSideMenu.forEach((i) => {
			i.parentElement.classList.remove("active");
		});
		li.classList.add("active");
	});
});

const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
	sidebar.classList.toggle("hide");
});

const searchButton = document.querySelector(
	"#content nav form .form-input button"
);
const searchButtonIcon = document.querySelector(
	"#content nav form .form-input button .bx"
);
const searchForm = document.querySelector("#content nav form");

searchButton.addEventListener("click", function (e) {
	if (window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle("show");
		if (searchForm.classList.contains("show")) {
			searchButtonIcon.classList.replace("bx-search", "bx-x");
		} else {
			searchButtonIcon.classList.replace("bx-x", "bx-search");
		}
	}
});

if (window.innerWidth < 768) {
	sidebar.classList.add("hide");
} else if (window.innerWidth > 576) {
	searchButtonIcon.classList.replace("bx-x", "bx-search");
	searchForm.classList.remove("show");
}

window.addEventListener("resize", function () {
	if (this.innerWidth > 576) {
		searchButtonIcon.classList.replace("bx-x", "bx-search");
		searchForm.classList.remove("show");
	}
});

const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
	if (this.checked) {
		document.body.classList.add("dark");
	} else {
		document.body.classList.remove("dark");
	}
});

/* =============== HOUSES FIRESTORE =============== */
// Fetch houses from Firestore
async function loadHouses() {
	try {
		const querySnapshot = await getDocs(housesCollection); // Get all houses from Firestore

		const todoList = document.querySelector(".todo-list");
		todoList.innerHTML = ""; // Clear the existing list before appending new items

		querySnapshot.forEach((doc) => {
			const house = doc.data(); // Get the data of each house

			// Create a new list item for each house
			const listItem = document.createElement("li");
			listItem.classList.add("completed");

			// Create the house name and append to the list item
			const houseName = document.createElement("p");
			houseName.textContent = house.title; // Use the title from Firestore
			listItem.appendChild(houseName);

			// Create the dots icon for each house
			const dotsIcon = document.createElement("i");
			dotsIcon.classList.add("bx", "bx-dots-vertical-rounded");
			listItem.appendChild(dotsIcon);

			// Append the list item to the ul
			todoList.appendChild(listItem);
		});
	} catch (error) {
		console.error("Error loading houses from Firestore:", error);
	}
}

// Call the function to load houses from Firestore
loadHouses();

document.addEventListener("DOMContentLoaded", () => {
	const popup = document.getElementById("addHousePopup");
	const addHouseForm = document.getElementById("addHouseForm");
	const houseImageInput = document.getElementById("houseImage");
	const imagePreview = document.getElementById("imagePreview");

	// Show popup when clicking the plus icon
	openPopup.addEventListener("click", () => {
		addHousePopup.style.display = "flex"; // Show the popup
	});

	// Close popup when clicking the close button
	closePopup.addEventListener("click", () => {
		addHousePopup.style.display = "none"; // Hide the popup
	});

	// Optional: Close the popup if the user clicks outside of it
	window.addEventListener("click", (event) => {
		if (event.target === addHousePopup) {
			addHousePopup.style.display = "none"; // Close if clicked outside
		}
	});

	// Handle image selection and preview
	houseImageInput.addEventListener("change", function (event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				// Show the image preview
				imagePreview.src = e.target.result;
				imagePreview.style.display = "block"; // Make image visible
			};
			reader.readAsDataURL(file); // Convert file to a data URL
		}
	});

	// Function to format price with dots as thousands separator
	function formatPrice(price) {
		// Remove any non-numeric characters first
		price = price.replace(/\D/g, "");
		// Format the price with dots for thousands separator
		return price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

	// Handle the form submission
	addHouseForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		// Get house data from form inputs
		const title = document.getElementById("houseTitle").value;
		const location = document.getElementById("houseLocation").value;
		const description = document.getElementById("houseDescription").value;
		let price = document.getElementById("housePrice").value;

		// Validation checks
		if (!title || !location || !description || !price) {
			alert("All fields are required!");
			return;
		}

		// Format the price and remove any non-numeric characters
		price = formatPrice(price); // Format the price with dots

		const newHouse = {
			title,
			location,
			description,
			price,
		};

		// Reference to the houses collection
		const housesRef = collection(db, "houses");

		// Get the current number of houses to auto-increment the ID
		const housesQuery = query(housesRef);
		const querySnapshot = await getDocs(housesQuery);
		const nextId = querySnapshot.size; // Next ID is based on the number of existing houses

		// Get the image file from the input
		const imageFile = houseImageInput.files[0];

		if (imageFile) {
			// Get the relative path for the image (you can choose how to store it)
			const imagePath = `assets/img/${imageFile.name}`; // Store it in the assets/img/ directory

			// Assuming you are manually moving the file to the desired location
			// Save the relative path in Firestore
			newHouse.image = imagePath;
		}

		try {
			// Create a new house document with the incremented ID
			const houseRef = doc(db, "houses", nextId.toString()); // Use the calculated ID
			await setDoc(houseRef, { ...newHouse });

			console.log("New house added to Firestore");

			// Optionally, you can display the newly added house to the user immediately (optional)
			const todoList = document.querySelector(".todo-list");

			// Create a new list item for the newly added house
			const listItem = document.createElement("li");
			listItem.classList.add("completed");

			// Create the house name and append to the list item
			const houseName = document.createElement("p");
			houseName.textContent = newHouse.title;
			listItem.appendChild(houseName);

			// Create the dots icon for each house
			const dotsIcon = document.createElement("i");
			dotsIcon.classList.add("bx", "bx-dots-vertical-rounded");
			listItem.appendChild(dotsIcon);

			// Append the list item to the ul
			todoList.appendChild(listItem);

			// Close the popup
			addHousePopup.style.display = "none"; // Hide the popup after successful submission
		} catch (error) {
			console.error("Error adding house to Firestore:", error);
			// You can show an error message to the user if the operation fails
		}
	});
});

document.addEventListener("DOMContentLoaded", () => {
	// Ensure that the main content area is loaded
	const contentArea = document.querySelector("#content");
	if (!contentArea) {
		console.error("Content area not found");
		return;
	}

	// Create the sections for Dados and Casas inside the event listener to ensure they are added after the DOM is ready
	const dadosSection = document.createElement("div"); // Create a blank page for Dados
	dadosSection.style.display = "none"; // Initially hidden
	dadosSection.innerHTML =
		"<h1 style='text-align: center; margin-top: 50px;'></h1>"; // Blank page content

	const casasSection = document.createElement("div"); // Create a blank page for Casas
	casasSection.style.display = "none"; // Initially hidden
	casasSection.innerHTML =
		"<h1 style='text-align: center; margin-top: 50px;'></h1>"; // Blank page content

	// Add the Dados and Casas sections to the content area
	contentArea.appendChild(dadosSection);
	contentArea.appendChild(casasSection);

	// Get the dashboard section (if exists)
	const dashboardSection = document.querySelector("main"); // The dashboard content
	if (!dashboardSection) {
		console.error("Dashboard section not found");
		return;
	}

	// Get the links in the side menu
	const dashboardLink = document.querySelector(".side-menu li:nth-child(1) a"); // Dashboard link
	const dadosLink = document.querySelector(".side-menu li:nth-child(2) a"); // Dados link

	if (!dashboardLink || !dadosLink) {
		console.error("One or more side menu links not found");
		return;
	}

	// Event listener for Dashboard
	dashboardLink.addEventListener("click", (e) => {
		e.preventDefault(); // Prevent default link behavior
		dashboardSection.style.display = "block"; // Show dashboard content
		dadosSection.style.display = "none"; // Hide Dados page
		casasSection.style.display = "none"; // Hide Casas page
		document.querySelector(".side-menu .active").classList.remove("active");
		dashboardLink.parentElement.classList.add("active");
	});

	// Event listener for Dados
	dadosLink.addEventListener("click", (e) => {
		e.preventDefault(); // Prevent default link behavior
		dashboardSection.style.display = "none"; // Hide dashboard content
		dadosSection.style.display = "block"; // Show Dados page
		casasSection.style.display = "none"; // Hide Casas page
		document.querySelector(".side-menu .active").classList.remove("active");
		dadosLink.parentElement.classList.add("active");
	});
});

document.addEventListener("DOMContentLoaded", () => {
	const dashboardSection = document.querySelector("main"); // The dashboard content
	const dadosSection = document.getElementById("dadosSection"); // Get the Dados section
	dadosSection.style.display = "none"; // Initially hidden

	const casasSection = document.createElement("div"); // Create a blank page for Casas
	casasSection.style.display = "none"; // Initially hidden
	casasSection.innerHTML =
		"<h1 style='text-align: center; margin-top: 50px;'></h1>"; // Blank page content

	// Add the Casas section to the content area
	document.querySelector("#content").appendChild(casasSection);

	const dashboardLink = document.querySelector(".side-menu li:nth-child(1) a"); // Dashboard link
	const dadosLink = document.querySelector(".side-menu li:nth-child(2) a"); // Dados link

	// Event listener for Dashboard
	dashboardLink.addEventListener("click", (e) => {
		e.preventDefault(); // Prevent default link behavior
		dashboardSection.style.display = "block"; // Show dashboard content
		dadosSection.style.display = "none"; // Hide Dados page
		casasSection.style.display = "none"; // Hide Casas page
		document.querySelector(".side-menu .active").classList.remove("active");
		dashboardLink.parentElement.classList.add("active");
	});

	// Event listener for Dados
	dadosLink.addEventListener("click", (e) => {
		e.preventDefault(); // Prevent default link behavior
		dashboardSection.style.display = "none"; // Hide dashboard content
		dadosSection.style.display = "block"; // Show Dados page
		casasSection.style.display = "none"; // Hide Casas page
		document.querySelector(".side-menu .active").classList.remove("active");
		dadosLink.parentElement.classList.add("active");
	});
});

// Function to log the event
function logLoginEvent(userEmail) {
	logEvent(analytics, "user_login", {
		user_email: userEmail,
	});

	// Increment login count in Firestore
	incrementLoginCount();
}

// Function to increment login count in Firestore
async function incrementLoginCount() {
	const userRef = doc(db, "stats", "loginCount");

	// Fetch the current login count
	const docSnap = await getDoc(userRef);
	if (docSnap.exists()) {
		await updateDoc(userRef, {
			count: increment(1),
		});
	} else {
		await setDoc(userRef, { count: 1 });
	}

	// Update the visit count displayed on the page
	displayVisitCount();
}

// Function to display the visit count
async function displayVisitCount() {
	const userRef = doc(db, "stats", "loginCount");

	const docSnap = await getDoc(userRef);
	if (docSnap.exists()) {
		const visitCount = docSnap.data().count;
		document.getElementById("visit-count").innerText = visitCount;
	} else {
		document.getElementById("visit-count").innerText = 0;
	}
}

// Call this function to display the current visit count on page load
displayVisitCount();

// Example of triggering the login event (replace with actual login logic)
const user = { email: "user@example.com" };
logLoginEvent(user.email);

// Fetch user reservations and display the houses
async function displayReservedHouses(user) {
	const tableBody = document.getElementById("housesTableBody"); // Referência à tabela de casas
	const addedHouseIds = new Set(); // Rastrear casas já adicionadas

	// Limpar as linhas existentes na tabela antes de adicionar novas
	tableBody.innerHTML = "";

	if (user) {
		// Fetch the user document from Firestore
		const userRef = collection(db, "users");
		const querySnapshot = await getDocs(userRef);
		let userDoc = null;

		// Encontre o documento do utilizador logado
		querySnapshot.forEach((doc) => {
			if (doc.data().email === user.email) {
				userDoc = doc.data();
			}
		});

		// Verifique se o utilizador tem reservas
		if (userDoc && userDoc.reservations) {
			const reservations = userDoc.reservations; // IDs das casas reservadas

			// Para cada ID de casa reservado, busque a casa correspondente na coleção "houses"
			for (const houseId of reservations) {
				const houseRef = doc(db, "houses", houseId);
				const houseSnapshot = await getDoc(houseRef);

				if (houseSnapshot.exists()) {
					const house = houseSnapshot.data();

					// Criação de uma nova linha na tabela para cada casa reservada
					const row = document.createElement("tr");
					row.innerHTML = `
                        <td>
                            <i class='bx bx-building-house'></i>
                            <div id="house-info">
                                <p>${house.title}</p> <!-- Exibe o título da casa -->
                            </div>
                        </td>
                        <td><span class="status completed">Reservada</span></td>
                    `;

					// Adiciona a linha à tabela
					tableBody.appendChild(row);
					addedHouseIds.add(houseId); // Marca essa casa como adicionada
				}
			}
		} else {
			console.log("Não há reservas para este utilizador.");
		}
	} else {
		// Caso o utilizador não esteja autenticado
		console.error("Nenhum utilizador logado.");
	}
}

// Função para verificar o estado de login do utilizador e carregar as reservas
onAuthStateChanged(auth, (user) => {
	if (user) {
		// Carregar as casas reservadas para o utilizador
		displayReservedHouses(user);
	} else {
		console.log("Nenhum utilizador está autenticado.");
	}
});
