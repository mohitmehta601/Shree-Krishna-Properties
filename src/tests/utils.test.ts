import { describe, it, expect } from 'vitest';
import { isNumeric, isMobileNumber, isEmail, validatePassword, getPasswordStrength, generateUniqueCode, formatPrice } from '../lib/utils';

describe('Utils - Validation Functions', () => {
  describe('isNumeric', () => {
    it('should return true for numeric strings', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('7877059117')).toBe(true);
    });

    it('should return false for non-numeric strings', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('123abc')).toBe(false);
      expect(isNumeric('')).toBe(false);
    });
  });

  describe('isMobileNumber', () => {
    it('should return true for valid 10-digit mobile numbers', () => {
      expect(isMobileNumber('7877059117')).toBe(true);
      expect(isMobileNumber('9876543210')).toBe(true);
    });

    it('should return false for invalid mobile numbers', () => {
      expect(isMobileNumber('123')).toBe(false);
      expect(isMobileNumber('12345678901')).toBe(false);
      expect(isMobileNumber('abcdefghij')).toBe(false);
    });
  });

  describe('isEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isEmail('g.mehta1971@gmail.com')).toBe(true);
      expect(isEmail('user@example.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isEmail('invalid')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
      expect(isEmail('user@')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept valid passwords', () => {
      const result = validatePassword('Kota2020');
      expect(result.valid).toBe(true);
    });

    it('should reject passwords shorter than 8 characters', () => {
      const result = validatePassword('Kota20');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('8 characters');
    });

    it('should reject passwords without letters', () => {
      const result = validatePassword('12345678');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('letters');
    });

    it('should reject passwords without numbers', () => {
      const result = validatePassword('Password');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('numbers');
    });
  });

  describe('getPasswordStrength', () => {
    it('should return weak for short passwords', () => {
      expect(getPasswordStrength('pass1')).toBe('weak');
    });

    it('should return medium for decent passwords', () => {
      expect(getPasswordStrength('Password1')).toBe('medium');
    });

    it('should return strong for complex passwords', () => {
      expect(getPasswordStrength('Password123!')).toBe('strong');
    });
  });

  describe('generateUniqueCode', () => {
    it('should generate a unique code with SKP prefix', () => {
      const code = generateUniqueCode();
      expect(code).toMatch(/^SKP-\d{8}-\d{4}$/);
    });

    it('should generate different codes on successive calls', () => {
      const code1 = generateUniqueCode();
      const code2 = generateUniqueCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe('formatPrice', () => {
    it('should format prices in Indian currency format', () => {
      expect(formatPrice(1000000)).toContain('10,00,000');
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toContain('0');
    });
  });
});
