import Illustrtion from "../../components/Illustration/Illustratin";
import LoginForm from "./../../components/Auth/LoginForm/LoginForm"
import css from "./LoginPage.module.css"

export default function LoginPage() {
    return (
        <div >
            <div className={css.container}>
                <LoginForm/>
                <Illustrtion />
            </div>  
             <img className={css.vector} src="./Vector.png" alt=""  />
    </div>
)
}