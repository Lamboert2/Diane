import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Addstockin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    sparepart: '',
    stockinquantity: '',
  })

  const [spareParts, setSpareParts] = useState([])

  useEffect(() => {
    axios.get('http://localhost:7392/getasp')
      .then((result) => setSpareParts(result.data))
      .catch(err => console.error(err))
  }, [])

  const handleAdd = () => {
    const { sparepart, stockinquantity } = formData
    if (!sparepart || !stockinquantity) {
      alert('All fields are required')
      return
    }
    // Optionally, add numeric validation for quantity
    if (isNaN(stockinquantity) || Number(stockinquantity) <= 0) {
      alert('Quantity must be a positive number')
      return
    }
    
    axios.post('http://localhost:7392/addstockin', formData)
      .then(() => {
        alert('Stock in Added')
        navigate('/stockin')
      })
      .catch(() => alert('Failed to add stock in'))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleAdd()
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '40px auto',
        padding: '20px',
        background: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Add Stock In</h2>
      <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <label htmlFor="sparepart" style={{ fontWeight: '600' }}>Spare Part</label>
        <select
          id="sparepart"
          name="sparepart"
          value={formData.sparepart}
          onChange={handleChange}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            outline: 'none',
          }}
          required
        >
          <option value="">Select Spare Part</option>
          {spareParts.map((part) => (
            <option key={part.name} value={part.name}>
              {part.name}
            </option>
          ))}
        </select>

        <label htmlFor="stockinquantity" style={{ fontWeight: '600' }}>Stock In Quantity</label>
        <input
          id="stockinquantity"
          name="stockinquantity"
          type="number"
          min="1"
          value={formData.stockinquantity}
          onChange={handleChange}
          placeholder="Enter quantity"
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            outline: 'none',
          }}
          required
        />

        <button
          type="submit"
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '12px',
            fontWeight: '600',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2980b9')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3498db')}
        >
          Add Stock In
        </button>
      </form>
    </div>
  )
}

export default Addstockin
