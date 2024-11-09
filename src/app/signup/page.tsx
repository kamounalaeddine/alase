"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormData {
  firstName: string;
  lastName: string;
  cin: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  email: string;
  phoneNumber: string;
  cin: string;
}

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    cin: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Errors>({
    email: '',
    phoneNumber: '',
    cin: ''
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\d{8}$/;
    return phoneRegex.test(phone);
  };

  const validateCIN = (cin: string): boolean => {
    const cinRegex = /^\d{8}$/;
    return cinRegex.test(cin);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'email' || name === 'phoneNumber' || name === 'cin') {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasErrors = false;
    
    if (!validateCIN(formData.cin)) {
      setErrors(prev => ({
        ...prev,
        cin: 'Please enter a valid 8-digit CIN'
      }));
      hasErrors = true;
    }

    if (!validateEmail(formData.email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
      hasErrors = true;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: 'Please enter a valid 8-digit phone number'
      }));
      hasErrors = true;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          cin: formData.cin,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error creating user');
      }

      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        cin: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
      });

      alert('Signup successful!');
      router.push('/login');
      
    } catch (error: any) {
      alert(error.message || 'An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-black mb-1">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 bg-gray-50 hover:bg-white text-black"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-black mb-1">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 bg-gray-50 hover:bg-white text-black"
              required
            />
          </div>

          {/* CIN */}
          <div>
            <label htmlFor="cin" className="block text-sm font-semibold text-black mb-1">CIN</label>
            <input
              type="text"
              id="cin"
              name="cin"
              value={formData.cin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 bg-gray-50 hover:bg-white text-black"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-black mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 bg-gray-50 hover:bg-white text-black"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-black mb-1">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 bg-gray-50 hover:bg-white text-black"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-black mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 bg-gray-50 hover:bg-white text-black"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-black mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 bg-gray-50 hover:bg-white text-black"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 transform hover:scale-[0.99]"
          >
            Sign Up
          </button>

          <div className="text-center mt-4">
            <span className="text-sm text-black">Already have an account? </span>
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}