import Item from "../models/Item.js";
import Submission from "../models/Submission.js";


// Controller function to fetch items
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items.map(item => item.name)); // Send an array of item names
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
};

// Controller function to add a new item
export const addItem = async (req, res) => {
  const { name } = req.body;

  // Check if item name exists
  if (!name) return res.status(400).json({ message: 'Item name is required' });

  try {
    // Check if item already exists
    const existingItem = await Item.findOne({ name });
    if (existingItem) {
      return res.status(400).json({ message: 'Item already exists' });
    }

    // Create and save new item
    const newItem = new Item({ name });
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item', error });
  }
};


export const submitForm = async (req, res) => {
    const { buyerName,item,qty, amount, paidBy } = req.body;
    console.log(req.body);
    if (!item || !amount || !paidBy) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }
    try {
      // Create a new submission
      const newSubmission = new Submission({ buyerName,item,qty, amount, paidBy });
      await newSubmission.save(); // Save submission to database
  
      res.status(200).json({ message: "Form submitted successfully!", submission: newSubmission });
    } catch (error) {
      console.error("Error submitting the form:", error);
      res.status(500).json({ message: "Failed to submit the form. Please try again." });
    }
  };


export const fetchData =  async (req, res) => {
    try {
      const submissions = await Submission.find();
      //console.log(submissions)
      res.status(200).json(submissions);
      
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ message: 'Server error' });
    }
}