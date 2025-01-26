import { useState, useEffect } from 'react';
import './App.css';
import Carte from './Carte';

const gameImages = [
  // Liste des images
  { "src": "/Img/anguler.png" },
  { "src": "/Img/c1.png" },
  { "src": "/Img/c++.png" },
  { "src": "/Img/flutter.png" },
  { "src": "/Img/html.png" },
  { "src": "/Img/java.png" },
  { "src": "/Img/js.png" },
  { "src": "/Img/laravel.png" },
  { "src": "/Img/mysql.png" },
  { "src": "/Img/node.png" },
  { "src": "/Img/php.png" },
  { "src": "/Img/python.png" },
  { "src": "/Img/react.png" },
  { "src": "/Img/spring.png" },
  { "src": "/Img/swift.png" },
  { "src": "/Img/typescript.png" },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turn, setTurn] = useState(0);
  const [choice1, setChoice1] = useState(null);
  const [choice2, setChoice2] = useState(null);
  const [gridConfig, setGridConfig] = useState({ rows: 2, columns: 2 });
  const [history, setHistory] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem('gameHistory', JSON.stringify(history));
  }, [history]);

  const mixCards = () => {
    if (turn > 0) {
      setHistory((prevHistory) => [
        ...prevHistory,
        { grid: `${gridConfig.rows}x${gridConfig.columns}`, turns: turn },
      ]);
    }

    const totalCards = gridConfig.rows * gridConfig.columns;
    const selectedImages = gameImages.slice(0, totalCards / 2);
    const mixedCards = [...selectedImages, ...selectedImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
    setCards(mixedCards);
    setTurn(0);
    setGameFinished(false)
  };

  useEffect(() => {
    mixCards(); 
  }, [gridConfig]);

  const handlechoice = (card) => {
    if (choice1) {
      setChoice2(card);
    } else {
      setChoice1(card);
    }
  };

  const resetTurn = () => {
    setChoice1(null);
    setChoice2(null);
    setTurn((prevTurn) => prevTurn + 1);
  };

  useEffect(() => {
    if (choice1 && choice2) {
      if (choice1.src === choice2.src) {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.src === choice1.src ? { ...c, matched: true } : c
          )
        );
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choice1, choice2]);
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setGameFinished(true);
    }
  }, [cards]);

  const updateGrid = (rows, columns) => {
    setGridConfig({ rows, columns });
  };

  return (
    <div style={{ backgroundColor: " #191970", minHeight: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "white" }}>
        <h1>Memory Card</h1>
        <h1>turn : {turn}</h1>
        <div className='btn'>
          <button onClick={() => updateGrid(2, 2)}>2x2</button>
          <button onClick={() => updateGrid(4, 4)}>4x4</button>
          <button onClick={() => updateGrid(4, 8)}>8x4</button>
        </div>
        <button
          onClick={mixCards}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0)",
            color: "white",
            border: "2px solid white",
            fontSize: "20px",
            borderRadius: "10px",
            padding: "10px 30px",
            width: "fit-content",
            cursor: "pointer",
          }}
        >
          New Game
        </button>

        <div
          className="card-grid"
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
            gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
            gap: "10px",
            marginTop: "20px",
          }}
        >
          {cards.map((card) => (
            <Carte
              key={card.id}
              card={card}
              handlechoice={handlechoice}
              flipped={card === choice1 || card === choice2 || card.matched}
            />
          ))}
        </div>
        <div style={{
               position: "absolute",
               top: "10px",
               right: "10px",
               padding: "10px",
   
          }}>
        <h2>Historique des jeux </h2>
        <ul>
          {history.map((game, index) => (
            <li key={index}>
              Grille : {game.grid}, Tours : {game.turns}
            </li>
          ))}
        </ul>
        </div>
      </div>
      {gameFinished && (
        <>
        <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Fond sombre semi-transparent
          zIndex: 1,
        }}
      ></div>
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            color: "black",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 2,
          }}
        >
          <h2>Félicitations !</h2>
          <p>Vous avez terminé le jeu en {turn} tours.</p>
          <button
            onClick={mixCards}
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Rejouer
          </button>
        </div>
        </>
      )}
      
    </div>
  );
}

export default App;
