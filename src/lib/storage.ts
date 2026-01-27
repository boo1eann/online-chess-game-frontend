class Storage {
	private prefix = 'chess_';

	public set(key: string, value: any): void {
		try {
			const serialized = JSON.stringify(value);
			localStorage.setItem(this.prefix + key, serialized);
		} catch (error) {
			console.log('Storage set error: ', error);
		}
	}

	public get<T>(key: string): T | null {
		try {
			const item = localStorage.getItem(this.prefix + key);
			return item ? JSON.parse(item) : null;
		} catch (error) {
			console.log('Storage get error: ', error);
			return null;
		}
	}

	public remove(key: string): void {
		localStorage.removeItem(this.prefix + key);
	}

	public clear(): void {
		Object.keys(localStorage)
			.filter((key) => key.startsWith(this.prefix))
			.forEach((key) => localStorage.removeItem(key));
	}

	// Token management
	public setTokens(accessToken: string, refreshToken: string): void {
		this.set('access_token', accessToken);
		this.set('refresh_token', refreshToken);
	}

	public getAccessToken(): string | null {
		return this.get('access_token');
	}

	public getRefreshToken(): string | null {
		return this.get('refresh_token');
	}

	public clearTokens(): void {
		this.remove('access_token');
		this.remove('refresh_token');
	}

	// User management
	public setUser(user: any): void {
		this.set('user', user);
	}

	public getUser(): any {
		return this.get('user');
	}

	public clearUser(): void {
		this.remove('user');
	}
}

export const storage = new Storage();