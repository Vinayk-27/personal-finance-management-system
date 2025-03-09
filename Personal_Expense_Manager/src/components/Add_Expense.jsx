import React, { useState } from 'react';
import './CSS/Add_Expense.css'; // Import CSS
import { useNavigate } from 'react-router-dom';

function AddExpense() {
    const userId = localStorage.getItem('userId');
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentDate = new Date().toISOString().split("T")[0]; // Get today's date
    const currentYear = new Date().getFullYear().toString(); // Get current year
    const currentMonth = monthNames[new Date().getMonth()]; // Get month name

    const [user, setUser] = useState({
        Description: "",
        Amount: "",
        UserId: userId,
        Month: currentMonth, // Store month name instead of number
        Year: currentYear, 
        Date: currentDate, // Default date is today
    });

    const navigate = useNavigate();

    // Function to handle date change and automatically update month & year
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const selectedYear = new Date(selectedDate).getFullYear().toString();
        const selectedMonth = monthNames[new Date(selectedDate).getMonth()]; // Convert to month name

        setUser((prev) => ({
            ...prev,
            Date: selectedDate,
            Month: selectedMonth,
            Year: selectedYear,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/Add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...user,
                    Amount: parseFloat(user.Amount), // Ensure Amount is a number
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add expense');
            }

            setUser({
                Description: "",
                Amount: "",
                UserId: localStorage.getItem("userId"),
                Month: monthNames[new Date().getMonth()], // Reset to current month (as name)
                Year: new Date().getFullYear().toString(),
                Date: new Date().toISOString().split("T")[0],
            });

        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    return (
        <div className="expense-wrapper">
            {/* Add Expense Form */}
            <div className="expense-form-container">
                <h2>Add Expense</h2>
                <form onSubmit={handleSubmit} className="expense-form">
                    <input 
                        type='text' 
                        value={user.Description} 
                        placeholder='Enter Details' 
                        onChange={(e) => setUser({ ...user, Description: e.target.value })} 
                        required
                    />
                    <input 
                        type='number' 
                        value={user.Amount} 
                        placeholder='Enter Amount' 
                        onChange={(e) => setUser({ ...user, Amount: e.target.value })} 
                        required
                    />
                    
                    {/* Date Picker - Updates Month & Year automatically */}
                    <input 
                        type="date" 
                        value={user.Date} 
                        onChange={handleDateChange} 
                        required
                    />

                    {/* Month Display (Auto-updated as name) */}
                    <input 
                        type="text"
                        value={user.Month}
                        readOnly
                        disabled
                    />

                    {/* Year Display (Auto-updated) */}
                    <input 
                        type="text"
                        value={user.Year}
                        readOnly
                        disabled
                    />

                    <div className="buttons">
                        <button type="submit" id='button1'>Add Expense</button>  
                        <button id='button1' type="button" onClick={() => navigate('/view-expense')}>View Expense</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddExpense;
