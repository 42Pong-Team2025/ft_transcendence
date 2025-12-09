import { useEffect, useRef } from "react";
import "./styles/game.css";

function TicTacToe() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	return (<canvas
			ref={canvasRef}
			width={700}
			height={700}
			className="tictactoeCanvas"
			/>
	);
}

export default TicTacToe;