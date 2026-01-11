import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../contexts';
import './index.css';

interface ThemedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children: ReactNode;
}

export default function ThemedButton({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  children,
  disabled,
  style,
  ...props
}: ThemedButtonProps) {
  const { themeColors } = useTheme();

  const getButtonStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      fontWeight: '500',
      width: fullWidth ? '100%' : 'auto',
    };

    // Size styles
    const sizeStyles: Record<string, React.CSSProperties> = {
      small: { padding: '6px 12px', fontSize: '13px', borderRadius: '6px' },
      medium: { padding: '10px 20px', fontSize: '14px', borderRadius: '8px' },
      large: { padding: '14px 28px', fontSize: '16px', borderRadius: '26px', height: '52px' },
    };

    // Variant styles
    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: disabled ? '#ccc' : themeColors.primary,
        color: '#fff',
      },
      outline: {
        backgroundColor: 'transparent',
        color: disabled ? '#ccc' : themeColors.primary,
        border: `1px solid ${disabled ? '#ccc' : themeColors.primary}`,
      },
      text: {
        backgroundColor: 'transparent',
        color: disabled ? '#ccc' : themeColors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };
  };

  return (
    <button
      {...props}
      disabled={disabled}
      style={getButtonStyle()}
      className={`themed-button themed-button-${variant}`}
    >
      {children}
    </button>
  );
}
