import { useState } from "react";
import './styles/tournament.css'

function Tournament() {
    //state
    const [onCreate, setOnCreate] = useState<boolean>(false);
    const [tournamentName, setTournamentName] = useState<string>('');
    const [player, setPlayer] = useState<string>('');
    const [players, setPlayers] = useState<string[]>([]);
    const [tournaments, setTournaments] = useState<{id: number, name: string, players: string[], done: boolean}[]>([]);
    const [nextTournamentId, setNextTournamentId] = useState<number>(1);

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
                    </li>
                ))}
            </ul>

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