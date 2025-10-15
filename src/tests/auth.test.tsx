import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '../components/Login';
import { Signup } from '../components/Signup';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: vi.fn().mockResolvedValue({ error: null }),
    signUp: vi.fn().mockResolvedValue({ error: null }),
  }),
}));

describe('Authentication Components', () => {
  describe('Login Component', () => {
    it('should render login form with required fields', () => {
      render(<Login onSwitchToSignup={vi.fn()} onSuccess={vi.fn()} />);
      
      expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email or.*mobile/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('should accept email input', () => {
      render(<Login onSwitchToSignup={vi.fn()} onSuccess={vi.fn()} />);
      
      const input = screen.getByPlaceholderText(/email or.*mobile/i);
      fireEvent.change(input, { target: { value: 'g.mehta1971@gmail.com' } });
      
      expect(input).toHaveValue('g.mehta1971@gmail.com');
    });

    it('should accept mobile number input', () => {
      render(<Login onSwitchToSignup={vi.fn()} onSuccess={vi.fn()} />);
      
      const input = screen.getByPlaceholderText(/email or.*mobile/i);
      fireEvent.change(input, { target: { value: '7877059117' } });
      
      expect(input).toHaveValue('7877059117');
    });

    it('should have a sign up link', () => {
      const onSwitch = vi.fn();
      render(<Login onSwitchToSignup={onSwitch} onSuccess={vi.fn()} />);
      
      const signupButton = screen.getByText(/Sign up/i);
      fireEvent.click(signupButton);
      
      expect(onSwitch).toHaveBeenCalled();
    });
  });

  describe('Signup Component', () => {
    it('should render all required signup fields', () => {
      render(<Signup onSwitchToLogin={vi.fn()} onSuccess={vi.fn()} />);
      
      expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    });

    it('should enforce 10-digit mobile number', () => {
      render(<Signup onSwitchToLogin={vi.fn()} onSuccess={vi.fn()} />);
      
      const mobileInput = screen.getByLabelText(/Mobile Number/i);
      fireEvent.change(mobileInput, { target: { value: '12345678901' } });
      
      expect(mobileInput).toHaveValue('1234567890');
    });

    it('should have a sign in link', () => {
      const onSwitch = vi.fn();
      render(<Signup onSwitchToLogin={onSwitch} onSuccess={vi.fn()} />);
      
      const signinButton = screen.getByText(/Sign in/i);
      fireEvent.click(signinButton);
      
      expect(onSwitch).toHaveBeenCalled();
    });
  });
});
