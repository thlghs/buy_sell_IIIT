
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        newPassword: '',
        contactNumber: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
    
            
            const payload = { 
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                age: formData.age,
                contactNumber: formData.contactNumber,
            };
    
           
            if (formData.newPassword) {
                payload.newPassword = formData.newPassword;
            }
    
            await axios.put('/users/profile', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            setUser({ ...formData, password: formData.newPassword || user.password });
            setIsEditing(false);
            alert("Profile updated successfully!");
    
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="profile-container">
            <h2>Profile Page</h2>
            {isEditing ? (
                <div className="profile-form">
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="form-control"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="form-control"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="form-control"
                        required
                    />
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="New Password"
                        className="form-control"
                    />
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Age"
                        className="form-control"
                        required
                    />
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="Contact Number"
                        className="form-control"
                        required
                    />
                    <button className="btn btn-success" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div className="profile-details">
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Age:</strong> {user.age}</p>
                    <p><strong>Contact Number:</strong> {user.contactNumber}</p>
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
            <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Profile;
