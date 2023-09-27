import { useEffect, useState } from "react";
import "./App.css";

const MAX_ERRORS = 8;

function App() {
  const [wordToGuess, setWordToGuess] = useState("");
  const underscores = "_".repeat(wordToGuess.length);
  // const wordToGuess = "abracadabra";

  const [input, setInput] = useState("");
  const [guessedWord, setGuessedWord] = useState(underscores);
  const [errorsLeft, setErrorsLeft] = useState(MAX_ERRORS);
  const [lettersTried, setLettersTried] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [hasLoose, setHasLoose] = useState(false);

  const changeUnderscores = (e) => {
    e.preventDefault();

    if (hasWon || hasLoose) {
      return;
    }

    const letter = input[0] ?? "";

    if (!letter) {
      return;
    }

    let hasLetter = false;

    setLettersTried((prev) => {
      return [...prev, letter];
    });

    if (lettersTried.includes(letter)) {
      setErrorsLeft((prev) => prev - 1);
      return;
    }

    for (let i = 0; i < wordToGuess.length; i++) {
      if (wordToGuess[i] === letter) {
        hasLetter = true;

        setGuessedWord((prev) => {
          let newWord = prev.split("");
          newWord[i] = letter;
          return newWord.join("");
        });
      }
    }

    if (!hasLetter) {
      setErrorsLeft((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const go = async () => {
      const res = await fetch("https://random-word-api.herokuapp.com/word", {
        signal: controller.signal,
      });
      const data = await res.json();
      const word = data[0];

      setWordToGuess(word);
    };

    go();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setGuessedWord(underscores);
  }, [underscores]);

  useEffect(() => {
    if (errorsLeft <= 0) {
      setHasLoose(true);
    }
  }, [errorsLeft]);

  useEffect(() => {
    if (!wordToGuess || !guessedWord) {
      return;
    }

    if (wordToGuess === guessedWord) {
      setHasWon(true);
    }
  }, [guessedWord, wordToGuess]);

  return (
    <>
      <div id="app">
        {!hasLoose && !hasWon ? (
          <div className="word">
            <span>Essais restants:</span>
            <span>{errorsLeft}</span>
          </div>
        ) : null}

        {hasLoose ? (
          <div className="word">
            <span>Le mot était:</span>
            <span>{wordToGuess}</span>
          </div>
        ) : null}

        <div className="word">
          {guessedWord.split("").map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </div>

        <div className="word">
          <form onSubmit={changeUnderscores}>
            <input value={input} onChange={(e) => setInput(e.target.value)} />
            <button>Validey</button>
          </form>
        </div>

        <div className="word">
          <span>Lettres essayées:</span>
          <span>{lettersTried.join(", ")}</span>
        </div>

        {hasWon ? (
          <span>{"Bravo t'es devin ou quoi ???"}</span>
        ) : hasLoose ? (
          <span>{"Bah non du coup, t'es pas devin du tout (la honte)"}</span>
        ) : null}
      </div>

      <div className="msieur">
        {errorsLeft <= 0 ? <div className="head"></div> : null}
        {errorsLeft <= 1 ? <div className="leftarm"></div> : null}
        {errorsLeft <= 2 ? <div className="rightarm"></div> : null}
        {errorsLeft <= 3 ? <div className="torso"></div> : null}
        {errorsLeft <= 4 ? <div className="leftleg"></div> : null}
        {errorsLeft <= 5 ? <div className="leftfoot"></div> : null}
        {errorsLeft <= 6 ? <div className="rightleg"></div> : null}
        {errorsLeft <= 7 ? <div className="rightfoot"></div> : null}
      </div>
    </>
  );
}

export default App;
