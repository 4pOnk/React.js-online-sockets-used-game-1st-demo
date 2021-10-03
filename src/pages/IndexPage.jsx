import Header from '../components/header/Header'
import {Link} from "react-router-dom";
import '../view/styles/IndexPage.css';
import {useState} from "react";
import girl from '../view/images/IndexGirl.png'

export default function IndexPage(props) {


    const [code, setCode] = useState('Ввести код');

    let _onFocus = () => {
        if (code === 'Ввести код') setCode('');
    }
    let _onBlur = () => {
        if (code === '') setCode('Ввести код');
    }
    let _onChange = (e) => {
        if (code.length < 6 || e.target.value.length < code.length)
            setCode(e.target.value);
    }

    return <section className='index'>

        <div className="round1"/>
        <div className="round2"/>
        <img src={girl} alt="" className='StartGirl'/>


        <Header user={props.user} setUser={props.setUser}/>
        <div className="content" style={{backgroundColor: '#ffffff00', left: '10%'}}>
            <h1 style={{fontSize: 100}}>UchiGame</h1>
            <h3>Учись и играй!</h3>
            <form action="#" onSubmit={(event) => {
                event.preventDefault();
                window.axios.post(window.url + '/api/connect_to_game/code', {game_code: code}, {headers: {"Authorization": "Bearer " + props.token}})
                    .then(res => {
                        window.location.href = '/play/' + (res.data["game_in_process"]["game_id"]);
                    })
                    .catch(res => {
                        alert(res.response.data.errorDescription)
                    })

            }}><input className='joinFight' style={styles} type="text" value={code} onChange={_onChange}
                onFocus={_onFocus} onBlur={_onBlur}/>
                </form>
            {props.user ? props.user.isTeacher ?
                <Link className='createFight' to='/my-maps'>Создать поединок</Link> : null : null}
                </div>
                </section>

            }

const styles = {
    backgroundColor: "var(--yellow)",
    textAlign: "center",
    borderRadius: "25px",
    padding: "17px 0",
    fontSize: "30px",
    color: "white",
    width: "400px",
    marginTop: "80px",
    fontFamily: "Montserrat-SemiBold, 'sans-serif'",
    cursor: 'default'
}