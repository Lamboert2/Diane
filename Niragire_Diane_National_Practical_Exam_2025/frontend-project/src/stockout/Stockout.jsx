import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Stockout() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchStockouts()
  }, [])

  const fetchStockouts = () => {
    axios.get("http://localhost:7392/getallstockout")
      .then((result) => setData(result.data))
      .catch(err => console.error('Failed to fetch stockouts:', err))
  }

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return

    axios.delete(`http://localhost:7392/delete/${id}`)
      .then(() => fetchStockouts())
      .catch(() => alert('Failed to delete record'))
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 font-sans text-gray-800">
      <h1 className="text-center text-3xl font-bold mb-8 text-indigo-600">
        Stock Out Management
      </h1>

      <div className="mb-6 flex justify-end">
        <Link to='/addstockout'>
          <button className="bg-indigo-600 hover:bg-indigo-700 transition px-6 py-2 rounded text-white font-semibold shadow-md">
            + Add Stock Out
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-indigo-300 rounded shadow-sm">
          <thead className="bg-indigo-100 text-indigo-900">
            <tr>
              <th className="border border-indigo-300 p-3 text-left w-12">No.</th>
              <th className="border border-indigo-300 p-3 text-left">Spare Part</th>
              <th className="border border-indigo-300 p-3 text-right">Quantity</th>
              <th className="border border-indigo-300 p-3 text-right">Unit Price</th>
              <th className="border border-indigo-300 p-3 text-right">Total Price</th>
              <th className="border border-indigo-300 p-3 text-left">Date</th>
              <th className="border border-indigo-300 p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-indigo-400 italic">
                  No stock out records found.
                </td>
              </tr>
            ) : (
              data.map((stockout, index) => (
                <tr
                  key={stockout.id}
                  className={index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}
                >
                  <td className="border border-indigo-300 p-3">{index + 1}</td>
                  <td className="border border-indigo-300 p-3 font-semibold text-indigo-700">{stockout.name}</td>
                  <td className="border border-indigo-300 p-3 text-right">{stockout.stockoutquantity}</td>
                  <td className="border border-indigo-300 p-3 text-right">{stockout.stockoutunitprice}</td>
                  <td className="border border-indigo-300 p-3 text-right">{stockout.stockouttotalprice}</td>
                  <td className="border border-indigo-300 p-3">{new Date(stockout.stockoutdate).toLocaleDateString()}</td>
                  <td className="border border-indigo-300 p-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleDelete(stockout.id)}
                      className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-1 rounded shadow"
                    >
                      Delete
                    </button>
                    <Link to={`/update/${stockout.id}`}>
                      <button className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-1 rounded shadow">
                        Edit
                      </button>
                    </Link>
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

export default Stockout
