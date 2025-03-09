import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Login from './Routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


//Mongo DB connection Code 
mongoose.connect('mongodb://localhost:27017/PersonalManager')
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.log('Not Connected To DB', err);
    });

const userSchema = new mongoose.Schema({
    Description: { type: String, required: true },
    Amount: { type: Number, required: true },
    UserId: { type: String, required: true },
    Month: { type: String, required: true },  // Store the month as a string (e.g., "January")
    Year: { type: String, required: true },   // Store the year as a string (e.g., "2025")
    Date: { type: Date, default: Date.now }   // Store the date when the expense was added
});
const User = mongoose.model('Expenses', userSchema);
// mongo




app.post('/Add', async (req, res) => {
    try {
       
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

app.get('/expenses/:userid', async (req, res) => {

    const { userid } = req.params;
  
    try {
        const expenses = await User.find({ UserId:userid}); // Fetch expenses from DB
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

app.delete('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedExpense = await User.findByIdAndDelete(id);
        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});
app.use('/api', Login); // Use the imported route




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});





  // Ensure the correct file extension

 // Allows parsing JSON in requests


