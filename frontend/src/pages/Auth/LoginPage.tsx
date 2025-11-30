import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


type LoginFormValues = {
  identifier: string;
  password: string;
  remember: boolean;
};


export default function LoginPage() {

  const [values, setValues] = useState<LoginFormValues>({
    identifier: "",
    password: "",
    remember: false,
  });

  // ✅ state loading + error NẰM Ở ĐÂY
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  // const { login } = useAuth(); // nếu dùng context

  const handleChange =
    (k: keyof LoginFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v =
        k === "remember"
          ? e.currentTarget.checked
          : e.currentTarget.value;

      setValues((s) => ({ ...s, [k]: v }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
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
              value={values.identifier}
              onChange={handleChange("identifier")}
              name="identifier"
              placeholder="Tên đăng nhập của bạn"
              autoComplete="username"
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
              placeholder="Mật khẩu của bạn"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={values.remember}
                onChange={handleChange("remember")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Ghi nhớ đăng nhập
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
            >
              Quên mật khẩu?
            </button>
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
