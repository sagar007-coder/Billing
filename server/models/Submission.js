import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    buyerName:{
        type: String,
    required: true,
    },
  item: {
    type: String,
    required: true,
  },
  qty:{
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0)
  },
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
