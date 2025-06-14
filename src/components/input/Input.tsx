import React from 'react';
import './Input.css'

interface InputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({ id, label, type = "text", value, onChange, required = false }) => {
    return (
        <div className='input'>
            <label htmlFor={id}>{label}</label>
            <input 
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default Input;
