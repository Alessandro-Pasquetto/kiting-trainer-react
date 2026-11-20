import {useState, useRef} from 'react'

import './App.css'
import Arena from './Arena.jsx'
import Panel from './Panel.jsx'

function App() {
  const [attackRange, setAttackRange] = useState(400)
  const [attackSpeed, setAttackSpeed] = useState(3)
  const [moveSpeed, setMoveSpeed] = useState(400)

  const arenaRef = useRef(null)
  const [currentAttackInterval, setCurrentAttackInterval] = useState(0)
  const [avgAttackInterval, setAvgAttackInterval] = useState(0)
  const [attackClickError, setAttackClickError] = useState(0)
  const [avgAttackClickError, setAvgAttackClickError] = useState(0)
  const [attackCount, setAttackCount] = useState(0)

  function resetGame() {
    setCurrentAttackInterval(0)
    setAvgAttackInterval(0)
    setAttackClickError(0)
    setAvgAttackClickError(0)
    setAttackCount(0)

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
          moveSpeed = {moveSpeed}
          setCurrentAttackInterval = {setCurrentAttackInterval}
          setAvgAttackInterval = {setAvgAttackInterval}
          setAttackClickError = {setAttackClickError}
          setAvgAttackClickError = {setAvgAttackClickError}
          attackCount = {attackCount}
          setAttackCount = {setAttackCount}
        />

        <Panel
          currentAttackInterval = {currentAttackInterval}
          avgAttackInterval = {avgAttackInterval}
          attackClickError = {attackClickError}
          avgAttackClickError = {avgAttackClickError}
          attackCount = {attackCount}

          moveSpeed = {moveSpeed}
          setMoveSpeed = {setMoveSpeed}
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