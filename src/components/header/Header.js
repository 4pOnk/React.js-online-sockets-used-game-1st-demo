import './header.css';
import {Link} from "react-router-dom";
import NoImage from '../../view/images/NoImage.jpg';
import close from '../../view/images/UserClose.png';
import {useState} from "react";

export default function Header(props) {
    console.log(props)

    let HeaderContent;
    const [modalHidden, setModalHidden] = useState(true);

    HeaderContent = <ul>
        <li><Link to="/login">Вход</Link></li>
        <li><Link to="/register">Регистрация</Link></li>
    </ul>
    if(props.user){
        HeaderContent = <div className='HeaderLogined'>
            <h3>{props.user.username}</h3>
            {props.user.image !== undefined ? <img src={props.user.image} alt=""/> : <img src={NoImage} alt=""/> }
            {modalHidden ? <div className="displayHidden" onClick={() => {setModalHidden(false)}}>
                <div className="line" />
                <div className="line" />
                <div className="line" />
            </div> : <img onClick={() => {setModalHidden(true)}} src={close} alt="" style={{border: 'none', width: 40, height: 40, }}/>}

            {!modalHidden ? <div className="hidden">
                <ul>
                    <li className='profile'><Link>Профиль</Link></li>
                    <hr/>
                    <li className='settings'><Link>Настройки</Link></li>
                    <hr/>
                    <li className='help'><Link>Помощь</Link></li>
                    <hr/>
                    <li className='logout' onClick={() => { props.setUser(undefined); delete localStorage.user; }}>Выход</li>
                </ul>
            </div> : null }
        </div>
    }

    return <header>
        {HeaderContent}
    </header>
}