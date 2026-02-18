import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, CreditCard, Save, Key, Check, Loader, AlertCircle } from 'lucide-react';
import authService from '../services/authService';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        driving_license_number: '',
        user_type: ''
    });
    
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });
    
    const [profileErrors, setProfileErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [initialLoad, setInitialLoad] = useState(true);
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await authService.getUserProfile();
                
                if (response.status) {
                    setUserData(response.data.user);
                }
            } catch (error) {
                setMessage({
                    type: 'error',
                    text: error.message || 'Failed to load profile data'
                });
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };
        
        fetchUserData();
    }, []);
    
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
        
        // Clear error when user types
        if (profileErrors[name]) {
            setProfileErrors({
                ...profileErrors,
                [name]: ''
            });
        }
        
        // Clear any success/error message
        if (message.text) {
            setMessage({ type: '', text: '' });
        }
    };
    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
        
        // Clear error when user types
        if (passwordErrors[name]) {
            setPasswordErrors({
                ...passwordErrors,
                [name]: ''
            });
        }
        
        // Clear any success/error message
        if (message.text) {
            setMessage({ type: '', text: '' });
        }
    };
    
    const validateProfileForm = () => {
        const newErrors = {};
        
        if (!userData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (userData.phone_number && !/^\d{10,15}$/.test(userData.phone_number.replace(/\D/g, ''))) {
            newErrors.phone_number = 'Phone number must be 10-15 digits';
        }
        
        setProfileErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const validatePasswordForm = () => {
        const newErrors = {};
        
        if (!passwordData.current_password) {
            newErrors.current_password = 'Current password is required';
        }
        
        if (!passwordData.password) {
            newErrors.password = 'New password is required';
        } else if (passwordData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        if (passwordData.password !== passwordData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
        }
        
        setPasswordErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateProfileForm()) {
            return;
        }
        
        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            const profileData = {
                name: userData.name,
                phone_number: userData.phone_number,
                address: userData.address,
                driving_license_number: userData.driving_license_number
            };
            
            const response = await authService.updateUserProfile(profileData);
            
            if (response.status) {
                setUserData(response.data.user);
                setMessage({
                    type: 'success',
                    text: 'Profile updated successfully'
                });
            } else {
                setMessage({
                    type: 'error',
                    text: response.message || 'Failed to update profile'
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePasswordForm()) {
            return;
        }
        
        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            const response = await authService.changePassword(passwordData);
            
            if (response.status) {
                setPasswordData({
                    current_password: '',
                    password: '',
                    password_confirmation: ''
                });
                
                setMessage({
                    type: 'success',
                    text: 'Password changed successfully'
                });
            } else {
                setMessage({
                    type: 'error',
                    text: response.message || 'Failed to change password'
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to change password'
            });
        } finally {
            setLoading(false);
        }
    };
    
    if (initialLoad) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="border-b border-gray-200">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your account settings and preferences
                        </p>
                    </div>
                    
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`px-6 py-3 text-sm font-medium ${
                                activeTab === 'profile'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile Information
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium ${
                                activeTab === 'password'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('password')}
                        >
                            Change Password
                        </button>
                    </div>
                </div>
                
                {message.text && (
                    <div className={`p-4 ${
                        message.type === 'success' 
                            ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
                            : 'bg-red-50 border-l-4 border-red-500 text-red-700'
                    }`}>
                        <div className="flex items-center">
                            {message.type === 'success' ? (
                                <Check className="h-5 w-5 mr-2" />
                            ) : (
                                <AlertCircle className="h-5 w-5 mr-2" />
                            )}
                            <p className="text-sm">{message.text}</p>
                        </div>
                    </div>
                )}
                
                <div className="p-6">
                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileSubmit}>
                            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={userData.name}
                                            onChange={handleProfileChange}
                                            className={`block w-full pl-10 pr-3 py-2 rounded-md ${
                                                profileErrors.name
                                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            } sm:text-sm`}
                                        />
                                        {profileErrors.name && (
                                            <p className="mt-1 text-sm text-red-600">{profileErrors.name}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={userData.email}
                                            disabled
                                            className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 sm:text-sm cursor-not-allowed"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {userData.user_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="phone_number"
                                            id="phone_number"
                                            value={userData.phone_number}
                                            onChange={handleProfileChange}
                                            className={`block w-full pl-10 pr-3 py-2 rounded-md ${
                                                profileErrors.phone_number
                                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            } sm:text-sm`}
                                        />
                                        {profileErrors.phone_number && (
                                            <p className="mt-1 text-sm text-red-600">{profileErrors.phone_number}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="sm:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="address"
                                            id="address"
                                            value={userData.address}
                                            onChange={handleProfileChange}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div className="sm:col-span-2">
                                    <label htmlFor="driving_license_number" className="block text-sm font-medium text-gray-700">
                                        Driving License Number
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CreditCard className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="driving_license_number"
                                            id="driving_license_number"
                                            value={userData.driving_license_number}
                                            onChange={handleProfileChange}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader className="animate-spin h-5 w-5 mr-2" />
                                    ) : (
                                        <Save className="h-5 w-5 mr-2" />
                                    )}
                                    {loading ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    )}
                    
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                                        Current Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            name="current_password"
                                            id="current_password"
                                            value={passwordData.current_password}
                                            onChange={handlePasswordChange}
                                            className={`block w-full pl-10 pr-3 py-2 rounded-md ${
                                                passwordErrors.current_password
                                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            } sm:text-sm`}
                                            placeholder="••••••••"
                                        />
                                        {passwordErrors.current_password && (
                                            <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            value={passwordData.password}
                                            onChange={handlePasswordChange}
                                            className={`block w-full pl-10 pr-3 py-2 rounded-md ${
                                                passwordErrors.password
                                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            } sm:text-sm`}
                                            placeholder="••••••••"
                                        />
                                        {passwordErrors.password && (
                                            <p className="mt-1 text-sm text-red-600">{passwordErrors.password}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                        Confirm New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            name="password_confirmation"
                                            id="password_confirmation"
                                            value={passwordData.password_confirmation}
                                            onChange={handlePasswordChange}
                                            className={`block w-full pl-10 pr-3 py-2 rounded-md ${
                                                passwordErrors.password_confirmation
                                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            } sm:text-sm`}
                                            placeholder="••••••••"
                                        />
                                        {passwordErrors.password_confirmation && (
                                            <p className="mt-1 text-sm text-red-600">{passwordErrors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader className="animate-spin h-5 w-5 mr-2" />
                                    ) : (
                                        <Key className="h-5 w-5 mr-2" />
                                    )}
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile; 