'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export default function TestPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.push('/login');
      return;
    }
    try {
      const parsedUser = JSON.parse(userData);
      console.log('Retrieved user data:', parsedUser);

      if (!parsedUser.phoneNumber) {
        parsedUser.phoneNumber = '';
        console.log('Setting default phone number');
      }

      setUser(parsedUser);
      setEditedUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleUpdate = async () => {
    if (!editedUser || !user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      alert('Profile updated successfully!');
      localStorage.removeItem('userData');
      router.push('/login');
    } catch (error) {
      alert('Failed to update profile: ' + error);
    }
  };

  const handleDelete = async () => {
    if (!user || !confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      localStorage.removeItem('userData');
      alert('Account deleted successfully');
      router.push('/login');
    } catch (error) {
      alert('Failed to delete account: ' + error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center text-black mb-6">
          Profile Page
        </h1>

        {isEditing ? (
          // Edit Form
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">First Name</label>
              <input
                type="text"
                value={editedUser?.firstName || ''}
                onChange={(e) => setEditedUser({ ...editedUser!, firstName: e.target.value })}
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Last Name</label>
              <input
                type="text"
                value={editedUser?.lastName || ''}
                onChange={(e) => setEditedUser({ ...editedUser!, lastName: e.target.value })}
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Email</label>
              <input
                type="email"
                value={editedUser?.email || ''}
                onChange={(e) => setEditedUser({ ...editedUser!, email: e.target.value })}
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Phone Number</label>
              <input
                type="tel"
                value={editedUser?.phoneNumber || ''}
                onChange={(e) => setEditedUser({ ...editedUser!, phoneNumber: e.target.value })}
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Password</label>
              <input
                type="text"
                value={editedUser?.password || ''}
                onChange={(e) => setEditedUser({ ...editedUser!, password: e.target.value })}
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Display Profile
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">First Name</label>
              <p className="px-4 py-2 bg-gray-50 rounded text-black">{user.firstName}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Last Name</label>
              <p className="px-4 py-2 bg-gray-50 rounded text-black">{user.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Email</label>
              <p className="px-4 py-2 bg-gray-50 rounded text-black">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Phone Number</label>
              <p className="px-4 py-2 bg-gray-50 rounded text-black">{user.phoneNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Password</label>
              <p className="px-4 py-2 bg-gray-50 rounded text-black">{user.password}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}