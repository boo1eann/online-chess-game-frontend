import "../vendor/jquery-global";
import Chessboard from "chessboard-module.js";
import { $, clearElement, createElement } from "../lib/dom";
import { router } from "../lib/router";
import { store } from "../state/store";
import "../assets/css/chessboard.css";
import "../assets/css/main.css";

export class GamePage {
  private board: any;

  public async render(): Promise<void> {
    const app = $("#app")!;
    clearElement(app);

    const state = store.getState();
    const match = state.currentMatch;

    if (!match) {
      router.navigate("/lobby");
      return;
    }

    const container = createElement("div", { class: "game-page" });

    //Header
    const header = createElement("div", { class: "game-header" });
    const matchId = createElement("p", {
      class: "match-id",
      text: `Match #${match.matchId.slice(0, 8)}`,
    });
    header.appendChild(matchId);

    // Chess board
    const boardContainer = createElement("div", {
      id: "chessboard",
      class: "board-container",
    });

    // Assemble page
    container.appendChild(header);
    container.appendChild(boardContainer);

    app.appendChild(container);

    // Initialize chessboard after DOM is ready
    setTimeout(() => {
      this.board = Chessboard("chessboard", {
        pieceTheme: "./src/assets/img/chesspieces/wikipedia/{piece}.png",
        position: "start",
        draggable: true,
      });

      console.log(this.board.fen());

      // Setup WebSocket
      // this.setupWebSocket();
    }, 0);
  }
}
