import React, { useState, useEffect } from 'react';
import './CSS/View_Exp.css';

function View_Exp() {
    const [expenses, setExpenses] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [selectedYear, setSelectedYear] = useState('2025');

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = () => {
        const userId = localStorage.getItem('userId');  // Fetch the userId from localStorage
        fetch(`http://localhost:3000/expenses/${userId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${userId}`,  // Send the userId as Authorization header
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setExpenses(data);
                calculateTotal(data);  // Calculate the total after fetching expenses
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const calculateTotal = (data) => {
        const total = data.reduce((acc, expense) => acc + Number(expense.Amount), 0);
        setTotalAmount(total);
    };

    const handleDelete = (expenseId) => {
        const userId = localStorage.getItem('userId');

        fetch(`http://localhost:3000/expenses/${expenseId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${userId}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(() => {
                // Re-fetch the expenses after deletion
                fetchExpenses();
            })
            .catch(error => console.error('Error deleting expense:', error));
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    // Filter expenses by selected month and year
    const filteredExpenses = expenses.filter(expense => {
        const expenseMonth = expense.Month;
        const expenseYear = expense.Year;
        return (
            (selectedMonth ? expenseMonth === selectedMonth : true) &&
            (selectedYear ? expenseYear === selectedYear : true)
        );
    });

    // Recalculate total amount based on the filtered expenses
    useEffect(() => {
        calculateTotal(filteredExpenses);
    }, [filteredExpenses]);  // Re-run total calculation when filteredExpenses changes

    const filterMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentYear = new Date().getFullYear();
    const filterYears = [currentYear+2,currentYear+1,currentYear, currentYear - 1, currentYear - 2];  // Show current and past 2 years for example

    // Helper function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return (
        <div className='main_Container'>
            <div className="expense-list-container">
                <h2>Expenses:</h2>
                <div className="filters">
                    <select value={selectedMonth} onChange={handleMonthChange}>
                        <option value="">Select Month</option>
                        {filterMonths.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                        ))}
                    </select>
                    <select value={selectedYear} onChange={handleYearChange}>
                        <option value="">Select Year</option>
                        {filterYears.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <h3 style={{ cursor: 'pointer', color: 'white' }}>Total Amount: ${totalAmount}</h3>
                <ul className="expense-list">
                    {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense, index) => (
                            <li key={expense._id}>
                                {expense.Description}: <strong>${expense.Amount}</strong> 
                                <br />
                                <small>Date: {formatDate(expense.Date)}</small> {/* Display Date */}
                                <span onClick={() => handleDelete(expense._id)} style={{ cursor: 'pointer', color: 'white' }}> -</span>
                            </li>
                        ))
                    ) : (
                        <li>No expenses found for the selected filters.</li> 
                    )}
                </ul>
            </div>
        </div>
    );
}

export default View_Exp;
