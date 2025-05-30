import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function SpareParts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:7392/getallspareparts")
      .then((result) => {
        setData(result.data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Spare Parts Inventory</h1>
          <Link to="/addsparepart">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Add Spare Part
            </button>
          </Link>
        </div>

        <div className="bg-white border rounded shadow overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">No.</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Unit Price</th>
                <th className="px-4 py-3 text-left">Total Price</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">No spare parts found.</td>
                </tr>
              ) : (
                data.map((part, index) => (
                  <tr key={part.id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{part.name}</td>
                    <td className="px-4 py-2">{part.category}</td>
                    <td className="px-4 py-2">{part.quantity}</td>
                    <td className="px-4 py-2">{part.unitprice}</td>
                    <td className="px-4 py-2">{part.totalprice}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        part.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {part.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SpareParts;
