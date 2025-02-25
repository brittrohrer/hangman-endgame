import { useState } from 'react'
import {languages} from './languages.js'
import {clsx} from 'clsx'

export default function App() {

  // State Values
  const [currentWord, setCurrentWord] = useState("react")
  const [guessedLetters, setGuessedLetters] = useState([])

  //Derived Values
  const wrongGuessCount = 
    guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = 
    currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length
  const isGameOver = isGameWon || isGameLost

  //Static Values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters => 
      prevLetters.includes(letter) ?
        prevLetters:
        [...prevLetters, letter])
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

  
  const letterElements = currentWord.split("").map((letter, index) => (
        <span key={index}>
          {guessedLetters.includes(letter) ? letter.toUpperCase() : ""}
        </span>
      ))

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
        className ={className}
        onClick={() => addGuessedLetter(letter)}
        >{letter.toUpperCase()}
      </button>
    )
  })

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost
  })

  function renderGameStatus() {
    if(!isGameOver) {
      return null
    }
    if (isGameWon) {
      return (
        <>
          <h2>You Win</h2>
          <p>Well Done</p>
        </>
      )
    } else {
      return (
        <>
          <h2>Game Over</h2>
          <p>You lose!</p>
        </>
      )
    }
  }

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, ex!</p>
      </header>
      <section className={gameStatusClass}>
        {renderGameStatus()}

      </section>
      <section className="language-chips">
          {languageElements}
      </section>
      <section className="word">
          {letterElements}
      </section>
      <section className="keyboard">
          {keyboardElements}
      </section>
        {isGameOver && <button className="new-game">New Game</button>}
    </main>
  )
}
