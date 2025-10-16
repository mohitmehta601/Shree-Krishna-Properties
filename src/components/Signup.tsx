import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus } from 'lucide-react';
import { validatePassword, isMobileNumber, isEmail } from '../lib/utils';

export const Signup = ({ onSwitchToLogin, onSuccess }: any) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', address: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!isMobileNumber(formData.mobile)) newErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (!isEmail(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) newErrors.password = passwordValidation.message;
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      const { error } = await signUp({
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        password: formData.password
      });

      if (error) {
        console.error('Signup error:', error);
        setErrors({ submit: error.message || 'Failed to create account. Please try again.' });
        setLoading(false);
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="flex items-center justify-center mb-6"><div className="bg-blue-600 p-3 rounded-full"><UserPlus className="w-8 h-8 text-white" /></div></div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label><input type="text" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" maxLength={10} /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Address *</label><textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" rows={2} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Password *</label><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label><input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
          {errors.submit && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{errors.submit}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">{loading ? 'Creating account...' : 'Create Account'}</button>
          <div className="text-center text-sm text-gray-600">Already have an account? <button type="button" onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Sign in</button></div>
        </form>
      </div>
    </div>
  );
};
