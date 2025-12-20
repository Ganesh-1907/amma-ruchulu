import React from 'react';
import TestEmail from './TestEmail';

const AdminDashboard = () => {
    return (
        <div className="container mt-4">
            <h2>Admin Dashboard</h2>
            
            {/* Test Email Section */}
            <TestEmail />

            {/* ... rest of your existing dashboard components ... */}
        </div>
    );
};

export default AdminDashboard; 