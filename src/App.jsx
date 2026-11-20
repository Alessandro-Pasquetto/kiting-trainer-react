import {useState, useRef} from 'react'

import './App.css'
import Arena from './Arena.jsx'
import Panel from './Panel.jsx'

function App() {

  const arenaRef = useRef(null)

  const [attackRange, setAttackRange] = useState(400)
  const [attackSpeed, setAttackSpeed] = useState(1.5)

  const [currentAttackInterval, setCurrentAttackInterval] = useState(0)
  const [avgAttackInterval, setAvgAttackInterval] = useState(0)

  function resetGame() {
    setCurrentAttackInterval(0)
    setAvgAttackInterval(0)

    arenaRef.current.resetInternalState()
  }

  return (
    <>
      <header>
        <h1>Kiting Trainer</h1>
        <button id="reset" type="button" onClick={resetGame}>Reset</button>
      </header>

      <main className="game-layout">
        <Arena
          ref = {arenaRef}
          attackRange = {attackRange}
          attackSpeed = {attackSpeed}
          setCurrentAttackInterval = {setCurrentAttackInterval}
          setAvgAttackInterval = {setAvgAttackInterval}
        />

        <Panel
          currentAttackInterval = {currentAttackInterval}
          avgAttackInterval = {avgAttackInterval}

          attackRange = {attackRange}
          setAttackRange = {setAttackRange}
          attackSpeed = {attackSpeed}
          setAttackSpeed = {setAttackSpeed}
        />

      </main>
    </>
  )
}

export default App