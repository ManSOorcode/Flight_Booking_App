import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import flightSvg from "../../assets/aircraft.svg";
import * as Yup from "yup";
import { toast } from "react-toastify";
import type { SignupFormValues } from "./Signup";
import bcrypt from "bcryptjs";
import {
  EyeOffIcon,
  LockIcon,
  LogIn,
  MailIcon,
  SparklesIcon,
} from "../../assets/icons/Icons";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const existingSession = localStorage.getItem("currentUser");
    if (existingSession) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]") || [];
      const foundUser = users.find((u: SignupFormValues) => {
        return u.email === values.email;
      });

      if (!foundUser) {
        throw new Error("Existing User ony, Please Signup");
      }

      const checkPassword = await bcrypt.compare(
        values.password,
        foundUser.password
      );

      if (!checkPassword) {
        throw new Error("Invalid email or password");
      }

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: foundUser.email,
          role: foundUser.role,
          name: foundUser.name,
        })
      );

      toast.success("Welcome back! Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 1000);

      actions.resetForm();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:flex flex-col items-center justify-center p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl transform rotate-6"></div>
            <div className="relative bg-white/40 backdrop-blur-lg rounded-3xl p-8 border border-white/30">
              <img
                src={flightSvg}
                alt="Login illustration"
                className="w-full max-w-md h-auto filter drop-shadow-lg"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Ready for Takeoff? ✈️
            </h3>
            <p className="text-gray-600 max-w-md">
              Access your flight bookings, manage your trips, and discover
              amazing destinations around the world.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back!
              </h1>
              <p className="text-gray-600">
                Sign in to continue your journey with us
              </p>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MailIcon className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="relative">
                      <Field
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm flex items-center gap-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <LockIcon className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 pr-12 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeOffIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm flex items-center gap-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5" />
                        Sign In
                      </>
                    )}
                  </button>

                  <div className="text-center pt-4 border-t border-gray-200/50">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        to="/auth/signup"
                        className="text-blue-600 hover:text-purple-600 font-semibold transition-colors duration-300 hover:underline"
                      >
                        Create Account
                      </Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
