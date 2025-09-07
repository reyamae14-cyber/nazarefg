/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  setEmailValidator,
  setPasswordValidator
} from "../utils/validatorSlice";
import Button from "./UI/Button";
import Input from "./UI/Input";
import Validator from "./UI/Validator";

const Form = ({
  type,
  name,
  desc,
  style,
  check,
  padding,
  buttonName,
  buttonType,
  buttonSize,
  context
}) => {
  const [email, setEmail] = useState(context || "");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef();
  const passRef = useRef();

  let navigate = useNavigate();

  const { emailError, passwordError } = useSelector((state) => state.validator);
  const dispatch = useDispatch();

  const onEmailChangeHandler = () => {
    dispatch(setEmailValidator(false));
    setEmail(emailRef.current.value);
  };

  const onPassChangeHandler = () => {
    dispatch(setPasswordValidator(false));
    setPass(passRef.current.value);
  };

  //login ////////////////////////////////////////////////
  const login = async () => {
    try {
      const data = { email: email, password: pass };
      const config = {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          withCredentials: true
        }
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        data,
        config
      );
      if (res) {
        // Clear profile selection flag to force profile selection after login
        localStorage.removeItem("hasSelectedProfile");
        navigate("/browse");
      }
    } catch (err) {
      const error = err.response?.data?.message || "An error occurred";

      if (error.includes("password")) {
        dispatch(setPasswordValidator(error));
      } else {
        dispatch(setEmailValidator(error));
      }
    }
  };

  //sign up //////////////////////////////////////////////////
  const signup = async () => {
    try {
      const data = { email: email, password: pass };
      const config = {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          withCredentials: true
        }
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/signup`,
        data,
        config
      );
      if (res) {
        // Clear profile selection flag to force profile selection after signup
        localStorage.removeItem("hasSelectedProfile");
        navigate("/browse");
      }
    } catch (err) {
      const error = err.response?.data?.message || "An error occurred";

      if (error.includes("characters")) {
        dispatch(setPasswordValidator(error));
      } else {
        dispatch(setEmailValidator(error));
      }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    switch (type) {
      case "login":
        login();
        break;
      case "signup":
        signup();
        break;
      default:
        break;
    }
  };
  return (
    <div
      className={`relative flex lg:text-[14px] xl:text-[18px] flex-col justify-center item-center ${
        type === "login" ? "md:bg-[rgb(0,0,0,0.7)]" : ""
      } w-[95%] md:w-[50%] lg:w-[30%] m-[auto] ${padding}`}
    >
      <p className={`${style.name || "text-white"} font-bold tracking-normal`}>
        {name}
      </p>
      {desc.detail && <p className={`${desc.style}`}>{desc.detail}</p>}
      <form className="" onSubmit={submitHandler}>
        <Input
          ref={emailRef}
          onChange={onEmailChangeHandler}
          value={email}
          type="text"
          button={false}
          placeholder={"Email address"}
          style={style.input}
        />
        {emailError && <Validator value={emailError} />}
        <div className="relative">
          <Input
            ref={passRef}
            onChange={onPassChangeHandler}
            value={pass}
            type={showPassword ? "text" : "password"}
            button={false}
            placeholder={"Password"}
            style={style.input}
            id={style.inputId}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {passwordError && <Validator value={passwordError} />}
        {type === "signup" && (
          <div className={`${check.style} flex`}>
            <input type="checkbox" className="scale-150" />
            <span className="pl-4 align-center ">{check.name}</span>
          </div>
        )}
        <Button
          name={buttonName || "Sign In"}
          button={buttonType || "button"}
          bgColor="bg-red-600"
          color="text-white"
          padding="p-2"
          width={buttonSize || "w-[100%] text-[1em]"}
          align="self-center justify-center mt-3"
          span={{ have: false }}
        />
        {type === "login" && (
          //type login
          <>
            <p className="flex justify-center mt-3">OR</p>

            
            {/* <Button  ---- cntl k cntl u to enable
              name="Sign-In as a Guest"
              button="button"
              bgColor="bg-[rgb(45,45,45)]"
              color="text-white"
              size="text-[1em]"
              padding="p-2"
              width="w-[100%]"
              align="self-center justify-center mt-3"
              span={{ have: false }}
              onClick={() => {
                setEmail("guest@conflix.com");
                setPass("123456");
              }}
            /> */}

            <p className="flex justify-center p-4">Forgot password?</p>

            <div className="flex ">
              <input type="checkbox" className="scale-150" />
              <span className="pl-4 align-center">Remember me</span>
            </div>

            <p className="pt-4">
              New to Zetflix?{" "}
              <Link to="/">
                <b>Sign up now</b>
              </Link>
              .
            </p>
            <p className="pt-4 text-sm lg:text-[11px]">
              <span className="text-slate-400">
                You will use the service in accordance with applicable laws in your jurisdiction
              </span>{" "}
              <a
                href="https://www.github.com/"
                target="_blank"
                className="text-blue-600 "
              >
                Learn more
              </a>
            </p>
          </>
          //type login
        )}
      </form>
    </div>
  );
};

export default Form;
