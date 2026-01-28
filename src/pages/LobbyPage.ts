import { $, clearElement, createElement } from '../lib/dom';

export class LobbyPage {
	public async render(): Promise<void> {
		const app = $('#app')!;
		clearElement(app);

		const container = createElement('div', { class: 'lobby-page' });

		const header = createElement('h1', { text: 'Game lobby' });
		const subtitle = createElement('p', { class: 'subtitle', text: 'Choose your game mode' });

		const createCard = this.createCard(
			'Create New Match',
			'Create a new match and wait for an opponent',
			'Create Match',
			() => alert('handCreateMatch()'),
		);

		const joinCard = this.createCard(
			'Join Match',
			'Join an existing match waiting for players',
			'Find Match',
			() => alert('handleJoinMatch()'),
		);

		const quickCard = this.createCard(
			'Quick Play',
			'Automatically create or join a match',
			'Quick Play',
			() => alert('handleJoinMatch()'),
		);

		container.appendChild(header);
		container.appendChild(subtitle);
		container.appendChild(createCard);
		container.appendChild(joinCard);
		container.appendChild(quickCard);

		app.appendChild(container);
	}

	private createCard(
		title: string,
		description: string,
		buttonText: string,
		onClick: () => void,
	): HTMLElement {
		const card = createElement('div', { class: 'card lobby-card' });
		const cardTitle = createElement('h3', { text: title });
		const cardDesc = createElement('p', { text: description });
		const button = createElement('button', {
			class: 'btn btn-primary btn-block',
			text: buttonText,
		});
		button.onclick = onClick;

		card.appendChild(cardTitle);
		card.appendChild(cardDesc);
		card.appendChild(button);

		return card;
	}
}