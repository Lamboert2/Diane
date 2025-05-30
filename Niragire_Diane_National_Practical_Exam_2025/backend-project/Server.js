const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const port = 7392
const app = express()
app.use(cors())
app.use(express.json())

app.listen(port, () => {
    console.log("Server is running on http://localhost:" + port)
})

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'sims'
})
db.connect((err)=>{
    if(err){
        console.log("Error connecting to mysql database")
    }
    else{
        console.log("Connected to mysql database")
    }
})
//

app.get("/", (req, res)=>{
    res.json("WELCOME TO BACKEND")
})

//MEMBERS ROUTES
app.post("/createmember", (req, res) => {
    const {username} = req.body
    const usernamecheck = "SELECT * FROM user WHERE username = ?";
    db.query(usernamecheck, [username], (err, result) => {
        if (err) {
            console.log("Failed to add this member", err)
        }
        else {
            if (result.length > 0) {
                res.send({ message: "Username Alredy Taken" })
            }
            else {
                const {username, password} = req.body
                const sql = "INSERT INTO user (username, password) VALUES(?,?)";
                db.query(sql, [username,password], (err, result) => {
                    if (err) {
                        console.log("Failed to register this user", err)
                        res.status(500).send(err)
                    }
                    else {
                        res.send(result)
                    }
                })
            }
        }
    })
}
)

//LOGIN route

app.post('/login', (req, res) => {
    const { username, password } = req.body
    const sql = "SELECT * FROM user WHERE username=? AND password=?";
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.log("Failed to login")
        }
        else {
            if (result.length > 0) {
                res.send({ message: "Logged in successfully" })
            }
            else {
                res.send({ message: "Incorrect Username or password" })
            }
        }
    })
})


app.post('/forgot-password', (req, res) => {
    const { username } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

    const sql = "SELECT * FROM user WHERE username = ?";
    db.query(sql, [username], (err, result) => {
        if (err) {
            console.log("Error finding user", err);
            return res.status(500).send({ message: "Server error" });
        }

        if (result.length === 0) {
            return res.status(200).send({ message: "Username not found" }); // Avoid leaking usernames
        }

        const updateCodeSql = "UPDATE user SET reset_code = ? WHERE username = ?";
        db.query(updateCodeSql, [code, username], (err) => {
            if (err) {
                console.log("Error setting reset code", err);
                return res.status(500).send({ message: "Failed to generate reset code" });
            }

            // Simulate sending the code (you could use nodemailer/SMS here)
            console.log(`Reset code for ${username} is ${code}`);
            res.send({ message: "Reset code sent to your registered method (simulated)", code }); // Send `code` only for testing
        });
    });
});

app.post('/verify-reset-code', (req, res) => {
    const { username, resetCode } = req.body;  // match React request body
    const sql = "SELECT * FROM user WHERE username = ? AND reset_code = ?";
    db.query(sql, [username, resetCode], (err, result) => {
        if (err) {
            console.log("Error verifying code", err);
            return res.status(500).send({ message: "Server error" });
        }

        if (result.length === 0) {
            return res.status(400).send({ message: "Invalid reset code" });
        }

        res.send({ success: true, message: "Code verified" });
    });
});


app.post('/reset-password', (req, res) => {
    const { username, newPassword, resetCode } = req.body;
    const sql = "UPDATE user SET password = ?, reset_code = NULL WHERE username = ? AND reset_code = ?";
    db.query(sql, [newPassword, username, resetCode], (err, result) => {
        if (err) {
            console.log("Error resetting password", err);
            return res.status(500).send({ message: "Failed to reset password" });
        }
        if (result.affectedRows === 0) {
            return res.status(400).send({ message: "Invalid reset code or username" });
        }
        res.send({ success: true, message: "Password reset successful" });
    });
});



//Spare parts Routes

