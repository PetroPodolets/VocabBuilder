import RegisterForm from "../../components/Auth/RegisterForm/RegisterForm";
import css from "./RegisterPage.module.css"
import Illustrtion from "../../components/Illustration/Illustratin";
export default function RegisterPage() {
    return (
        <div className={css.containerPage}>
           

            <div className={css.container}>
                <RegisterForm />
                <Illustrtion />
            </div>
            <img className={css.vector} src="./../../public/Vector.png" alt=""  />
        </div>)
}