// src/components/RegistrationForm.jsx
import React, { useState } from 'react';
import { registerUser } from '../firebase'; // Import only what you need

const RegistrationForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // State for error messages

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        setError(null); // Reset error state before each submission
        try {
            await registerUser(email, password); // Call the registerUser function
            setEmail(''); // Clear the email field
            setPassword(''); // Clear the password field
        } catch (err) {
            setError(err.message); // Capture and display the error message
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xs p-4 bg-white rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Register</h2>
            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
            <div className="mb-4">
                <label className="block text-gray-700">Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-gray-300 p-2 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-gray-300 p-2 rounded"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Register</button>
        </form>
    );
};

export default RegistrationForm;
