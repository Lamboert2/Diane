import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Updatestockout() {
    const navigate = useNavigate()
      const {id} = useParams()
    const [formData, setformData]= useState({
        name:'',
        stockoutquantity:'',
        stockoutunitprice:'',
        stockouttotalprice:''
    })
    const [stockout, setStockout] = useState([])

 const [spareparts, setSpareparts] = useState([]);

useEffect(() => {
  axios.get('http://localhost:7392/getstockout/' + id)
    .then((result) => {
      const data = result.data;
      setformData({
        name: data.name,
        stockoutquantity: data.stockoutquantity,
        stockoutunitprice: data.stockoutunitprice,
        stockouttotalprice: data.stockouttotalprice
      });
      setStockout(data);
    });

  axios.get('http://localhost:7392/getallspareparts')
    .then(res => {
      setSpareparts(res.data);
    });
}, [id]);
    
    const handleAdd =()=>{
 axios.put('http://localhost:7392/updatestockout/' + id, formData)
    .then((result) => {
      alert("Stock Out updated successfully");
      navigate('/stockout')
    })
    .catch((err) => {
  if (err.response && err.response.data && err.response.data.message) {
    alert(err.response.data.message);
  } else {
    console.log("Error updating stockout", err);
  }
});

    }
    const handleChange = (e)=>{
setformData({...formData, [e.target.name]:e.target.value})
    }
   const handleSubmit = (e) => {
  e.preventDefault();
 
};
  return (
    <>
     <div className='flex flex-col items-center'>
           <form onSubmit={handleSubmit} className='flex gap-1 mt-10 p-2 rounded flex-col w-100 border'>
  <label htmlFor="sparepart">Spare Part</label>
 <select onChange={handleChange} value={formData.name} className='border h-9 rounded pl-2' name="name" id="sparepart">
  <option value="">Select Spare Part</option>
  {spareparts.map((sp, index) => (
    <option key={index} value={sp.name}>{sp.name}</option>
  ))}
</select>


  <label htmlFor="stockoutquantity">StockOut Quantity</label>
  <input onChange={handleChange} value={formData.stockoutquantity} className='border h-9 rounded pl-2' type="number" name="stockoutquantity" id="stockoutquantity" />

  <label htmlFor="stockoutunitprice">StockOut Unit Price</label>
  <input onChange={handleChange} value={formData.stockoutunitprice} className='border h-9 rounded pl-2' type="number" name="stockoutunitprice" id="stockoutunitprice" />

  <label htmlFor="stockouttotalprice">StockOut Total Price</label>
  <input onChange={handleChange} value={formData.stockouttotalprice} className='border h-9 rounded pl-2' type="number" name="stockouttotalprice" id="stockouttotalprice" />

  <button onClick={handleAdd} type="submit" className='bg-black/40 mt-2 h-9 rounded'>Update Stock Out</button>
</form>

            </div>
    </>
  )
}

export default Updatestockout
