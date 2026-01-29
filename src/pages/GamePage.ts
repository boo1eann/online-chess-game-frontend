import { $, clearElement, createElement } from '../lib/dom';
import { router } from '../lib/router';
import { store } from '../state/store';

export class GamePage {
	public async render(): Promise<void> {
		const app = $('#app')!;
		clearElement(app);

		const state = store.getState();
		const match = state.currentMatch;
		console.log(match);

		if (!match) {
			router.navigate('/lobby');
			return;
		}

		const container = createElement('div', { class: 'game-page' });

		//Header
		const header = createElement('div', { class: 'game-header' });
		const matchId = createElement('p', {
			class: 'match-id',
			text: `Match #${match.matchId.slice(0, 8)}`,
		})
		header.appendChild(matchId);

		// Assemble page
		container.appendChild(header);

		app.appendChild(container);
	}
}