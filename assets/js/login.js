/*=============== FIREBASE CONFIG ===============*/
// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
	getAuth,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";

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

/*=============== SHOW HIDE PASSWORD LOGIN ===============*/
const passwordAccess = (loginPass, loginEye) => {
	const input = document.getElementById(loginPass),
		iconEye = document.getElementById(loginEye);

	iconEye.addEventListener("click", () => {
		// Change password to text
		input.type === "password"
			? (input.type = "text")
			: (input.type = "password");

		// Icon change
		iconEye.classList.toggle("ri-eye-fill");
		iconEye.classList.toggle("ri-eye-off-fill");
	});
};
passwordAccess("password", "loginPassword");

/*=============== SHOW HIDE PASSWORD CREATE ACCOUNT ===============*/
const passwordRegister = (loginPass, loginEye) => {
	const input = document.getElementById(loginPass),
		iconEye = document.getElementById(loginEye);

	iconEye.addEventListener("click", () => {
		// Change password to text
		input.type === "password"
			? (input.type = "text")
			: (input.type = "password");

		// Icon change
		iconEye.classList.toggle("ri-eye-fill");
		iconEye.classList.toggle("ri-eye-off-fill");
	});
};
passwordRegister("passwordCreate", "loginPasswordCreate");

/*=============== SHOW HIDE LOGIN & CREATE ACCOUNT ===============*/
const loginAcessRegister = document.getElementById("loginAccessRegister"),
	buttonRegister = document.getElementById("loginButtonRegister"),
	buttonAccess = document.getElementById("loginButtonAccess");

buttonRegister.addEventListener("click", () => {
	loginAcessRegister.classList.add("active");
});

buttonAccess.addEventListener("click", () => {
	loginAcessRegister.classList.remove("active");
});

/*=============== LOGIN/CREATE ACC FIREBASE WITH SWEETALERT ===============*/
// Referências aos elementos do DOM
const loginForm = document.querySelector(".login__access .login__form");
const registerForm = document.querySelector(".login__register .login__form");

// Função para exibir mensagens com SweetAlert
const showAlert = (type, title, text) => {
	Swal.fire({
		icon: type, // success, error, warning, info
		title: title,
		text: text,
		confirmButtonText: "OK",
	});
};

// Manipulador de login
loginForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	signInWithEmailAndPassword(auth, email, password).catch((error) => {
		let errorMessage;
		switch (error.code) {
			case "auth/invalid-credential":
				errorMessage = "Dados de login incorretos, Tente novamente.";
				break;
			case "auth/wrong-password":
				errorMessage = "Senha incorreta. Tente novamente.";
				break;
			case "auth/too-many-requests":
				errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
				break;
			default:
				errorMessage = "Ocorreu um erro. Por favor tente novamente mais tarde.";
		}
		showAlert("error", "Erro ao Fazer Login", errorMessage);
	});
});

// Manipulador de registro
registerForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const email = document.getElementById("emailCreate").value;
	const password = document.getElementById("passwordCreate").value;
	const firstName = document.getElementById("names").value;
	const lastName = document.getElementById("surnames").value;

	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			showAlert(
				"success",
				"Registro Bem-Sucedido",
				`Conta criada com sucesso! Bem-vindo(a), ${firstName} ${lastName}!`
			);
		})
		.catch((error) => {
			let errorMessage;
			switch (error.code) {
				case "auth/email-already-in-use":
					errorMessage = "Este email já está em uso. Tente outro.";
					break;
				case "auth/weak-password":
					errorMessage = "A senha é muito fraca. Escolha uma senha mais forte.";
					break;
				case "auth/invalid-email":
					errorMessage = "Formato de email inválido.";
					break;
				default:
					errorMessage = "Ocorreu um erro desconhecido.";
			}
			showAlert("error", "Erro ao Criar Conta", errorMessage);
		});
});

/*=============== CHECK USER LOG ===============*/
let isPageLoadCheck = true;

onAuthStateChanged(auth, (user) => {
	if (user) {
		if (isPageLoadCheck) {
			Swal.fire({
				title: "Sessão já iniciada.",
				text: `Está conectado como ${user.email}. Deseja sair?`,
				icon: "info",
				showCancelButton: true,
				confirmButtonText: "Sim, sair.",
				cancelButtonText: "Não, permanecer.",
				allowOutsideClick: false,
			}).then((result) => {
				if (result.isConfirmed) {
					signOut(auth)
						.then(() => {
							Swal.fire({
								icon: "success",
								title: "Logout realizado",
								text: "Saiu com sucesso.",
								confirmButtonText: "OK",
							});
						})
						.catch((error) => {
							Swal.fire({
								icon: "error",
								title: "Erro ao sair",
								text: `Ocorreu um erro ao tentar sair.`,
								confirmButtonText: "OK",
							});
							console.log(error.message);
						});
				} else {
					Swal.fire({
						icon: "info",
						title: "Sessão iniciada",
						text: "Você permanecerá com sessão iniciada.",
						confirmButtonText: "OK",
						willClose: () => {
							window.location.href = "index.html";
						},
					});
				}
			});
		} else {
			// Login bem-sucedido
			Swal.fire({
				icon: "success",
				title: "Login Bem-Sucedido",
				text: `Bem-vindo(a), ${user.email}!`,
				confirmButtonText: "OK",
				willClose: () => {
					window.location.href = "index.html";
				},
			});
		}
	} else {
		console.log("Nenhum utlilzador com sessão iniciada.");
	}
	isPageLoadCheck = false;
});
