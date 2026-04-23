import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false, 
  type = 'button', 
  onClick, 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 btn-scale transform hover:scale-105';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] focus:ring-indigo-500 shadow-md',
    secondary: 'bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] focus:ring-white/50 backdrop-blur-sm',
    outline: 'border border-indigo-400 text-indigo-400 hover:bg-indigo-500/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] focus:ring-indigo-500',
    ghost: 'text-indigo-400 hover:bg-white/5 focus:ring-indigo-500',
    danger: 'bg-red-600/80 text-white hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] focus:ring-red-500',
    success: 'bg-green-600/80 text-white hover:bg-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] focus:ring-green-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
