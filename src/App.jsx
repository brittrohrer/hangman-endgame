import { useState } from 'react'
import {languages} from './languages.js'
import {clsx} from 'clsx'
import { getFarewellText, getRandomWord } from './utils.js'

export default function App() {

  // State Values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])

  //Derived Values
  const numGuessesLeft = languages.length - 1
  const wrongGuessCount = 
    guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = 
    currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[numGuessesLeft]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)


  //Static Values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters => 
      prevLetters.includes(letter) ?
        prevLetters:
        [...prevLetters, letter])
  }


  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }
  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount 
    const styles = {
        backgroundColor: lang.backgroundColor,
        color: lang.color
      }
      return (
        <span 
          className={`chip ${isLanguageLost ? "lost" : ""}`} 
          style={styles}
          key={lang.name}
          >
            {lang.name}
        </span>
      )
    }
  )

  
  const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx(
          isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
        <span key={index} className={letterClassName}>
          {shouldRevealLetter ? letter.toUpperCase() : ""}
        </span>
      )
  })

  const keyboardElements = alphabet.split("").map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })
    return (
      <button 
        key={letter}
        className={className}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
        onClick={() => addGuessedLetter(letter)}
        >{letter.toUpperCase()}
      </button>
    )
  })

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function renderGameStatus() {
    if(!isGameOver && isLastGuessIncorrect) {
      return (
        <p 
          className="farewell-message">
            {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      )
    }
    if (isGameWon) {
      return (
        <>
          <h2>You Win</h2>
          <p>Well Done</p>
        </>
      )
    } 
    if (isGameLost) {
      return (
        <>
          <h2>Game Over</h2>
          <p>You lose!</p>
        </>
      )
    }
    return null
  }

  return (
    <main>

      <header>
        <h1>Assembly: Endgame</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, ex!</p>
      </header>

      <section 
        aria-live="polite"
        role="status"
        className={gameStatusClass}>
        {renderGameStatus()}
      </section>

      <section className="language-chips">
          {languageElements}
      </section>

      <section className="word">
          {letterElements}
      </section>

      <section 
        className="sr-only"
        aria-live="polite" 
        role="status">
          <p>
            {currentWord.includes(lastGuessedLetter) ?
              `Correct! The letter ${lastGuessedLetter} is in the word` :
              `Sorry, the letter ${lastGuessedLetter} is not in the word`
            }
            You have {numGuessesLeft} attempts left.
          </p>
          <p>Current word: {currentWord.split("").map(letter =>
            guessedLetters.includes(letter) ? letter + "." : "blank.")
            .join(" ")}
          </p>
      </section>

      <section className="keyboard">
          {keyboardElements}
      </section>

        {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
    
    </main>
  )
}
