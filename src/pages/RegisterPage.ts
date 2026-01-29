import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { $, clearElement, createElement } from '../lib/dom';
import { router } from '../lib/router';
import { validators } from '../lib/validators';
import { store } from '../state/store';

interface RegisterResponseData {
	userId: string;
	playerId: string;
	email: string;
	username: string;
}

export class RegisterPage {
	private errors: Record<string, string> = {};

	public async render(): Promise<void> {
		const app = $('#app')!;
		clearElement(app);

		const container = createElement('div', { class: 'auth-page' });

		const card = createElement('div', { class: 'card auth-card' });

		const title = createElement('h1', { text: 'Create Account' });
		const subtitle = createElement('p', {
			class: 'subtitle',
			text: 'Sign up to start playing',
		});

		const form = this.createForm();
		const footer = createElement('div', { class: 'auth-footer' });
		const footerText = createElement('span', { text: 'Already have an account? ' });
		const loginLink = createElement('a', {
			text: 'Login',
			href: '/login',
			class: 'link',
		});
		loginLink.setAttribute('data-link', '');

		footer.appendChild(footerText);
		footer.appendChild(loginLink);

		card.appendChild(title);
		card.appendChild(subtitle);
		card.appendChild(form);
		card.appendChild(footer);

		container.appendChild(card);
		app.appendChild(container);
	}

	private createForm(): HTMLElement {
		const form = createElement('form', { class: 'auth-form' });
		form.onsubmit = (e) => this.handleSubmit(e);

		// Email
		const emailGroup = createElement('div', { class: 'form-group' });
		const emailLabel = createElement('label', { text: 'Email', htmlFor: 'email' });
		const emailInput = createElement('input', {
			type: 'email',
			id: 'email',
			placeholder: 'Enter your email',
			required: true,
			autocomplete: 'email',
		}) as HTMLInputElement;
		emailGroup.appendChild(emailLabel);
		emailGroup.appendChild(emailInput);
		if (this.errors.email) {
			const error = createElement('span', { class: 'error-text', text: this.errors.email });
			emailGroup.appendChild(error);
		}

		// Username
		const usernameGroup = createElement('div', { class: 'form-group' });
		const usernameLabel = createElement('label', { text: 'Username', htmlFor: 'username' });
		const usernameInput = createElement('input', {
			type: 'text',
			id: 'username',
			placeholder: 'Choose a username',
			required: true,
		}) as HTMLInputElement;
		usernameGroup.appendChild(usernameLabel);
		usernameGroup.appendChild(usernameInput);
		if (this.errors.username) {
			const error = createElement('span', { class: 'error-text', text: this.errors.username });
			usernameGroup.appendChild(error);
		}

		// Password
		const passwordGroup = createElement('div', { class: 'form-group' });
		const passwordLabel = createElement('label', { text: 'Password', htmlFor: 'password' });
		const passwordInput = createElement('input', {
			type: 'password',
			id: 'password',
			placeholder: 'Create a password',
			required: true,
		}) as HTMLInputElement;
		passwordGroup.appendChild(passwordLabel);
		passwordGroup.appendChild(passwordInput);
		if (this.errors.password) {
			const error = createElement('span', { class: 'error-text', text: this.errors.password });
			passwordGroup.appendChild(error);
		}

		// Confirm Password
		const confirmGroup = createElement('div', { class: 'form-group' });
		const confirmLabel = createElement('label', { text: 'Confirm Password', htmlFor: 'confirmPassword' });
		const confirmInput = createElement('input', {
			type: 'password',
			id: 'confirmPassword',
			placeholder: 'Confirm your password',
			required: true,
		}) as HTMLInputElement;
		confirmGroup.appendChild(confirmLabel);
		confirmGroup.appendChild(confirmInput);
		if (this.errors.confirmPassword) {
			const error = createElement('span', {
				class: 'error-text',
				text: this.errors.confirmPassword,
			});
			confirmGroup.appendChild(error);
		}

		const submitButton = createElement('button', {
			type: 'submit',
			class: 'btn btn-primary btn-block',
			text: 'Register',
		});

		form.appendChild(emailGroup);
		form.appendChild(usernameGroup);
		form.appendChild(passwordGroup);
		form.appendChild(confirmGroup);
		form.appendChild(submitButton);

		return form;
	}

	private async handleSubmit(e: Event): Promise<void> {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const email = (form.querySelector('#email') as HTMLInputElement).value;
		const username = (form.querySelector('#username') as HTMLInputElement).value;
		const password = (form.querySelector('#password') as HTMLInputElement).value;
		const confirmPassword = (form.querySelector('#confirmPassword') as HTMLInputElement).value;

		this.errors = {};

		const emailError = validators.email(email);
		if (emailError) this.errors.email = emailError;

		const usernameError = validators.username(username);
		if (usernameError) this.errors.username = usernameError;

		const passwordError = validators.password(password);
		if (passwordError) this.errors.password = passwordError;

		const confirmError = validators.confirmPassword(password, confirmPassword);
		if (confirmError) this.errors.confirmPassword = confirmError;

		if (Object.keys(this.errors).length > 0) {
			this.render();
			return;
		}

		try {
			const response = await apiClient.post<RegisterResponseData>(ENDPOINTS.AUTH.REGISTER, {
				email,
				username,
				password
			});

			if (!response.success) {
				alert(response.error);
				return;
			}

			store.setState({
				user: { id: response.data.userId, username: response.data.username, email },
				isAuthenticated: true,
			});

			alert('Registration successful! Please login.');

			router.navigate('/login');
		} catch (error) {
			console.error('Registration error:', error);
			alert('Server unavailable. Please try again later.');
		}
	}
}