import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Addstockout() {
  const navigate = useNavigate()
  const [sparepart, setSparePart] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    stockoutquantity: '',
    stockoutunitprice: '',
    stockouttotalprice: ''
  })

  useEffect(() => {
    axios.get("http://localhost:7392/getsp")
      .then((result) => {
        setSparePart(result.data)
      })
      .catch(() => alert('Failed to load spare parts'))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'stockoutquantity' || name === 'stockoutunitprice') {
        const qty = parseFloat(updated.stockoutquantity)
        const price = parseFloat(updated.stockoutunitprice)
        updated.stockouttotalprice =
          !isNaN(qty) && !isNaN(price) ? (qty * price).toFixed(2) : ''
      }
      return updated
    })
  }

  const handleAdd = () => {
    const { name, stockoutquantity, stockoutunitprice, stockouttotalprice } = formData
    if (!name || !stockoutquantity || !stockoutunitprice || !stockouttotalprice) {
      alert("All fields are required")
      return
    }

    const selectedPart = sparepart.find(sp => sp.name === name)
    if (!selectedPart) {
      alert("Selected spare part not found")
      return
    }

    const availableQty = selectedPart.quantity
    if (availableQty === 0) {
      alert("Quantity is zero")
      return
    }

    if (parseInt(stockoutquantity) > availableQty) {
      alert("Insufficient quantity available")
      return
    }

    axios.post("http://localhost:7392/addstockout", formData)
      .then(() => {
        alert("Stock Out added successfully")
        navigate('/stockout')
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Something went wrong"
        alert(msg)
      })
  }

  return (
    <div className="h-135 bg-gradient-to-b from-blue-100 via-blue-50 to-white flex items-center justify-center px-4 py-12">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white shadow-xl rounded-lg max-w-md w-full p-8"
        noValidate
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center tracking-wide">
          Add Stock Out
        </h2>

        <div>
          <label htmlFor="sparepart" className="block text-gray-700 font-semibold mb-2">
            Spare Part
          </label>
          <select
            id="sparepart"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          >
            <option value="">Select Spare Part</option>
            {sparepart.map(sp => (
              <option key={sp.name} value={sp.name}>
                {sp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="stockoutquantity" className="block text-gray-700 font-semibold mb-2">
            Stock Out Quantity
          </label>
          <input
            type="number"
            id="stockoutquantity"
            name="stockoutquantity"
            value={formData.stockoutquantity}
            min="1"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label htmlFor="stockoutunitprice" className="block text-gray-700 font-semibold mb-2">
            Stock Out Unit Price
          </label>
          <input
            type="number"
            id="stockoutunitprice"
            name="stockoutunitprice"
            value={formData.stockoutunitprice}
            min="0"
            step="0.01"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label htmlFor="stockouttotalprice" className="block text-gray-700 font-semibold mb-2">
            Stock Out Total Price
          </label>
          <input
            type="number"
            id="stockouttotalprice"
            name="stockouttotalprice"
            value={formData.stockouttotalprice}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md shadow-md hover:bg-blue-700 mt-2 transition focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Add Stock Out
        </button>
      </form>
    </div>
  )
}

export default Addstockout
