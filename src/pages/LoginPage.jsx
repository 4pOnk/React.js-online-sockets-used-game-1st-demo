import Header from '../components/header/Header'
import {Link} from "react-router-dom";
import '../view/styles/IndexPage.css';
import '../view/styles/LoginPage.css';
import {useState} from "react";
import man from '../view/images/LoginMan.png'
import logo from '../view/images/Logo.png'

export default function LoginPage(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')

    let _onSubmit = () => {
        window.axios.post(window.url + '/api/login', {email: email, password: password},{headers:{"Content-Type": 'application/json', "Accept": 'application/json'}})
            .then(data => {
                props.setToken(data.data.token);
                props.setUser(data.data.user);
            })
            .catch((data) => {
                let response = data.response.data["validation_errors"];
                console.log(response)
                for( let key in response ){
                    setError(response[key][0]);
                    break;
                }
            })
    }

    return <section className='index'>

        <img src={man} alt="" className='StartGirl'/>

        <Header user={props.user} setUser={props.setUser} />
        <div className="content">
            <h1>Добро пожаловать в UchiGame! <img src={logo} className='logo' alt=""/></h1>
            <input required type="text" value={email} className='email' placeholder='lavrova.an11@gmail.com'  onChange={(e) => {setEmail(e.target.value)}}/>
            <input required type="email" value={password} className='password' placeholder='Введите пароль'  onChange={(e) => {setPassword(e.target.value)}}/>
            <h3 style={{color: 'red', fontSize: '20px'}}>{error}</h3>
            <input style={{backgroundColor: "var(--orange)"}} className='joinFight' type="button" value="Войти" onClick={_onSubmit}/>
        </div>
    </section>

}