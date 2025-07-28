// src/components/Inputs/Input.jsx
import React from "react";

const Input = ({ label, name, value, onChange, type = "text", placeholder }) => {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 font-semibold">{label}</label>}
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
  );
};

export default Input;
