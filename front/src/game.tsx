import { useState, useEffect } from "react";
import Pong from "./pong.tsx";
import "./styles/game.css";
import TicTacToe from "./tictactoe.tsx";

function Game() {
	const [gameInPlay, setGameInPlay] = useState<boolean>(false);
	const [clickPong, setClickPong] = useState<boolean>(false);
	const [clickTicTacToe, setClickTicTacToe] = useState<boolean>(false);
	const [opponnentIA, setOpponnentIA] = useState<boolean>(true);

	const handlePong = () => {
		clickPong ? setClickPong(false) : setClickPong(true);
		gameInPlay ? setGameInPlay(false) : setGameInPlay(true);
	}

	const handleTicTacToe = () => {
		clickTicTacToe ? setClickTicTacToe(false) : setClickTicTacToe(true);
		gameInPlay ? setGameInPlay(false) : setGameInPlay(true);
	}

	const handleOpponentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (e.target.value === "ia") {
			setOpponnentIA(true);
		} else {
			setOpponnentIA(false);
		}
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && gameInPlay) {
				setGameInPlay(false);
				setClickPong(false);
				setClickTicTacToe(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [gameInPlay]);

	return (
		<div className="game_container">
			<h1 className="game_container_title">Liste de jeux</h1>
			<select className="game_select" onChange={handleOpponentChange}>
				<option value="ia">Opposant IA</option>
				<option value="human">Opposant Humain</option>
			</select>
			<br />
			<ul className="game_list">
				<li className="game_list_item" onClick={handlePong}>
					<img src="/pong.png" alt="Pong" className="logo_game"/>
				</li>
				<li className="game_list_item" onClick={handleTicTacToe}>
					<img src="/tictactoe.png" alt="Tic Tac Toe" className="logo_game"/>
				</li>
			</ul>
			{gameInPlay &&
				<div className="render_game">
					{clickPong && <Pong opponnentIA={opponnentIA}
					isTournament={false} />}
					{clickTicTacToe && <TicTacToe />}
				</div>
			}
		</div>
	)
}

export default Game;