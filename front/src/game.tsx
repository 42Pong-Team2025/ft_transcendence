import { useRef, useEffect } from "react";
import "./styles/game.css";

function Game() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ball = useRef({ x: 350, y: 300, radius: 10, dx: 2, dy:2 });
	const paddle1 = useRef({ x: 20, y: 250, width: 10, height: 100 });
	const paddle2 = useRef({ x: 670, y: 250, width: 10, height: 100 });
	const paddleSpeed = 6;
	const aiKeys = useRef({ up: false, down: false });

	setInterval(() => {
		const p1 = paddle1.current;
		const b = ball.current;
		const timeToReachAI = (b.x - p1.x) / b.dx;
		const predictedY = b.y + b.dy * timeToReachAI;
		
		if (predictedY < p1.y + p1.height / 2) {
			aiKeys.current.up = true;
			aiKeys.current.down = false;
		} else if (predictedY > p1.y + p1.height / 2) {
			aiKeys.current.up = false;
			aiKeys.current.down = true;
		} else {
			aiKeys.current.up = false;
			aiKeys.current.down = false;
		}
	}, 1000);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const context = canvas.getContext("2d");
		if (!context) return;
		let keys = {} as { [key: string]: boolean };

		const handleKeyDown = (e: KeyboardEvent) => {
			keys[e.key] = true;
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			keys[e.key] = false;
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		function loop()  {
			const b = ball.current;
			const p1 = paddle1.current;
			const p2 = paddle2.current;

			if (context && canvas) {
				context.clearRect(0, 0, canvas.width, canvas.height);
			}
			if (keys["ArrowUp"] && p2.y > 0) {
				p2.y -= paddleSpeed;
			}
			if (canvas && keys["ArrowDown"] && p2.y + p2.height < canvas.height) {
				p2.y += paddleSpeed;
			}
			if (aiKeys.current.up && p1.y > 0) {
				p1.y -= paddleSpeed;
			}
			if (aiKeys.current.down && canvas && p1.y + p1.height < canvas.height) {
				p1.y += paddleSpeed;
			}
			b.x += b.dx;
			b.y += b.dy;
			if (b.y < 0 || b.y > canvas!.height - b.radius) {
				b.dy = -b.dy;
			}
			// Paddle collision
			// if (
			// 	(b.x - b.radius < p1.x + p1.width &&
			// 	b.y > p1.y &&
			// 	b.y < p1.y + p1.height) ||
			// 	(b.x + b.radius > p2.x &&
			// 	b.y > p2.y &&
			// 	b.y < p2.y + p2.height)
			// ) {
			// 	b.dx = -b.dx;
			// }
			if (
				b.x - b.radius < p1.x + p1.width &&
				b.y >= p1.y &&
				b.y <= p1.y + p1.height)
				{
					const relativeIntersectY = (p1.y + (p1.height / 2)) - b.y;
					const normalized = relativeIntersectY / (p1.height / 2);
					const maxBounceAngle = Math.PI / 3;
					const bounceAngle = normalized * maxBounceAngle;
					const speed = Math.sqrt(b.dx * b.dx + b.dy * b.dy);
					b.dx = speed * Math.cos(bounceAngle);
					b.dy = -speed * Math.sin(bounceAngle);
					b.x = p1.x + p1.width + b.radius;
				}
			if (
				b.x + b.radius > p2.x &&
				b.y >= p2.y &&
				b.y <= p2.y + p2.height)
				{
					const relativeIntersectY = (p2.y + (p2.height / 2)) - b.y;
					const normalized = relativeIntersectY / (p2.height / 2);
					const maxBounceAngle = Math.PI / 3;
					const bounceAngle = normalized * maxBounceAngle;
					const speed = Math.sqrt(b.dx * b.dx + b.dy * b.dy);
					b.dx = -speed * Math.cos(bounceAngle);
					b.dy = -speed * Math.sin(bounceAngle);
					b.x = p2.x - b.radius;
				}
			// Reset ball if it goes out of bounds
			if (b.x < 0 || b.x > canvas!.width) {
				b.x = canvas!.width / 2;
				b.y = canvas!.height / 2;
				b.dx = 2 * (b.dx > 0 ? 1 : -1);
				b.dy = 2 * (b.dy > 0 ? 1 : -1);
			}
			// Draw paddles and ball
			if (context) {
				context.fillStyle = "red";
				context.fillRect(p1.x, p1.y, p1.width, p1.height);
				context.fillStyle = "white";
				context.fillRect(p2.x, p2.y, p2.width, p2.height);
				context.beginPath();
				context.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
				context.fill();
			}
			requestAnimationFrame(loop);
		}
		loop();
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	return (
		<div className="game_container">
			<p>Welcome to the Game section!</p>
			<canvas
			ref={canvasRef}
			width={700}
			height={600}
			className="gameCanvas"
			/>
				
		</div>
	)
}

export default Game;