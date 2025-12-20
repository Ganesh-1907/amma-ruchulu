import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import adminApi from "../../services/api"; // Make sure this points to your API setup

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For redirecting

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    setLoading(true);
    try {
      // 👇 API call to send forgot password email
      const res = await adminApi.auth.forgotPassword( email );

      // 👇 Show success message
      toast.success(res.data.message || "Reset link sent to your email");

      // 👇 Redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // 👇 Handle error
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-600">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
          >
            {loading ? "Sending..." : "RESET PASSWORD"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span className="text-gray-700">Remembered your password?</span>{" "}
          <Link
            to="/login"
            className="text-red-500 font-semibold hover:underline"
          >
            Back to Login →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
