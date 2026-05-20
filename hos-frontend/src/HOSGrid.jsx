const DUTY_COLORS = {
  off_duty: '#ffffff',
  sleeper: '#a0a0a0',
  driving: '#000000',
  on_duty_nd: '#404040'
}

const DUTY_LABELS = {
  off_duty: 'Off Duty',
  sleeper: 'Sleeper Berth', 
  driving: 'Driving',
  on_duty_nd: 'On Duty (Not Driving)'
}

function HOSGrid({ logId, entries }) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getBlockStyle = (duty_type, start, end) => {
    const left = (start / 24) * 100
    const width = ((end - start) / 24) * 100
    return {
      position: 'absolute',
      left: `${left}%`,
      width: `${width}%`,
      height: '100%',
      background: DUTY_COLORS[duty_type],
      border: '1px solid #333'
    }
  }

  return (
    <div style={{ marginTop: '15px' }}>
      <h4 style={{ color: '#1B4F8C' }}>24-Hour HOS Grid</h4>
      
      {/* Hour markers */}
      <div style={{ display: 'flex', marginLeft: '120px', marginBottom: '2px' }}>
        {hours.map(h => (
          <div key={h} style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: '#666' }}>
            {h === 0 ? 'Mid' : h === 12 ? 'Noon' : h}
          </div>
        ))}
      </div>

      {/* Grid rows */}
      {Object.keys(DUTY_LABELS).map(duty => (
        <div key={duty} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '120px', fontSize: '11px', color: '#333', flexShrink: 0 }}>
            {DUTY_LABELS[duty]}
          </div>
          <div style={{ flex: 1, height: '20px', background: '#f0f0f0', position: 'relative', border: '1px solid #999' }}>
            {/* Hour lines */}
            {hours.map(h => (
              <div key={h} style={{
                position: 'absolute',
                left: `${(h / 24) * 100}%`,
                height: '100%',
                width: '1px',
                background: '#ccc'
              }} />
            ))}
            {/* Duty blocks */}
            {entries
              .filter(e => e.duty_type === duty)
              .map((e, i) => (
                <div key={i} style={getBlockStyle(e.duty_type, e.start_hour, e.end_hour)} />
              ))
            }
          </div>
        </div>
      ))}

      {/* Legend */}
      <div style={{ display: 'flex', gap: '15px', marginTop: '8px', flexWrap: 'wrap' }}>
        {Object.entries(DUTY_LABELS).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px' }}>
            <div style={{ width: '15px', height: '15px', background: DUTY_COLORS[key], border: '1px solid #333' }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HOSGrid