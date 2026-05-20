import HOSGrid from './HOSGrid'
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [logs, setLogs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [activeDutyLog, setActiveDutyLog] = useState(null)
  const [dutyForm, setDutyForm] = useState({})
  const [formData, setFormData] = useState({
    driver_name: '',
    log_date: '',
    miles_driven_today: '',
    carrier_name: '',
    office_address: '',
    truck_number: '',
    shipping_doc: '',
    driver_remarks: ''
  })

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/logs/')
      const data = await res.json()
      setLogs(data)
    } catch (err) {
      console.log('Error fetching logs', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch('http://127.0.0.1:8000/api/logs/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      fetchLogs()
      setShowForm(false)
    } catch (err) {
      console.log('Error saving log', err)
    }
  }

  const addDutyEntry = async (logId, dutyData) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/logs/${logId}/add_duty_entry/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dutyData)
      })
      fetchLogs()
      setActiveDutyLog(null)
      setDutyForm({})
    } catch (err) {
      console.log('Error adding duty entry', err)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#1B4F8C', textAlign: 'center' }}>HOS Driver Log System</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Hours of Service Tracking — FMCSA Compliant</p>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#1B4F8C', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : '+ New Driver Log'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>New Driver Log</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input placeholder="Driver Name" required
              onChange={e => setFormData({...formData, driver_name: e.target.value})}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="date" required
              onChange={e => setFormData({...formData, log_date: e.target.value})}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input placeholder="Miles Driven Today" type="number"
              onChange={e => setFormData({...formData, miles_driven_today: e.target.value})}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input placeholder="Carrier Name"
              onChange={e => setFormData({...formData, carrier_name: e.target.value})}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input placeholder="Office Address"
              onChange={e => setFormData({...formData, office_address: e.target.value})}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input placeholder="Truck Number"
              onChange={e => setFormData({...formData, truck_number: e.target.value})}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input placeholder="Shipping Doc Number"
              onChange={e => setFormData({...formData, shipping_doc: e.target.value})}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <textarea placeholder="Remarks"
              onChange={e => setFormData({...formData, driver_remarks: e.target.value})}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <button type="submit"
            style={{ marginTop: '10px', background: '#1A7A4A', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Save Log
          </button>
        </form>
      )}

      <h2>Driver Logs</h2>
      {logs.length === 0 ? (
        <p>No logs yet — create your first log!</p>
      ) : (
        logs.map(log => (
          <div key={log.id} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
            <h3 style={{ color: '#1B4F8C', margin: 0 }}>{log.driver_name}</h3>
            <p>Date: {log.log_date} | Miles: {log.miles_driven_today} | Truck: {log.truck_number}</p>
            <p>Carrier: {log.carrier_name} | Office: {log.office_address}</p>
            {log.driver_remarks && <p>Remarks: {log.driver_remarks}</p>}

            <button
              onClick={() => setActiveDutyLog(activeDutyLog === log.id ? null : log.id)}
              style={{ background: '#E67E22', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
              + Add Duty Entry
            </button>

            {activeDutyLog === log.id && (
              <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '6px', marginTop: '8px' }}>
                <select
                  onChange={e => setDutyForm({...dutyForm, duty_type: e.target.value})}
                  style={{ padding: '6px', marginRight: '8px', borderRadius: '4px' }}>
                  <option value="">Select Duty Type</option>
                  <option value="off_duty">Off Duty</option>
                  <option value="sleeper">Sleeper Berth</option>
                  <option value="driving">Driving</option>
                  <option value="on_duty_nd">On Duty (Not Driving)</option>
                </select>
                <input type="number" placeholder="Start Hour (0-24)" min="0" max="24"
                  onChange={e => setDutyForm({...dutyForm, start_hour: e.target.value})}
                  style={{ padding: '6px', width: '150px', marginRight: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="number" placeholder="End Hour (0-24)" min="0" max="24"
                  onChange={e => setDutyForm({...dutyForm, end_hour: e.target.value})}
                  style={{ padding: '6px', width: '150px', marginRight: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input placeholder="Location"
                  onChange={e => setDutyForm({...dutyForm, location_name: e.target.value})}
                  style={{ padding: '6px', width: '150px', marginRight: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <button
                  onClick={() => addDutyEntry(log.id, dutyForm)}
                  style={{ background: '#1A7A4A', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Save Entry
                </button>
              </div>
            )}

            <HOSGrid logId={log.id} entries={log.duty_entries || []} />
          </div>
        ))
      )}
    </div>
  )
}

export default App