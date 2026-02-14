"use client";
import React from "react";
import Magnetic from "./Magnetic";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "default" | "nav";
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean; // 1. Added the disabled prop here
}

export default function Button({ 
  children, 
  type = "button", 
  className = "", 
  variant = "default",
  icon,
  onClick,
  disabled = false // 2. Default to false
}: ButtonProps) {
  
  const variantStyles = {
    default: "px-6 py-2 md:text-xl rounded-full tracking-tighter uppercase font-syne font-black",
    nav: "px-3 md:px-5 h-7 text-xs md:text-lg rounded-3xl font-medium hover:rounded-lg"
  };

  return (
    <Magnetic>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled} // 3. Pass it to the actual HTML button
        className={`group relative bg-lime-400 text-zinc-950 transition-all duration-300 ease-in-out pointer-events-auto 
            flex items-center justify-center font-syne 
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
            ${variantStyles[variant]} ${className}`}
      >
        <span className="relative z-10">{children}</span>
        
        {icon && (
          <div className="flex items-center w-0 h-6 opacity-0 group-hover:w-8 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            {icon}
          </div>
        )}
      </button>
    </Magnetic>
  );
}