import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../api/useAuth";


type LoginFormValues = {
  username: string;
  password: string;
};


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState<LoginFormValues>({
    username: "",
    password: "",
  });

  const { login, loading, error } = useLogin();
  
  const handleChange =
    (k: keyof LoginFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.currentTarget.value;

      setValues((s) => ({ ...s, [k]: v }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({
      username: values.username,
      password: values.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-4 py-12">
      <div className="w-full max-w-md bg-white/90 backdrop-blur border border-indigo-100 shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
          Đăng nhập
        </h1>

        {/* ✅ dùng state error ở đây */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5" autoComplete="on">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2 text-sm outline-none transition"
              value={values.username}
              onChange={handleChange("username")}
              name="username"
              placeholder="Tên đăng nhập của bạn"
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2 pr-10 text-sm outline-none transition"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                name="password"
                placeholder="Mật khẩu của bạn"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                  {showPassword ? (
                    <i className="fa-solid fa-eye-slash text-gray-500 text-lg" />
                  ) : (
                    <i className="fa-solid fa-eye text-gray-500 text-lg" />
                  )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {/* ✅ dùng state loading ở đây */}
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-8">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Hoặc</span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
        </div>

        <div className="text-center text-sm text-gray-600">
            Bạn chưa có tài khoản?{" "}
                <Link
                    to="/register"
                    className="text-indigo-600 font-medium hover:text-indigo-700 transition"
                >
                    Đăng ký
                </Link>
        </div>
      </div>
    </div>
  );
}
