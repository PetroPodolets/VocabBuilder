import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logIn } from "../../../redux/auth/operations";
import { NavLink } from "react-router-dom";
import css from "./LoginForm.module.css";

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email format")
        .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Email must be valid")
        .required("Email is required"),
    password: Yup.string()
        .matches(/^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/, "Password must contain at least 6 letters and 1 number")
        .required("Password is required"),
});

export default function LoginForm() {
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        dispatch(logIn(data))
            .unwrap()
            .then(() => {
                toast.success("Login is successful!");
            })
            .catch((error) => {
                toast.error("Login failed: " + error.message);
            });
    };

    return (
        <div className={css.formContainer}>
            <div className={css.formText}>
                <h1>Login</h1>
                <p>Please enter your login details to continue using our service:</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
                <div className={css.containerInputs}>
                    <div className={css.inputWrapper}>
                        <input
                            {...register("email")}
                            className={`${css.inputs} ${errors.email ? css.errorInput : ""}`}
                            id="email"
                            type="email"
                            placeholder="Email"
                        />
                        {errors.email && <p className={css.errorMessage}>{errors.email.message}</p>}
                    </div>

                    <div className={css.passwordField}>
                        <div className={css.containerPassword}>
                            <input
                                {...register("password")}
                                className={`${css.inputs} ${errors.password ? css.errorInput : ""}`}
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
                    Login
                </button>

                <NavLink to="/" className={css.linkLogin}>
                    Register
                </NavLink>
            </form>
        </div>
    );
}
