// src/pages/auth/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

type RegisterFormValues = {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
};

export default function RegisterPage() {
  const [values, setValues] = useState<RegisterFormValues>({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange =
    (k: keyof RegisterFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v =
        k === "agree"
          ? e.currentTarget.checked
          : e.currentTarget.value;

      setValues((s) => ({ ...s, [k]: v }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validate đơn giản trước khi gọi API
    if (!values.username.trim()) {
      setError("Vui lòng nhập tên đăng nhập");
      return;
    }
    if (!values.fullName.trim()) {
      setError("Vui lòng nhập họ tên");
      return;
    }
    if (!values.email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    if (!values.phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }
    // kiểm tra số điện thoại cơ bản: 9-11 chữ số
    if (!/^\d{9,11}$/.test(values.phone)) {
      setError("Số điện thoại không hợp lệ (9-11 chữ số)");
      return;
    }
    if (values.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (values.password !== values.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!values.agree) {
      setError("Bạn cần đồng ý với điều khoản sử dụng");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // TODO: gọi API register ở đây, map field `phone` -> `phone_number` nếu backend yêu cầu
      // const payload = { username: values.username, full_name: values.fullName, email: values.email, phone_number: values.phone, password: values.password, password_confirm: values.confirmPassword }
      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-4 py-12">
      <div className="w-full max-w-md bg-white/90 backdrop-blur border border-indigo-100 shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
          Đăng ký
        </h1>

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
              Họ và tên
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2 text-sm outline-none transition"
              value={values.fullName}
              onChange={handleChange("fullName")}
              name="fullName"
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2 text-sm outline-none transition"
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              name="email"
              placeholder="email@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2 text-sm outline-none transition"
              inputMode="numeric"
              pattern="\\d*"
              value={values.phone}
              onChange={handleChange("phone")}
              name="phone"
              placeholder="0988xxxxxx"
              autoComplete="tel"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2 text-sm outline-none transition"
              type="password"
              value={values.password}
              onChange={handleChange("password")}
              name="password"
              placeholder="Tối thiểu 6 ký tự"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2 text-sm outline-none transition"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {loading ? "Đang xử lý..." : "Tạo tài khoản"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-8">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Hoặc
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
        </div>

        <div className="text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:text-indigo-700 transition"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
