// AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/v1/items/fetchData", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data)
        setItems(response.data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="admin-dashboard">

      <div>
      <h2>Admin Dashboard</h2>
      <Link to="/home">Home</Link>
      </div>
      <table>
        <thead>
          <th>
            Buyer Name
          </th>
          <th>
            Item Name
          </th>
          <th>
            Quantity
          </th>
          <th>
            Amount
          </th>
          <th>Paid By</th>
        </thead>
       <tbody>
       {
        items.map((i)=>{
          console.log(i)
          return <tr key={i._id}>
            <td>{i.buyerName}</td>
            <td>{i.item}</td>
            <td>{i.qty}</td>
            <td>{i.amount}</td>
            <td>{i.paidBy}</td>
          </tr>
        })
       }
       </tbody>
       </table>
    </div>
  );
};

export default AdminDashboard;
