import { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);

  // Fungsi validasi email yang lebih kompleks
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Fungsi validasi password
  const validatePassword = (password) => {
    // Minimal 8 karakter, setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi email
    if (!validateEmail(formData.email)) {
      setError('Silakan masukkan email yang valid');
      setLoading(false);
      return;
    }

    // Validasi password
    if (!validatePassword(formData.password)) {
      setError('Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, angka, dan karakter khusus');
      setLoading(false);
      return;
    }

    // Validasi captcha
    if (!captchaToken) {
      setError('Harap selesaikan verifikasi captcha');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          captchaToken
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal masuk');
      }

      // Simpan token autentikasi dengan aman menggunakan HttpOnly cookie
      // Atau implementasikan sesuai backend Anda
      document.cookie = `authToken=${data.token}; HttpOnly; Secure; SameSite=Strict`;
      
      // Redirect atau perbarui state aplikasi
      console.log('Berhasil masuk');
      // Contoh redirect: window.location.href = '/dashboard';
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Masuk</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
              placeholder="contoh@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
              placeholder="Minimal 8 karakter"
            />
          </div>

          <ReCAPTCHA
          // TODO Replace with actual API call
            sitekey="GANTI_DENGAN_RECAPTCHA_SITE_KEY"
            onChange={(token) => setCaptchaToken(token)}
          />
          
          <button 
            type="submit" 
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <div className="mt-4 text-center space-y-2">
            <a href="/lupa-password" className="text-blue-500 hover:underline block">
              Lupa Kata Sandi?
            </a>
            <a href="/daftar" className="text-green-500 hover:underline block">
              Buat Akun Baru
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignIn;