import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { OAth } from "../components";
import { auth } from "../firebase";

export default function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCreds = await signInWithEmailAndPassword(auth, email, password);
      if (userCreds) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Bad user credentials");
    }
  };
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign In</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            className="w-full rounded-2xl"
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
            alt=""
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onSubmit}>
            <input
              className="w-full px-4 py-2 text-lg text-gray-700 border-gray-300 rounded transition ease-in-out mb-6  bg-white "
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email address"
            />
            <div className="relative mb-6">
              <input
                className="w-full px-4 py-2 text-lg text-gray-700 border-gray-300 rounded transition ease-in-out bg-white "
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
              />
              {showPassword ? (
                <AiOutlineEye
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            <div className="flex justify-between items-center whitespace-nowrap text-sm sm:text-lg mb-6">
              <p>
                Don&apos;t have an account?
                <Link
                  className="ml-1 text-red-600 hover:text-red-700 font-semibold transition duration-200 ease-in-out"
                  to="/sign-up"
                >
                  Sign up
                </Link>
              </p>
              <p>
                <Link
                  className=" text-blue-600 hover:text-blue-800 font-semibold transition duration-200 ease-in-out"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <button
              className="bg-blue-600 w-full text-white text-sm uppercase shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800 font-medium rounded px-7 py-3 "
              type="submit"
            >
              Sign In
            </button>
            <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <OAth />
          </form>
        </div>
      </div>
    </section>
  );
}
