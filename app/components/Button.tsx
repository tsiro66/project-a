"use client";
import React from "react";
import Magnetic from "./Magnetic";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "default" | "nav"; // Added variants
  icon?: React.ReactNode;      // Added icon support
  onClick?: () => void;
}

export default function Button({ 
  children, 
  type = "button", 
  className = "", 
  variant = "default",
  icon,
  onClick 
}: ButtonProps) {
  
  // Define base styles for different variants
  const variantStyles = {
    default: "px-6 py-2 text-lg md:text-2xl rounded-full tracking-tighter uppercase font-bold",
    nav: "px-3 md:px-5 h-7 text-xs md:text-lg rounded-3xl font-medium hover:rounded-lg"
  };

  return (
    <Magnetic>
      <button
        type={type}
        onClick={onClick}
        className={`group relative overflow-hidden bg-lime-400 text-zinc-950 transition-all duration-300 ease-in-out pointer-events-auto 
            cursor-pointer flex items-center justify-center font-syne ${variantStyles[variant]} ${className}`}
      >
        <span className="relative z-10">{children}</span>
        
        {/* Render icon with the specific hover logic you had */}
        {icon && (
          <div className="flex items-center w-0 h-6 opacity-0 group-hover:w-8 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            {icon}
          </div>
        )}
      </button>
    </Magnetic>
  );
}