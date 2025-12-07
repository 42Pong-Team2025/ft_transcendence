import { useState, useRef, useEffect } from "react";
import './styles/tournament.css'

function Tournament() {
    //state
    const [onCreate, setOnCreate] = useState<boolean>(false);
    const [tournamentName, setTournamentName] = useState<string>('');
    const [player, setPlayer] = useState<string>('');
    const [players, setPlayers] = useState<string[]>([]);
    const [tournaments, setTournaments] = useState<{id: number, name: string, players: string[], done: boolean}[]>([]);
    const [nextTournamentId, setNextTournamentId] = useState<number>(1);
    const [gameInProgress, setGameInProgress] = useState<boolean>(false);


    //handler
    const handleCreate = () => {
        if (onCreate) {
            setOnCreate(false);
            return;
        }
        setOnCreate(true);
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (players.length < 2) {
            alert('Veuillez ajouter au moins deux joueurs pour creer un tournoi.');
            return;
        }
        if (!tournamentName) {
            alert('Veuillez entrer un nom de tournoi.');
            return;
        }
        setOnCreate(false);
        const newTournament = { id: nextTournamentId, name: tournamentName, players: shuffle(players), done: false };
        setTournaments([...tournaments, newTournament]);
        setNextTournamentId(nextTournamentId + 1);
        // Reset form
        setTournamentName('');
        setPlayers([]);
        setPlayer('');
        console.log('Tournament created :', newTournament);
    }

    const handleAddPlayer = (event: React.FormEvent) => {
        event.preventDefault();
        if (!player) {
            alert('Veuillez entrer un nom de joueur.');
            return;
        }
        if (players.includes(player)) {
            alert('Ce joueur a deja ete ajoute.');
            return;
        }
        setPlayers([...players, player]);
        setPlayer('');
    }

    const handleChangeTournamentName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTournamentName(event.target.value);
    }

    const handleChangePlayer = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlayer(event.target.value);
    }

    const handleDeletePlayer = (event: React.MouseEvent<HTMLButtonElement>) => {
        const playerName = (event.target as HTMLButtonElement).parentElement?.textContent?.slice(0, -1);
        if (playerName) {
            setPlayers(players.filter(p => p !== playerName));
        }
    }

    const handleTournament = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (gameInProgress) {
            alert('Un tournoi est deja en cours.');
            return;
        }
        const tournamentName = (event.target as HTMLButtonElement).parentElement?.querySelector('.tournament_name')?.textContent;
        if (tournamentName) {
            setGameInProgress(true);
        }
    }

    //GAME LOGIC
    const canvaRef = useRef<HTMLCanvasElement>(null);
    const ball = useRef({ x: 350, y: 300, radius: 10, dx: 2, dy:2 });
    const paddle1 = useRef({ x: 20, y: 250, width: 10, height: 100 });
    const paddle2 = useRef({ x: 670, y: 250, width: 10, height: 100 });
    const paddleSpeed = 6;
    const score1 = useRef(0);
    const score2 = useRef(0);

    useEffect(() => {
        if (!gameInProgress) return;
        const canvas = canvaRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        let keys = {} as { [key: string]: boolean };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'w' || e.key === 's' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
            }
            keys[e.key] = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            keys[e.key] = false;
        };
        window.addEventListener("keydown", handleKeyDown), { passive: false };
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
            if (keys["w"] && p1.y > 0) {
                p1.y -= paddleSpeed;
            }
            if (canvas && keys["s"] && p1.y + p1.height < canvas.height) {
                p1.y += paddleSpeed;
            }
            b.x += b.dx;
            b.y += b.dy;
            if (b.y < 0 || b.y > canvas!.height - b.radius) {
                b.dy = -b.dy;
            }
            // Paddle collision
            if (
                (b.x - b.radius < p1.x + p1.width &&
                b.y > p1.y &&
                b.y < p1.y + p1.height) ||
                (b.x + b.radius > p2.x &&
                b.y > p2.y &&
                b.y < p2.y + p2.height)
            ) {
                b.dx = -b.dx;
            }
            // Reset ball if it goes out of bounds
            if (b.x < 0 || b.x > canvas!.width) {
                if (b.x < 0) {
                    score2.current += 1;
                } else {
                    score1.current += 1;
                }
                b.x = canvas!.width / 2;
                b.y = canvas!.height / 2;
                b.dx = 2 * (b.dx > 0 ? 1 : -1);
                b.dy = 2 * (b.dy > 0 ? 1 : -1);
            }
            // Draw paddles and ball
            if (context && canvas) {
                context.fillStyle = "white";
                context.fillRect(p1.x, p1.y, p1.width, p1.height);
                context.fillRect(p2.x, p2.y, p2.width, p2.height);
                context.font = "30px 'Press Start 2P'";
                if (!context.font) {
                    context.font = "30px Arial";
                }
                context.fillText(`${score1.current}`, canvas.width / 4, 50);
                context.fillText(`${score2.current}`, (canvas.width * 3) / 4, 50);
                context.beginPath();
                context.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                context.fill();
                context.strokeStyle = "white";
                context.lineWidth = 4;
                context.setLineDash([10, 10]);
                context.beginPath();
                context.moveTo(canvas.width / 2, 0);
                context.lineTo(canvas.width / 2, canvas.height);
                context.stroke();
            }
            requestAnimationFrame(loop);
        }
        loop();
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [gameInProgress]);


    //render
    return (
        <div className="tournament_container">
            <h1 className="tournament_title">Tournois Pong</h1>
            <div className="inline_section">
                <p className="tournament_subtitle">
                    Creez un tournoi local avec vos amis
                </p>
                <button className="tournament_create_button"
                    onClick={handleCreate}
                    >
                        Creer un tournoi
                </button>
            </div>
            {onCreate &&
                <div className="create_tournament_section">
                    <h2 className="create_title">Nouveau tournoi</h2>
                    <form className="create_tournament_form" onSubmit={handleSubmit}>

                    <p className="create_name">Nom du tournoi</p>
                    <input
                        type="text"
                        className="create_name_input"
                        placeholder="Entrez le nom du tournoi"
                        onChange={handleChangeTournamentName}
                        required
                    />
                    <p className="create_players">Ajoutez des joueurs (minimum 2)</p>
                    </form>
                    <form className="create_add_form" onSubmit={handleAddPlayer}>
                    <input
                        type="text"
                        className="create_players_input"
                        placeholder="Nom du joueur"
                        value={player}
                        onChange={handleChangePlayer}
                        required
                    />
                    <button type="submit" className="create_add_button">
                        Ajouter
                    </button>
                    </form>
                    <br />
                    <div className="players_list">
                        {players.length > 0 &&
                            <p className="number">Joueurs ({players.length}):</p>}
                        <ul className="player_list_ul">
                            {players.map((p, index) => (
                                <li key={index} className="player_item">{p}
                                <button className="delete_button"
                                onClick={handleDeletePlayer}
                                >X</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                    type="submit"
                    form="mainForm"
                    className="create_submit_button"
                    onClick={handleSubmit}
                    >
                    Creer le tournoi
                    </button>
                    <button className="create_cancel_button" onClick={handleCreate}>
                    Annuler
                    </button>
                </div>
                }
            <ul className="tournament_list">
                {tournaments.sort((b, a) => a.id - b.id)
                .map((tournament) => (
                    <li key={tournament.id} className="tournament_item">
                        <h3 className="tournament_name">{tournament.name}</h3>
                        <p className={tournament.done ? 'tournament_status_good' : 'tournament_status_bad'}>{tournament.done ? 'Terminé' : 'En attente'}</p>
                        <p className="tournament_players_number">{tournament.players.length} joueurs inscrits</p>
                        <p className="tournament_players">{tournament.players.join(', ')}</p>
                        {!tournament.done &&
                            <button className="start_tournament_button"
                                onClick={handleTournament}
                            >
                                Démarrer le tournoi
                            </button>}
                    </li>
                ))}
            </ul>
            {gameInProgress &&
                <div className="tournament_in_progress">
                    <canvas
                    ref={canvaRef}
                    className="game_canva"
                    width={700}
                    height={600}
                    />
                </div>}

        </div>
    )
}

function shuffle<T>(array: T[]): T[] {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}


export default Tournament;