import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { $, clearElement, createElement } from '../lib/dom';
import { router } from '../lib/router';
import { storage } from '../lib/storage';
import { validators } from '../lib/validators';
import { store } from '../state/store';

interface LoginResponseData {
	accessToken: string;
	refreshToken: string;
	userId: number;
	username: string;
}

export class LoginPage {
	private errors: Record<string, string> = {};

	public async render(): Promise<void> {
		const app = $('#app')!;
		clearElement(app);

		const container = createElement('div', { class: 'auth-page' });
		const card = createElement('div', { class: 'card auth-card' });

		const title = createElement('h1', { text: 'Welcome Back!' });
		const subtitle = createElement('p', { class: 'subtitle', text: 'Login to continue playing' });

		const form = this.createForm();
		const footer = this.createFooter()

		card.appendChild(title);
		card.appendChild(subtitle);
		card.appendChild(form);
		card.appendChild(footer);

		container.appendChild(card);
		app.appendChild(container);
	}

	private createForm(): HTMLFormElement {
		const form = createElement('form', { class: 'auth-form' });
		form.onsubmit = (e) => this.handleSubmit(e);
		HTMLLabelElement
		// Email
		const emailGroup = createElement('div', { class: 'form-group' });
		const emailLabel = createElement('label', { text: 'Email', htmlFor: 'email' });
		const emailInput = createElement('input', {
			type: 'email',
			id: 'email',
			placeholder: 'Enter your email',
			required: true,
			autocomplete: 'email',
		});
		emailGroup.appendChild(emailLabel);
		emailGroup.appendChild(emailInput);

		if (this.errors.email) {
			const error = createElement('span', { class: 'error-text', text: this.errors.email });
			emailGroup.appendChild(error);
		}

		// Password
		const passwordGroup = createElement('div', { class: 'form-group' });
		const passwordLabel = createElement('label', { text: 'Password', htmlFor: 'password' });
		const passwordInput = createElement('input', {
			type: 'password',
			id: 'password',
			placeholder: 'Enter your password',
			required: true,
		});
		passwordGroup.appendChild(passwordLabel);
		passwordGroup.appendChild(passwordInput);

		if (this.errors.password) {
			const error = createElement('span', { class: 'error-text', text: this.errors.password });
			passwordGroup.appendChild(error);
		}

		const submitButton = createElement('button', {
			type: 'submit',
			class: 'btn btn-primary btn-block',
			text: 'Login',
		});

		// const guestButton = createElement('button', {
		// 	type: 'button',
		// 	class: 'btn btn-outline btn-block',
		// 	text: 'Continue as Guest'
		// });
		// guestButton.onclick = () => this.handleGuestLogin();

		form.appendChild(emailGroup);
		form.appendChild(passwordGroup);
		form.appendChild(submitButton);
		// form.appendChild(guestButton);

		return form;
	}

	private createFooter(): HTMLElement {
		const footer = createElement('div', { class: 'auth-footer' });
		const text = createElement('span', { text: "Don't have an account? " });
		const link = createElement('a', {
			text: 'Sign Up',
			href: '/register',
			class: 'link',
		});
		link.setAttribute('data-link', '');

		footer.appendChild(text);
		footer.appendChild(link);

		return footer;
	}

	private async handleSubmit(e: Event): Promise<void> {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const email = (form.querySelector('#email') as HTMLInputElement).value;
		const password = (form.querySelector('#password') as HTMLInputElement).value;

		this.errors = {};

		const emailError = validators.email(email);
		if (emailError) this.errors.email = emailError;

		const passwordError = validators.password(password);
		if (passwordError) this.errors.password = passwordError;

		if (Object.keys(this.errors).length > 0) {
			this.render();
			return;
		}

		try {
			const response = await apiClient.post<LoginResponseData>(ENDPOINTS.AUTH.LOGIN, { email, password });

			if (response.success) {
				storage.setTokens(response.data.accessToken, response.data.refreshToken);
				storage.setUser({
					id: response.data.userId,
					username: response.data.username,
					email,
				});

				store.setState({
					user: { id: response.data.userId, username: response.data.username, email },
					isAuthenticated: true,
				});

				router.navigate('/lobby');
			} else {
				alert(response.error || 'Login failed');
			}
		} catch (error) {
			console.error('Login error: ', error);
			alert('Server unavailable. Please try again later.');
		}
	}
}