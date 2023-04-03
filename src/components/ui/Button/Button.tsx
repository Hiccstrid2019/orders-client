import React from 'react';

interface ButtonProps {
    text: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = ({text, onClick}: ButtonProps) => {
    return (
        <button onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
