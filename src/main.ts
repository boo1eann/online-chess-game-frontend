import { router } from './lib/router';
import { storage } from './lib/storage';
import { GamePage } from './pages/GamePage';
import { LobbyPage } from './pages/LobbyPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { store } from './state/store';

async function init() {
	const user = storage.getUser();
	const accessToken = storage.getAccessToken();

	if (user && accessToken) {
		store.setState({ user, isAuthenticated: true });
	}

	router.route('/', () => {
		const state = store.getState();
		if (state.isAuthenticated) {
			router.navigate('/lobby');
		} else {
			router.navigate('/login');
		}
	})

	router.route('/login', async () => {
		const loginPage = new LoginPage();
		await loginPage.render();
	});

	router.route('/register', async () => {
		const registerPage = new RegisterPage();
		await registerPage.render();
	});

	router.route('/lobby', async () => {
		const state = store.getState();
		if (!state.isAuthenticated) {
			router.navigate('/login');
			return;
		}
		const lobbyPage = new LobbyPage();
		await lobbyPage.render();
	});

	router.route('/game', async () => {
		const state = store.getState();
		if (!state.isAuthenticated) {
			router.navigate('/login');
			return;
		}

		const gamePage = new GamePage();
		await gamePage.render();
	})

	router.start();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}