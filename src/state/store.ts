import { eventBus } from '../lib/events';

type StateListener<T> = (state: T) => void;

class Store<T extends Record<string, any>> {
	private state: T;
	private listeners: Map<keyof T | 'all', Set<StateListener<any>>> = new Map();

	constructor(initialState: T) {
		this.state = initialState;
	}

	public getState(): T {
		return { ...this.state };
	}

	public setState(updates: Partial<T>): void {
		const oldState = { ...this.state };
		this.state = { ...this.state, ...updates };

		// Notify specific property listeners
		Object.keys(updates).forEach((key) => {
			const listeners = this.listeners.get(key as keyof T);
			if (listeners) {
				listeners.forEach((listener) => listener(this.state[key]));
			}
		});

		// Notify global listeners
		const globalListeners = this.listeners.get('all');
		if (globalListeners) {
			globalListeners.forEach((listener) => listener(this.state));
		}

		eventBus.emit('state:change', this.state, oldState);
	}

	public subscribe<K extends keyof T>(
		property: K | 'all',
		listener: StateListener<T[K]>,
	): () => void {
		if (!this.listeners.has(property)) {
			this.listeners.set(property, new Set());
		}

		this.listeners.get(property)!.add(listener);

		// Return unsubscribe function
		return () => {
			this.listeners.get(property)?.delete(listener);
		}
	}
}

interface AppState {
	user: any | null;
	isAuthenticated: boolean;
	currentMatch: any | null;
	fen: string;
	isLoading: boolean;
	error: string | null;
}

const initialState: AppState = {
	user: null,
	isAuthenticated: false,
	currentMatch: null,
	fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
	isLoading: false,
	error: null,
};

export const store = new Store(initialState);