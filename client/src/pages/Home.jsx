// Home.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const buyerList = ["Ansh", "Deep", "Vikas"];
  const paidBy = ["Sagar", "Ansh", "Deep", "Vikas", "Ankita", "Uncle"];
  const url = "http://localhost:3000";
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [buyerName, setBuyerName] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [newItem, setNewItem] = useState("");
  const [amount, setAmount] = useState("");
  const [qty, setQty] = useState("");
  const [paidByValue, setPaidByValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    const fetchItems = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/items`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = Array.isArray(response.data) ? response.data : [];
        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
        setFilteredItems([]);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    setFilteredItems(
      items.filter((item) =>
        item.toLowerCase().includes(itemInput.toLowerCase())
      )
    );
  }, [itemInput, items]);

  const handleItemChange = (e) => {
    setItemInput(e.target.value);
    setShowDropdown(true);
  };

  const handleSelectItem = (item) => {
    setItemInput(item);
    setShowDropdown(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const handleAddNewItem = async () => {
    if (newItem && !items.includes(newItem)) {
      try {
        const response = await axios.post(`${url}/api/v1/items`, { name: newItem });
        if (response.status === 201) {
          const updatedItemName = response.data.item.name;
          setItems((prevItems) => [...prevItems, updatedItemName]);
          setFilteredItems((prevItems) => [...prevItems, updatedItemName]);
          setNewItem("");
        }
      } catch (error) {
        console.error("Error adding new item:", error);
        alert("Failed to add the item. It might already exist or there was an error with the server.");
      }
    }
  };

  const handleSubmit = async () => {
    if (buyerName && itemInput && qty && amount && paidByValue) {
      try {
        const response = await axios.post(`${url}/api/v1/items/submit`, {
          buyerName,
          item: itemInput,
          qty: parseFloat(qty),
          amount: parseFloat(amount),
          paidBy: paidByValue,
        },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure you send the token
          },});
        if (response.status === 200) {
          alert(response.data.message);
          setQty("");
          setBuyerName("");
          setItemInput("");
          setAmount("");
          setPaidByValue("");
          setShowDropdown(false);
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
        alert("Failed to submit the form. Please try again.");
      }
    } else {
      alert("Please fill all the required fields.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="login-container">
         {role && role.toLowerCase() === "admin" && (
        <button onClick={() => navigate("/admin-dashboard")}>
          Go to Admin Dashboard
        </button>
      )}
      <button onClick={handleLogout}>Logout</button>
      <div>
        <label htmlFor="buyerName">Select Your Name</label>
        <select
          id="buyerName"
          name="buyerName"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
        >
          <option value="">Select buyer</option>
          {buyerList.map((buyer, index) => (
            <option value={buyer} key={index}>
              {buyer}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="item">Item Name</label>
        <div ref={dropdownRef}>
          <input
            type="text"
            id="item"
            value={itemInput}
            onChange={handleItemChange}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search or select an item"
          />
          {showDropdown && filteredItems.length > 0 && (
            <div className="dropdown-list">
              <ul>
                {filteredItems.map((item, index) => (
                  <li key={index} onClick={() => handleSelectItem(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Add new item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAddNewItem}
          disabled={!newItem || items.includes(newItem)}
        >
          Add Item
        </button>
      </div>
      <div>
        <label htmlFor="qty">Enter the quantity</label>
        <input
          type="number"
          id="qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="amount">Enter the amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="paidBy">Paid By</label>
        <select
          id="paidBy"
          name="paidBy"
          value={paidByValue}
          onChange={(e) => setPaidByValue(e.target.value)}
        >
          <option value="">Select Paid By</option>
          {paidBy.map((person, index) => (
            <option value={person} key={index}>
              {person}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmit}>Submit</button>
 
    </div>
  );
};

export default Home;
