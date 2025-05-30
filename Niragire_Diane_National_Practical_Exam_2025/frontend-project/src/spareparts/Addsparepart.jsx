import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header'; // Make sure Header is functional if used

function Addsparepart() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        unitprice: '',
        totalprice: '',
        status: ''
    });

    const handleSubmit = (e) => e.preventDefault();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        if (name === 'quantity' || name === 'unitprice') {
            const qty = parseFloat(newFormData.quantity) || 0;
            const price = parseFloat(newFormData.unitprice) || 0;
            newFormData.totalprice = (qty * price).toFixed(2);
        }

        setFormData(newFormData);
    };

    const handleAdd = () => {
        const { name, category, quantity, unitprice, totalprice, status } = formData;
        if (!name || !category || !quantity || !unitprice || !status) {
            alert("All fields are required");
            return;
        }

        axios.post("http://localhost:7392/addsparepart", formData)
            .then(() => {
                alert("Spare Part registered successfully");
                navigate('/sparepart');
            })
            .catch((err) => {
                console.error("Error adding spare part", err);
                alert(err.response?.data?.message || "Failed to add spare part");
            });
    };

    return (
        <div className="h-10 flex flex-col items-center bg-[#f9f9f9] text-gray-800 py-10 px-4">
            <div className="w-full max-w-sm bg-white border border-gray-200 p-5 rounded-md">
                <h2 className="text-lg font-semibold mb-4 text-center">Add Spare Part</h2>
                <form onSubmit={handleSubmit}>
                    {['name', 'category', 'quantity', 'unitprice'].map((field) => (
                        <div key={field}>
                            <label htmlFor={field} className="block text-sm mb-1 capitalize">{field}</label>
                            <input
                                type={field === 'quantity' || field === 'unitprice' ? 'number' : 'text'}
                                name={field}
                                id={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="totalprice" className="block text-sm mb-1">Total Price</label>
                        <input
                            type="number"
                            id="totalprice"
                            name="totalprice"
                            value={formData.totalprice}
                            readOnly
                            className="w-full px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 rounded-sm text-gray-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm mb-1">Status</label>
                        <select
                            name="status"
                            id="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            <option value="">-- Select Status --</option>
                            <option value="Available">Available</option>
                            <option value="Not available">Not available</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="w-full py-2 mt-1 bg-blue-600 text-white text-sm rounded-sm hover:bg-blue-700 transition"
                    >
                        Add Spare Part
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Addsparepart;
