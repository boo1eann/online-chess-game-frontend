export const validators = {
	email: (email: string): string | null => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email) return 'Email is required';
		if (!emailRegex.test(email)) return 'Invalid email format';
		return null;
	},

	username: (username: string): string | null => {
		if (!username) return 'Username is required';
		if (username.length < 3) return 'Username must be at least 3 characters';
		if (username.length > 20) return 'Username must be less than 20 characters';
		return null;
	},

	password: (password: string): string | null => {
		if (!password) return 'Password is required';
		if (password.length < 8) return 'Password must be at least 8 characters';
		return null;
	},

	confirmPassword: (password: string, confirmPassword: string): string | null => {
		if (!confirmPassword) return 'Please confirm your password';
		if (password !== confirmPassword) return 'Passwords do not match';
		return null;
	}
}