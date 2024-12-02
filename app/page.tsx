// app/form.tsx
'use client';

import React, { useState } from 'react';

// Define the types for the form fields
interface Field {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[]; // For dropdowns
}

interface FormData {
  [key: string]: string | number;
}


type FormType = 'userInformation' | 'addressInformation' | 'paymentInformation';

const Form = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormData>({});
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>('');


  const apiResponses: Record<FormType, Field[]> = {
    userInformation: [
      { name: 'firstName', type: 'text', label: 'First Name', required: true },
      { name: 'lastName', type: 'text', label: 'Last Name', required: true },
      { name: 'age', type: 'number', label: 'Age', required: false },
    ],
    addressInformation: [
      { name: 'street', type: 'text', label: 'Street', required: true },
      { name: 'city', type: 'text', label: 'City', required: true },
      { name: 'state', type: 'dropdown', label: 'State', required: true, options: ['California', 'Texas', 'New York'] },
      { name: 'zipCode', type: 'text', label: 'Zip Code', required: false },
    ],
    paymentInformation: [
      { name: 'cardNumber', type: 'text', label: 'Card Number', required: true },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date', required: true },
      { name: 'cvv', type: 'password', label: 'CVV', required: true },
      { name: 'cardholderName', type: 'text', label: 'Cardholder Name', required: true },
    ],
  };

  
  const handleFormTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formType = e.target.value as FormType;  // Type assertion
    setMessage('');
    setProgress(0);

    if (formType && apiResponses[formType]) {
      setFields(apiResponses[formType]);
      setFormData({});
      setErrors({});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    validateField(e.target.name, e.target.value);
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    const field = fields.find((field) => field.name === name);
    if (field && field.required && !value) {
      newErrors[name] = `${field.label} is required`;
    } else {
      delete newErrors[name];
    }

    setErrors(newErrors);
    updateProgress(newErrors);
  };

  const updateProgress = (newErrors: FormData) => {
    const requiredFields = fields.filter((field) => field.required).length;
    const completedFields = Object.keys(formData).filter((key) => !newErrors[key]).length;
    setProgress((completedFields / requiredFields) * 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        isValid = false;
        setErrors((prev) => ({
          ...prev,
          [field.name]: `${field.label} is required`,
        }));
      }
    });

    if (isValid) {
      setMessage('Form submitted successfully!');
      setFormData({});
      setErrors({});
    } else {
      setMessage('Please fill out all required fields.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Dynamic Form</h2>

      {/* Dropdown to choose form type */}
      <div className="mb-4">
        <label htmlFor="formType" className="block text-lg">Select Form Type</label>
        <select id="formType" className="p-2 mt-2 w-full border rounded" onChange={handleFormTypeChange}>
          <option value="">-- Select --</option>
          <option value="userInformation">User Information</option>
          <option value="addressInformation">Address Information</option>
          <option value="paymentInformation">Payment Information</option>
        </select>
      </div>

      {/* Form */}
      {fields.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label htmlFor={field.name} className="block text-sm font-semibold">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'dropdown' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  className="p-2 mt-2 w-full border rounded"
                >
                  <option value="">-- Select --</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  className="p-2 mt-2 w-full border rounded"
                />
              )}
              {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
            </div>
          ))}
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      )}

      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-300 rounded-full">
          <div
            style={{ width: `${progress}%` }}
            className="bg-green-500 h-2 rounded-full"
          ></div>
        </div>
        <p className="text-sm text-center mt-2">{Math.round(progress)}% completed</p>
      </div>

      {message && <p className="mt-4 text-center text-lg">{message}</p>}
    </div>
  );
};

export default Form;
