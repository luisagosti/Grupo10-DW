/*=============== FIREBASE CONFIG ===============*/
// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
	getAuth,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
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

// Manipulador de login
loginForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			Swal.fire({
				icon: "success",
				title: "Login Bem-Sucedido",
				text: `Bem-vindo(a), ${user.email}!`,
				confirmButtonText: "OK",
				willClose: () => {
					window.location.href = "index.html";
				},
			});
		})
		.catch((error) => {
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
					errorMessage =
						"Ocorreu um erro. Por favor tente novamente mais tarde.";
			}
			Swal.fire({
				icon: "error",
				title: "Erro ao Fazer Login",
				text: errorMessage,
				confirmButtonText: "OK",
			});
		});
});

// Manipulador de registo
let isRegistering = false; // Flag para controlar o registro

registerForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const email = document.getElementById("emailCreate").value;
	const password = document.getElementById("passwordCreate").value;
	const firstName = document.getElementById("names").value;
	const lastName = document.getElementById("surnames").value;

	// Set the flag to true when starting the registration process
	isRegistering = true;

	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;

			// Atualizar o nome no perfil do usuário
			updateProfile(user, {
				displayName: `${firstName} ${lastName}`,
			})
				.then(() => {
					// Exibir o alerta de sucesso após a atualização do perfil
					Swal.fire({
						icon: "success",
						title: "Registro Bem-Sucedido",
						text: `Conta criada com sucesso! Bem-vindo(a), ${firstName} ${lastName}!`,
						confirmButtonText: "OK",
					}).then(() => {
						// Refresh the page after successful registration
						window.location.reload();
					});
				})
				.catch((error) => {
					Swal.fire({
						icon: "error",
						title: "Erro ao Atualizar Perfil",
						text: "Ocorreu um erro ao tentar atualizar o nome do usuário.",
						confirmButtonText: "OK",
					});
				});
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
			Swal.fire({
				icon: "error",
				title: "Erro ao Criar Conta",
				text: errorMessage,
				confirmButtonText: "OK",
			});
		});
});

/*=============== CHECK USER LOG ===============*/
// Monitoramento de estado de autenticação
onAuthStateChanged(auth, (user) => {
	if (user) {
		if (!isRegistering) {
			// Apenas exibir o popup de login se não for um processo de registro
			Swal.fire({
				icon: "success",
				title: "Login Bem-Sucedido",
				text: `Bem-vindo(a), ${user.email}!`,
				confirmButtonText: "OK",
				willClose: () => {
					window.location.href = "index.html";
				},
			});
		} else {
			// Reset the flag after successful registration
			isRegistering = false;
		}
	} else {
		console.log("Nenhum utilizador com sessão iniciada.");
	}
});
