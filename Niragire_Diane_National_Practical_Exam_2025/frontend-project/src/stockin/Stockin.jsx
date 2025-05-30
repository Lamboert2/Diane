import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Stockin() {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get("http://localhost:7392/getstockin")
      .then((result) => {
        setData(result.data)
      })
  }, [])

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', color: '#333', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50', fontWeight: '700' }}>
        Stock In Management
      </h1>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <Link to="/addstockin">
          <button
            style={{
              padding: '12px 28px',
              cursor: 'pointer',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2980b9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3498db'}
          >
            + Add Stock In
          </button>
        </Link>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #ddd' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f7f9fc' }}>
              <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'center', color: '#34495e' }}>#</th>
              <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', color: '#34495e' }}>Spare Part</th>
              <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'right', color: '#34495e' }}>Quantity</th>
              <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'center', color: '#34495e' }}>Stock In Date</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                  No Stock In Records
                </td>
              </tr>
            ) : (
              data.map((stockin, index) => (
                <tr
                  key={stockin.id}
                  style={{
                    borderBottom: '1px solid #eee',
                    transition: 'background-color 0.2s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ecf0f1')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ padding: '12px 15px' }}>{stockin.name}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'right' }}>{stockin.quantity}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    {new Date(stockin.stockindate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Stockin
