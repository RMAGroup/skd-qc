import React from 'react';
import { LucideIcon } from 'lucide-react';

type ButtonType = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'small' | 'normal' | 'large';

interface BaseButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
}

interface ButtonAsButton extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  href?: never;
}

interface ButtonAsLink extends BaseButtonProps, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button: React.FC<ButtonProps> = ({ 
  type = 'primary', 
  size = 'normal', 
  icon: Icon,
  children,
  className = '',
  href,
  ...props 
}) => {
  const baseStyles = 'font-semibold transition-all duration-200 flex items-center gap-2 justify-center rounded-lg';
  
  const typeStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-white border-2 border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 hover:shadow-md',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-600',
  };
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-xs',
    normal: 'px-4 py-2 text-sm',
    large: 'px-8 py-4 text-xl',
  };
  
  const iconSizes = {
    small: 16,
    normal: 16,
    large: 20,
  };

  const combinedClassName = `${baseStyles} ${typeStyles[type]} ${sizeStyles[size]} ${className}`;
  const iconElement = Icon && <Icon size={iconSizes[size]} />;

  if (href) {
    return (
      <a 
        href={href}
        className={combinedClassName}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {iconElement}
        {children}
      </a>
    );
  }

  return (
    <button 
      className={combinedClassName}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {iconElement}
      {children}
    </button>
  );
};

export default Button;