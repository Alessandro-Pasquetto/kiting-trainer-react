import './Panel.css'

function Panel({currentAttackInterval, avgAttackInterval, attackClickError, avgAttackClickError, attackCount, moveSpeed, setMoveSpeed, attackRange, setAttackRange, attackSpeed, setAttackSpeed}) {

  return (
    <aside id="panel">
      <div id="statistics">
        <h2>Statistics</h2>

        <div className="stat">
          <div className="stat-comparison">
            <div>
              <span>Current Attack Speed</span>
              <strong>
                {currentAttackInterval > 0
                  ? (1 / currentAttackInterval).toFixed(2)
                  : '0.00'}
              </strong>
            </div>

            <div>
              <span>Current Attack Interval</span>
              <strong>{currentAttackInterval.toFixed(2)} s</strong>
            </div>
          </div>
        </div>

        <div className="stat">
          <div className="stat-comparison">
            <div>
              <span>Average Attack Speed</span>
              <strong>
                {avgAttackInterval > 0
                  ? (1 / avgAttackInterval).toFixed(2)
                  : '0.00'}
              </strong>
            </div>

            <div>
              <span>Average Attack Interval</span>
              <strong>{avgAttackInterval.toFixed(2)} s</strong>
            </div>
          </div>
        </div>
        
        <div className="stat">
          <span>Attack Click Error</span>
          <strong>{attackClickError.toFixed(2)}</strong>
        </div>

        <div className="stat">
          <span>Average Attack Click Error</span>
          <strong>{avgAttackClickError.toFixed(2)}</strong>
        </div>

        <div className="stat">
          <span>Attack Count</span>
          <strong>{attackCount}</strong>
        </div>
      </div>

      <div className="settings">
        <h2>Settings</h2>

        <div className="stat">
          <span>Move Speed</span>
          <div className="setting-control">
            <button type="button" onClick={() => setMoveSpeed(Math.max(moveSpeed - 20, 100))}> - </button>
            <strong>{moveSpeed}</strong>
            <button type="button" onClick={() => setMoveSpeed(Math.min(moveSpeed + 20, 800))}> + </button>
          </div>
        </div>

        <div className="stat">
          <span>Attack Range</span>
          <div className="setting-control">
            <button type="button" onClick={() => setAttackRange(Math.max(attackRange - 10, 50))}> - </button>
            <strong>{attackRange}</strong>
            <button type="button" onClick={() => setAttackRange(Math.min(attackRange + 10, 800))}> + </button>
          </div>
        </div>

        <div className="stat">
          <div className="setting-control">

            <div className="attack-speed">
              <span>Attack Speed</span>
              <div className="speed-controls">
                <button type="button" onClick={() => setAttackSpeed(Math.max(attackSpeed - 0.1, 0.1))}> - </button>
                <strong>{attackSpeed.toFixed(1)}</strong>
                <button type="button" onClick={() => setAttackSpeed(Math.min(attackSpeed + 0.1, 5))}> + </button>
              </div>
            </div>

            <div className="attack-interval">
              <span>Attack Interval</span>
              <strong>{(1 / attackSpeed).toFixed(2)} s</strong>
            </div>
          </div>
        </div>

      </div>
    </aside>
  )
}

export default Panel