import {useState, useEffect, useRef, useImperativeHandle, forwardRef} from 'react'

import './Arena.css'

const Arena = forwardRef(function Arena(
    {attackRange, attackSpeed, moveSpeed, setCurrentAttackInterval, setAvgAttackInterval, setAttackClickError, setAvgAttackClickError, attackCount, setAttackCount},
    ref
  ){

  const playerRef = useRef(null)
  const enemyRef = useRef(null)
  const [playerPosition, setPlayerPosition] = useState({x: 25, y: 66})

  const [moveMarker, setMoveMarker] = useState(null)
  const [attackMarker, setAttackMarker] = useState(null)
  const [moveMarkerOpacity, setMoveMarkerOpacity] = useState(0)
  const [attackMarkerOpacity, setAttackMarkerOpacity] = useState(0)

  const [showAttackRange, setShowAttackRange] = useState(false)
  const [isAttackReady, setIsAttackReady] = useState(true)
  const [lastAttackTime, setLastAttackTime] = useState(null)
  const [firstAttackTime, setFirstAttackTime] = useState(null)
  const attackTimeout = useRef(null)
  const [sumAttackError, setSumAttackError] = useState(0)

  const animationRef = useRef(null)

  function handleRightClick(event) {
    event.preventDefault()
    setShowAttackRange(false)

    const rect = event.currentTarget.getBoundingClientRect()

    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    movePlayer(x, y, rect)

    setMoveMarker({x, y})
    setMoveMarkerOpacity(1)
    setTimeout(() => {
      setMoveMarkerOpacity(0)
    }, 1)
  }

  function movePlayer(targetX, targetY, arenaRect) {
    if (animationRef.current !== null)
      cancelAnimationFrame(animationRef.current)

    const playerRect = playerRef.current.getBoundingClientRect()

    const startX = playerRect.left + playerRect.width / 2 - arenaRect.left
    const startY = playerRect.top + playerRect.height / 2 - arenaRect.top

    const endX = targetX / 100 * arenaRect.width
    const endY = targetY / 100 * arenaRect.height

    const dx = endX - startX
    const dy = endY - startY

    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance === 0) return

    const duration = distance / moveSpeed * 1000
    let startTime = null

    function animate(timestamp) {
      if (startTime === null) {
        startTime = timestamp
      }

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      const currentX = startX + dx * progress
      const currentY = startY + dy * progress

      setPlayerPosition({
          x: currentX / arenaRect.width * 100,
          y: currentY / arenaRect.height * 100
      })

      if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
      } else {
          animationRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  function handleLeftClick(event) {
    if (!showAttackRange) return

    setShowAttackRange(false)

    const rect = event.currentTarget.getBoundingClientRect()

    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    const enemyBounds = enemyRef.current.getBoundingClientRect()
    const enemyX = enemyBounds.left + enemyBounds.width / 2
    const enemyY = enemyBounds.top + enemyBounds.height / 2

    const dx = event.clientX - enemyX
    const dy = event.clientY - enemyY

    let clickError = -1

    setAttackMarker({x, y})

    setAttackMarkerOpacity(1)
    setTimeout(() => {
      setAttackMarkerOpacity(0)
    }, 1)
    
    if (isEnemyInRange()) {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }

      if(isAttackReady){
        clickError = Math.sqrt(dx * dx + dy * dy)
        let tmpSumAttackErrr = sumAttackError + clickError
        setSumAttackError(tmpSumAttackErrr)
        setAvgAttackClickError(tmpSumAttackErrr / (attackCount + 1))
        attack()
      }
    }

    setAttackClickError(clickError)
  }

  function isEnemyInRange() {
    const playerBounds = playerRef.current.getBoundingClientRect()
    const enemyBounds = enemyRef.current.getBoundingClientRect()

    const playerX = playerBounds.left + playerBounds.width / 2
    const playerY = playerBounds.top + playerBounds.height / 2

    const enemyX = enemyBounds.left + enemyBounds.width / 2
    const enemyY = enemyBounds.top + enemyBounds.height / 2

    const dx = enemyX - playerX
    const dy = enemyY - playerY

    const distance = Math.sqrt(dx * dx + dy * dy)

    return distance <= attackRange
  }

  function attack() {
    const currentTime = Date.now()

    if (firstAttackTime === null) {
      setFirstAttackTime(currentTime)
    }
    else {
      const currentAttackInterval = (currentTime - lastAttackTime) / 1000
      const avgAttackInterval = (currentTime - firstAttackTime) / 1000 / attackCount

      setCurrentAttackInterval(currentAttackInterval)
      setAvgAttackInterval(avgAttackInterval)
    }

    setLastAttackTime(currentTime)
    setAttackCount(attackCount + 1)

    setIsAttackReady(false)

    attackTimeout.current = setTimeout(() => {
      setIsAttackReady(true)
    }, 1000 / attackSpeed)
  }

  function resetInternalState() {
    clearTimeout(attackTimeout.current)
    attackTimeout.current = null

    setFirstAttackTime(null)
    setLastAttackTime(null)
    setIsAttackReady(true)
    setSumAttackError(0)
  }

  useImperativeHandle(ref, () => ({
      resetInternalState
  }))

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key.toLowerCase() === 'a') {
        setShowAttackRange(true)
      }

      if (event.key.toLowerCase() === 's') {
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div id="arena"
      onMouseDown={(event) => {
         if (event.button === 2) {
             handleRightClick(event)
         }
         else if (event.button === 0) {
             handleLeftClick(event)
         }
      }}
      onContextMenu={(event) => event.preventDefault()}
    >

      <div id="enemy" ref={enemyRef}></div>

      <div
        id="player"
        ref={playerRef}
        style={{
          left: `${playerPosition.x}%`,
          top: `${playerPosition.y}%`
        }}
      >
        <div
          className="head"
          style={{
            backgroundColor: isAttackReady ? 'red' : '#ffd3a1'
          }}
        ></div>
        <div className="body"></div>
        <div className="leg left"></div>
        <div className="leg right"></div>
      </div>

      <div
        id="attackRangeCircle" 
        style={{
          '--attack-range-size': `${attackRange * 2}px`,
          display: showAttackRange ? 'block' : 'none',
          left: `${playerPosition.x}%`,
          top: `${playerPosition.y}%`
        }}
      ></div>

      {moveMarker && (
        <div
          id="moveMarker"
          className="marker"
          style={{
            left: `${moveMarker.x}%`,
            top: `${moveMarker.y}%`,
            transition: moveMarkerOpacity === 0 ? 'opacity 0.5s ease' : 'none',
            opacity: moveMarkerOpacity
          }}
        ></div>
      )}

      {attackMarker && (
        <div
          id="attackMarker"
          className="marker"
          style={{
            left: `${attackMarker.x}%`,
            top: `${attackMarker.y}%`,
            transition: attackMarkerOpacity === 0 ? 'opacity 0.5s ease' : 'none',
            opacity: attackMarkerOpacity
          }}
        ></div>
      )}

    </div>
  )
})

export default Arena