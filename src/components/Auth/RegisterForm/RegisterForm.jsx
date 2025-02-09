import  { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { register } from "../../../redux/auth/operations";
import { NavLink } from "react-router-dom";
import css from "./RegisterForm.module.css";

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Invalid email format")
        .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Email must be valid")
        .required("Email is required"),
    password: Yup.string()
        .matches(/^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/, "Password must contain at least 6 letters and 1 number")
        .required("Password is required"),
});

export default function RegisterForm() {
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const { register: formRegister, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        dispatch(register(data))
            .unwrap()
            .then(() => {
                toast.success("Registration is success!!!");
            })
            .catch((error) => {
                toast.error("Registration failed: " + error.message);
            });
    };

    return (
        <div className={css.formContainer}>
            <div className={css.formText}>
                <h1>Register</h1>
                <p>To start using our services, please fill out the registration form below. All fields are mandatory:</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
                <div className={css.containerInputs}>
                    <div className={css.inputWrapper}>
                        <input
                            {...formRegister("name")}
                            className={`${css.inputs} ${errors.name ? css.errorInput : ""}`}
                            id="name"
                            type="text"
                            placeholder="Name"
                        />
                        {errors.name && <p className={css.errorMessage}>{errors.name.message}</p>}

                    </div>

                    <div className={css.inputWrapper}>
                        <input
                            {...formRegister("email")}
                            className={css.inputs}
                            id="email"
                            type="email"
                            placeholder="Email"
                        />
                        {errors.email && <p className={css.errorMessage}>{errors.email.message}</p>}
                       

                    </div>

                    <div className={css.passwordField}>
                        <div className={css.containerPassword}>
                        <input
                            {...formRegister("password")}
                            className={css.inputs}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                        />
                        

                        <span
                            className={css.eyeIcon}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <svg width="20" height="20">
                                    <use href="/symbol-defs.svg#icon-eye"></use>
                                </svg>
                            ) : (
                                <svg width="20" height="20">
                                    <use href="/symbol-defs.svg#icon-eye-off"></use>
                                </svg>
                            )}
                            </span>
                        </div>
                        {errors.password && <p className={css.errorMessage}>{errors.password.message}</p>}
                    </div>
                </div>

                <button className={css.buttonRegister} type="submit">
                    Register
                </button>

                <NavLink to="/login">
                    <a className={css.linkLogin}>LogIn</a>
                </NavLink>
            </form>
        </div>
    );
}