app.post('/addsparepart', (req, res) => {
    const { name, category, quantity, unitprice, totalprice, status } = req.body;

    // Step 1: Check if the name already exists
    const checkSql = "SELECT * FROM sparepart WHERE name = ?";
    db.query(checkSql, [name], (err, result) => {
        if (err) {
            console.log("Error checking spare part name", err);
            return res.status(500).send({ message: "Internal server error" });
        }

        if (result.length > 0) {
            // Name already exists
            return res.status(400).send({ message: "Spare part name already exists" });
        }

        // Step 2: Insert if name is unique
        const insertSql = "INSERT INTO sparepart(name, category, quantity, unitprice, totalprice, status) VALUES(?,?,?,?,?,?)";
        db.query(insertSql, [name, category, quantity, unitprice, totalprice, status], (err, insertResult) => {
            if (err) {
                console.log("Error adding a spare part", err);
                return res.status(500).send({ message: "Failed to add spare part" });
            }

            res.send({ message: "Spare part added successfully", data: insertResult });
        });
    });
});

//get all spare parts
app.get("/getallspareparts", (req, res)=>{
    const sql = "SELECT * FROM sparepart";
    db.query(sql, (err,result)=>{
      if(err){
        console.log("Error getting all spare parts", err)
      }
      else{
        res.send(result)
      }
    })
})
//get all spare parts with not available status
app.get("/getsp", (req, res)=>{
    const sql = "SELECT * FROM sparepart WHERE status = 'Not available'";
    db.query(sql, (err,result)=>{
      if(err){
        console.log("Error getting all spare parts", err)
      }
      else{
        res.send(result)
      }
    })
})

//get all spare parts with  available status
app.get("/getasp", (req, res)=>{
    const sql = "SELECT * FROM sparepart WHERE status = 'Available'";
    db.query(sql, (err,result)=>{
      if(err){
        console.log("Error getting all spare parts", err)
      }
      else{
        res.send(result)
      }
    })
})

//add stock in
app.post('/addstockin', (req, res) => {
    const { sparepart, stockinquantity } = req.body;

    // Insert stockin record
    const insertSql = "INSERT INTO stockin (name, stockinquantity) VALUES (?, ?)";
    db.query(insertSql, [sparepart, stockinquantity], (err, insertResult) => {
        if (err) {
            console.log("Error adding stockin", err);
            return res.status(500).send({ message: "Failed to add stockin" });
        }

        // Update sparepart quantity by adding stockinquantity
        const updateSparepartQty = "UPDATE sparepart SET quantity = quantity + ? WHERE name = ?";
        db.query(updateSparepartQty, [stockinquantity, sparepart], (err2, updateResult) => {
            if (err2) {
                console.log("Error updating sparepart quantity", err2);
                return res.status(500).send({ message: "Failed to update sparepart quantity" });
            }

            res.send({ message: "Stockin added and quantity updated successfully" });
        });
    });
});

