import css from "./Illustration.module.css"

export default function Illustrtion() {

    return (
        <div className={css.container}>
            <img src="./../../public/illustration.png" alt="illustration" />
            <ul>
                <li>Word</li>&middot;
                <li>Translation</li>&middot;
                <li>Grammar</li>&middot;
                <li>Progress</li>
            </ul>
        </div>
    );

}