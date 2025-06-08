import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import flightSvg from "../../assets/aircraft.svg";
import * as Yup from "yup";
import { toast } from "react-toastify";
import type { SignupFormValues } from "./Signup";
import bcrypt from "bcryptjs";

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

  useEffect(() => {
    const existingSession = localStorage.getItem("currentUser");
    if (existingSession) {
      // const { role } = JSON.parse(existingSession);
      // if (role === "admin") navigate("/admin");
      // else if (role === "user") navigate("/user");
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("hello");
  const handleSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    console.log("submited ");
    const users = JSON.parse(localStorage.getItem("users") || "[]") || [];

    console.log("submited ", users);
    const foundUser = users.find((u: SignupFormValues) => {
      return u.email === values.email;
    });

    if (!foundUser) {
      toast.error("Invalid email or password");
      return;
    }

    const checkPassword = await bcrypt.compare(
      values.password,
      foundUser.password
    );

    console.log(values.password, checkPassword, foundUser);

    if (!checkPassword) {
      toast.error("Invalid email or password");
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name,
      })
    );

    toast.success("Login successful!");
    setTimeout(() => {
      // if (foundUser.role === "admin") {
      //   navigate("/admin");
      // } else {
      navigate("/");
      // }
    }, 500);

    actions.resetForm();
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition";
  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full justify-center py-4">
      <div className="hidden md:flex w-1/2 items-center justify-center  bg-gradient-to-br from-indigo-400 to-teal-200 rounded-md ">
        <img
          src={flightSvg}
          alt="signup illustration"
          className="max-w-[80%] h-auto"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md px-4 sm:px-0">
          <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 mb-2">
            Login Welcome Back!
          </h4>
          <p className="text-sm text-gray-500 mb-6">
            Log in to continue — whether you're booking flights or managing
            them.
          </p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4 ">
                <div>
                  <Field
                    name="email"
                    placeholder="Email"
                    className={inputClass}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    className={inputClass}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <p className=" text-sm text-gray-400">
                  Dont have account{" "}
                  <Link
                    className="text-blue-400 hover:text-blue-600 underline"
                    to={"/auth/signup"}
                  >
                    Signup
                  </Link>
                </p>

                <button
                  type="submit"
                  className="bg-indigo-500 text-white  rounded hover:bg-indigo-600 px-4 py-2 cursor-pointer"
                >
                  Login
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