//get stockin
app.get('/getstockin', (req, res)=>{
    const sql = "SELECT sp.name, si.stockinquantity AS quantity, si.stockindate FROM sparepart sp JOIN stockin si ON sp.name = si.name WHERE sp.status = 'Available'";
    db.query(sql, (err, result)=>{
        if(err){
            console.log("Error getting spare parts", err)
        }
        else{
            res.send(result)
        }
    })
})
//add stockout
app.post('/addstockout', (req, res) => {
  const { name, stockoutquantity, stockoutunitprice, stockouttotalprice } = req.body;

  // Step 1: Check current quantity
  const checkQuantitySql = 'SELECT quantity FROM sparepart WHERE name = ?';
  db.query(checkQuantitySql, [name], (err, result) => {
    if (err) {
      console.error('Error fetching spare part quantity:', err);
      return res.status(500).send({ message: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(404).send({ message: 'Spare part not found' });
    }

    const availableQuantity = result[0].quantity;
    if (stockoutquantity > availableQuantity) {
      return res.status(400).send({ message: 'Insufficient quantity available' });
    }

    // Step 2: Insert into stockout
    const insertStockoutSql = 'INSERT INTO stockout(name, stockoutquantity, stockoutunitprice, stockouttotalprice) VALUES (?, ?, ?, ?)';
    db.query(insertStockoutSql, [name, stockoutquantity, stockoutunitprice, stockouttotalprice], (err, result) => {
      if (err) {
        console.error('Error inserting stockout record:', err);
        return res.status(500).send({ message: 'Internal server error' });
      }

      // Step 3: Update sparepart quantity
      const updateQuantitySql = 'UPDATE sparepart SET quantity = quantity - ? WHERE name = ?';
      db.query(updateQuantitySql, [stockoutquantity, name], (err, result) => {
        if (err) {
          console.error('Error updating spare part quantity:', err);
          return res.status(500).send({ message: 'Internal server error' });
        }

        res.send({ message: 'Stock-out recorded and quantity updated successfully' });
      });
    });
  });
});

//get all stockout
app.get('/getallstockout', (req, res)=>{
    const sql = "SELECT * FROM stockout"
      db.query(sql, (err, result)=>{
        if(err){
            console.log("Failed to fetch all stock outs", err)
        }
        else{
            res.send(result)
        }
      })
})
//GET STOCK OUT BY ID
app.get('/getstockout/:id', (req, res)=>{
    const {id} = req.params
    const sql = "SELECT * FROM stockout WHERE id=?"
    db.query(sql, [id], (err, result)=>{
        if(err){
            console.log('Error getting this stockout', err)
        }
        else{
            res.send(result[0])
        }
    })
})



//delete stockout
app.delete("/delete/:id", (req, res)=>{
    const {id} = req.params
    const sql = "DELETE FROM stockout WHERE id=?";
    db.query(sql, [id], (err, result)=>{
        if(err){
            console.log("Error deleting stockout", err)
        }
        else{
            res.send(result)
        }
    })
})

app.put("/updatestockout/:id", (req, res) => {
  const { id } = req.params;
  const { name, stockoutquantity, stockoutunitprice, stockouttotalprice } = req.body;

  const getOldStockoutSql = "SELECT stockoutquantity FROM stockout WHERE id = ?";
  db.query(getOldStockoutSql, [id], (err, stockoutResult) => {
    if (err || stockoutResult.length === 0) {
      console.error("Failed to get existing stockout", err);
      return res.status(500).send({ message: "Error fetching old stockout" });
    }

    const oldStockoutQty = stockoutResult[0].stockoutquantity;

    // Restore old quantity
    const restoreSql = "UPDATE sparepart SET quantity = quantity + ? WHERE name = ?";
    db.query(restoreSql, [oldStockoutQty, name], (err, restoreResult) => {
      if (err) {
        console.error("Error restoring old quantity", err);
        return res.status(500).send({ message: "Error restoring quantity" });
      }

      // Check available quantity
      const checkQtySql = "SELECT quantity FROM sparepart WHERE name = ?";
      db.query(checkQtySql, [name], (err, qtyResult) => {
        if (err || qtyResult.length === 0) {
          console.error("Error checking available quantity", err);
          return res.status(500).send({ message: "Error checking quantity" });
        }

        const availableQty = qtyResult[0].quantity;

        if (stockoutquantity > availableQty) {
          // Roll back restoration
          db.query("UPDATE sparepart SET quantity = quantity - ? WHERE name = ?", [oldStockoutQty, name]);
          return res.status(400).send({ message: "Insufficient quantity after update" });
        }

        // Update stockout
        const updateStockoutSql = "UPDATE stockout SET name = ?, stockoutquantity = ?, stockoutunitprice = ?, stockouttotalprice = ? WHERE id = ?";
        db.query(updateStockoutSql, [name, stockoutquantity, stockoutunitprice, stockouttotalprice, id], (err, updateResult) => {
          if (err) {
            console.error("Error updating stockout", err);
            return res.status(500).send({ message: "Error updating stockout" });
          }

          // Deduct new quantity
          db.query("UPDATE sparepart SET quantity = quantity - ? WHERE name = ?", [stockoutquantity, name], (err, deductResult) => {
            if (err) {
              console.error("Error deducting new quantity", err);
              return res.status(500).send({ message: "Error deducting quantity" });
            }

            res.send({ message: "Stock Out updated and quantity adjusted" });
          });
        });
      });
    });
  });
});
