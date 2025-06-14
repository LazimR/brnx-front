import React from 'react';

interface ButtonProps {
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type = "button", children, onClick }) => {
    return (
        <button 
            type={type}
            onClick={onClick}
            style={{ 
                padding: '10px 20px',
                backgroundColor: '#007BFF',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
        >
            {children}
        </button>
    );
};

export default Button;
