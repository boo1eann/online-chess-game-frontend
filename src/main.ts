import { router } from './lib/router';
import { storage } from './lib/storage';
import { LoginPage } from './pages/LoginPage';
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

	router.route('login', async () => {
		const loginPage = new LoginPage();
		await loginPage.render();
	})

	router.start();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}