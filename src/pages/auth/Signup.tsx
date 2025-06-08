import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import * as Yup from "yup";
import flightSvg from "../../assets/aircraft.svg";
import bcrypt from "bcryptjs";

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const signupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().min(6).required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Confirm Password is required"),
  role: Yup.string().required("Role is required"),
});

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (
    values: SignupFormValues,
    actions: FormikHelpers<SignupFormValues>
  ) => {
    const existingUsers: SignupFormValues[] =
      JSON.parse(localStorage?.getItem?.("users") || "[]") || [];
    const userExists = existingUsers.find(
      (user) => user.email === values.email
    );

    if (userExists) {
      alert("User already exists");
      return;
    }

    const saltRounds = 10;

    const encryptedPassword = bcrypt.hashSync(values.password, saltRounds);

    const userData = {
      name: values.name,
      email: values.email,
      password: encryptedPassword,
      role: values.role,
    };

    try {
      localStorage.setItem(
        "users",
        JSON.stringify([...existingUsers, userData])
      );
      toast.success("Signup successful!");
      navigate("/auth");

      actions.resetForm();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition";

  return (
    // <>

    //   <div className="flex-col items-center justify-center hidden h-screen rounded-md md:flex">
    //     <img src={flightSvg} alt="login image" className="" />
    //   </div>
    //   <div className="flex flex-col items-center justify-center h-screen px-4 mx-auto  w-[100%]  sm:w-[80%] md:w-[50%]  lg:w-[40%]">
    //     <div className="">
    //       <h4 className="text-[24px] md:text-3xl lg:text-4xl font-bold pb-2 text-gray-600">
    //         Signup in to your Account
    //       </h4>
    //       <p className="text-sm font-medium text-gray-600 sm:text-base">
    //         Welcome back! Please Signup to continue
    //       </p>
    //     </div>
    //     <Formik
    //       initialValues={{
    //         name: "",
    //         email: "",
    //         password: "",
    //         confirmPassword: "",
    //         role: "",
    //       }}
    //       validationSchema={signupSchema}
    //       onSubmit={handleSubmit}
    //     >
    //       {() => (
    //         <Form className="flex flex-col items-center justify-center w-full py-4 lg:p-8">
    //           <Field name="name" placeholder="Name" className="input" />
    //           <ErrorMessage
    //             name="name"
    //             component="div"
    //             className="text-red-500 text-sm"
    //           />

    //           <Field
    //             name="email"
    //             type="email"
    //             placeholder="Email"
    //             className="input"
    //           />
    //           <ErrorMessage
    //             name="email"
    //             component="div"
    //             className="text-red-500 text-sm"
    //           />

    //           <Field
    //             name="password"
    //             type="password"
    //             placeholder="Password"
    //             className="input"
    //           />
    //           <ErrorMessage
    //             name="password"
    //             component="div"
    //             className="text-red-500 text-sm"
    //           />

    //           <Field
    //             name="confirmPassword"
    //             type="password"
    //             placeholder="Confirm Password"
    //             className="input"
    //           />
    //           <ErrorMessage
    //             name="confirmPassword"
    //             component="div"
    //             className="text-red-500 text-sm"
    //           />

    //           <Field as="select" name="role" className="input">
    //             <option value="">Select Role</option>
    //             <option value="user">User</option>
    //             <option value="admin">Admin</option>
    //           </Field>
    //           <ErrorMessage
    //             name="role"
    //             component="div"
    //             className="text-red-500 text-sm"
    //           />

    //           <button
    //             type="submit"
    //             className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
    //           >
    //             Create Account
    //           </button>
    //         </Form>
    //       )}
    //     </Formik>
    //   </div>
    // </>

    <div className="min-h-screen flex flex-col md:flex-row w-full justify-center py-4">
      {/* Left: Image (hidden on small screens) */}
      <div className="hidden md:flex w-1/2 items-center justify-center  bg-gradient-to-br from-indigo-400 to-teal-200 rounded-md ">
        <img
          src={flightSvg}
          alt="signup illustration"
          className="max-w-[80%] h-auto"
        />
      </div>

      {/* Right: Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md px-4 sm:px-0">
          <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 mb-2">
            Sign_up! Create Your Account
          </h4>
          <p className="text-sm text-gray-500 mb-6">
            Sign up to book flights as a user or manage flights as an admin.
            Select your role below to get started.
          </p>

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
            {() => (
              <Form className="space-y-4 ">
                <div>
                  <Field
                    name="name"
                    placeholder="Name"
                    className={inputClass}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <Field
                    name="email"
                    type="email"
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

                <div>
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className={inputClass}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <Field as="select" name="role" className={inputClass}>
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-500 transition-all cursor-pointer"
                >
                  Create Account
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Signup;
