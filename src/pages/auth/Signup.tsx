import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import * as Yup from "yup";
import flightSvg from "../../assets/aircraft.svg";
import bcrypt from "bcryptjs";

import {
  CircleCheckIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
  SparklesIcon,
  UserCheckIcon,
  UserIcon,
} from "../../assets/icons/Icons";

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Confirm Password is required"),
  role: Yup.string().required("Please select a role"),
});

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    values: SignupFormValues,
    actions: FormikHelpers<SignupFormValues>
  ) => {
    setIsLoading(true);

    try {
      const existingUsers: SignupFormValues[] =
        JSON.parse(localStorage?.getItem?.("users") || "[]") || [];

      const userExists = existingUsers.find(
        (user) => user.email === values.email
      );

      if (userExists) {
        throw new Error("User with this email already exists");
      }

      const saltRounds = 10;
      const encryptedPassword = bcrypt.hashSync(values.password, saltRounds);

      const userData = {
        name: values.name,
        email: values.email,
        password: encryptedPassword,
        role: values.role,
      };

      localStorage.setItem(
        "users",
        JSON.stringify([...existingUsers, userData])
      );

      toast.success("Account created successfully! Welcome aboard!");
      setIsLoading(false);
      setTimeout(() => {
        navigate("/auth");
      }, 1000);

      actions.resetForm();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong! Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "user",
      label: "Traveler",
      description: "Book and manage your flights",
      icon: UserIcon,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      value: "admin",
      label: "Admin",
      description: "Manage flights and bookings",
      icon: ShieldIcon,
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:flex flex-col items-center justify-center p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-3xl blur-2xl transform -rotate-6"></div>
            <div className="relative bg-white/40 backdrop-blur-lg rounded-3xl p-8 border border-white/30">
              <img
                src={flightSvg}
                alt="Signup illustration"
                className="w-full max-w-md h-auto filter drop-shadow-lg"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Join Our Sky Community! 🚀
            </h3>
            <p className="text-gray-600 max-w-md">
              Create your account and start exploring the world. Book flights,
              manage trips, and make memories that last a lifetime.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0 ">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl ">
            <div className="text-center mb-8 ">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-4">
                <UserCheckIcon className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </h1>
              <p className="text-gray-600">
                Join thousands of travelers worldwide
              </p>
            </div>

            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "",
              }}
              validationSchema={signupSchema}
              onSubmit={handleSubmit}
            >
              {({ values, isSubmitting }) => (
                <Form className="space-y-5 h-[14rem] overflow-y-scroll px-1 ">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Full Name
                    </label>
                    <Field
                      name="name"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 placeholder:text-gray-400"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MailIcon className="w-4 h-4" />
                      Email Address
                    </label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 placeholder:text-gray-400"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
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
                        placeholder="Create a strong password"
                        className="w-full px-4 py-3 pr-12 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CircleCheckIcon className="w-4 h-4" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Field
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3 pr-12 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Choose Your Role
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {roleOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <label
                            key={option.value}
                            className={`relative cursor-pointer transition-all duration-300 `}
                          >
                            <Field
                              name="role"
                              type="radio"
                              value={option.value}
                              className="sr-only"
                            />
                            <div
                              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                values.role === option.value
                                  ? "border-purple-500 bg-purple-50/50"
                                  : "border-gray-200 bg-white/50 hover:border-purple-300"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`p-2 rounded-lg bg-gradient-to-r ${option.gradient}`}
                                >
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-800">
                                    {option.label}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {option.description}
                                  </p>
                                </div>
                                {values.role === option.value && (
                                  <CircleCheckIcon className="w-5 h-5 text-purple-500 mt-1" />
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    <ErrorMessage
                      name="role"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-gradient-to-r cursor-pointer from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5" />
                        Create Account
                      </>
                    )}
                  </button>

                  <div className="text-center pt-4 border-t border-gray-200/50">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link
                        to="/auth"
                        className="text-purple-600 cursor-pointer hover:text-blue-600 font-semibold transition-colors duration-300 hover:underline"
                      >
                        Sign In
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

export default Signup;
