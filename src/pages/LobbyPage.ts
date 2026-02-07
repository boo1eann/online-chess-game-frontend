import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { $, clearElement, createElement } from "../lib/dom";
import { router } from "../lib/router";
import { store } from "../state/store";

export interface CreateMatchDto {
  matchId: string;
  status: string;
  createdAt: string; // ISO-строка из сервера
}

export interface CreateMatchResponse {
  matchId: string;
  status: string;
  createdAt: Date;
}

export interface GetMatchStateResponse {
  matchId: string;
  player1Id: string;
  player2Id?: string;
  status: string;
  currentTurn: string;
  moves: any[];
  result?: string;
  winnerId?: string;
}

export interface JoinMatchResponse {
  matchId: string;
  player1Id: string;
  player2Id: string;
  status: string;
}

export class LobbyPage {
  public async render(): Promise<void> {
    const app = $("#app")!;
    clearElement(app);

    const container = createElement("div", { class: "lobby-page" });

    const header = createElement("h1", { text: "Game lobby" });
    const subtitle = createElement("p", {
      class: "subtitle",
      text: "Choose your game mode",
    });

    const createCard = this.createCard(
      "Create New Match",
      "Create a new match and wait for an opponent",
      "Create Match",
      () => this.handleCreateMatch(),
    );

    const joinCard = this.createCard(
      "Join Match",
      "Join an existing match waiting for players",
      "Find Match",
      () => this.handleJoinMatch(),
    );

    const quickCard = this.createCard(
      "Quick Play",
      "Automatically create or join a match",
      "Quick Play",
      () => this.handleJoinMatch(),
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
    const card = createElement("div", { class: "card lobby-card" });
    const cardTitle = createElement("h3", { text: title });
    const cardDesc = createElement("p", { text: description });
    const button = createElement("button", {
      class: "btn btn-primary btn-block",
      text: buttonText,
    });
    button.onclick = onClick;

    card.appendChild(cardTitle);
    card.appendChild(cardDesc);
    card.appendChild(button);

    return card;
  }

  private async handleCreateMatch(): Promise<void> {
    const response = await apiClient.post<CreateMatchDto>(
      ENDPOINTS.GAME.CREATE_MATCH,
    );
    console.log(response);

    if (response.success) {
      const match: CreateMatchResponse = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
      };

      console.log(match);
      store.setState({ currentMatch: match });
      router.navigate("/game");
    } else if (response.errorCode === "ACTIVE_GAME_EXISTS") {
      alert("У вас уже есть активная партия!");
      router.navigate("/game");
    } else {
      alert(response.error || "Не удалось создать партию");
    }
  }

  private async handleJoinMatch(): Promise<void> {
    try {
      const response = await apiClient.post<JoinMatchResponse>(
        ENDPOINTS.GAME.JOIN_MATCH,
        {},
      );

      if (response.success) {
        const matchResponse = await apiClient.get<GetMatchStateResponse>(
          ENDPOINTS.GAME.GET_MATCH(response.data.matchId),
        );

        if (matchResponse.success) {
          store.setState({ currentMatch: matchResponse.data });
          router.navigate("/game");
        }
      } else {
        alert(response.error || "Failed to join match");
      }
    } catch (error) {
      console.error("Join match err: ", error);
      alert("Failed to join match");
    }
  }
}
