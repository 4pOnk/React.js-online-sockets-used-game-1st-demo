import Header from '../components/header/Header'
import {Link} from "react-router-dom";
import '../view/styles/IndexPage.css';
import '../view/styles/LoginPage.css';
import '../view/styles/RegisterPage.css';
import {useState} from "react";
import man from '../view/images/RegisterMan.png'
import logo from '../view/images/Logo.png'

export default function RegisterPage(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [initials, setInitials] = useState('');
    const [isTeacher, setIsTeacher] = useState(false);

    const [error, setError] = useState('');

    let _onSubmit = () => {
        window.axios.post(window.url + '/api/register', {
            email: email,
            password: password,
            username: initials,
            password_repeat: passwordRepeat,
            isTeacher: isTeacher
        }, {headers: {"Content-Type": 'application/json', "Accept": 'application/json'}})
            .then(data => {
                props.setToken(data.data.token);
                props.setUser(data.data.user);
            })
            .catch((data) => {
                let response = data.response.data["validation_errors"];
                console.log(response)
                for (let key in response) {
                    setError(response[key][0]);
                    break;
                }
            })
    }

    return <section className='index'>

        <img src={man} alt="" className='StartGirl' style={{position: "absolute", right: "auto", left: "200px"}}/>

        <Header user={props.user} setUser={props.setUser}/>
        <div className="content" style={{marginLeft: 0, position: "absolute", right: "200px"}}>
            <h1>Добро пожаловать в UchiGame! <img src={logo} className='logo' alt=""/></h1>
            <input type="text" value={email} className='email' placeholder='lavrova.an11@gmail.com' onChange={(e) => {
                setEmail(e.target.value)
            }}/>
            <input type="text" value={initials} className='initials' placeholder='Лаврова Анастасия' onChange={(e) => {
                setInitials(e.target.value)
            }}/>
            <input type="text" value={password} className='password' placeholder='Введите пароль' onChange={(e) => {
                setPassword(e.target.value)
            }}/>
            <input type="text" value={passwordRepeat} className='password' placeholder='Введите пароль'
                   onChange={(e) => {
                       setPasswordRepeat(e.target.value)
                   }}/>
            <div className="wrapper">
                <input type="radio" name="select" id="option-1" checked={true} onChange={() => {setIsTeacher(false)}}/>
                <input type="radio" name="select" id="option-2" checked={isTeacher} onChange={() => {setIsTeacher(true)}}/>
                <label htmlFor="option-1" className="option option-1" >
                    <div className="dot"></div>
                    <span>Student</span>
                </label>
                <label htmlFor="option-2" className="option option-2" >
                    <div className="dot"></div>
                    <span>Teacher</span>
                </label>
            </div>
            <h3 style={{color: 'red', fontSize: '20px'}}>{error}</h3>

            <input className='joinFight' type="button" value="Продолжить" style={{width: '350px'}} onClick={_onSubmit}/>
        </div>
    </section>

}