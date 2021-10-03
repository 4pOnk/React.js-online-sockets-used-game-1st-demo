import Header from "../components/header/Header";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";


export default function MyMapsPage(props) {

    const [maps, setMaps] = useState([]);

    useEffect(() => {
        window.axios.get(window.url + '/api/games/my_games', {headers: {"Authorization": "Bearer " + props.token}})
            .then(data => {
                setMaps(data.data['my_games']);
                console.log(data)
            })

    }, [])

    return <>
        <Header user={props.user} setUser={props.setUser}/>
        <h1 style={{paddingTop: 100}}>Мои карты</h1>
        <h3>Выберите одну из предложенных и в бой!</h3>

        <ul>
            {maps.map(map => {
                let stars = ''
                for (let i = 0; i < map.difficulty; i++)
                    stars += "⭐";
                return <li onClick={() => {
                    window.axios.post(window.url + '/api/game/start', {id: map.id}, {headers: {"Authorization": "Bearer " + props.token}})
                        .then(res => {
                            props.setRoomId(res.data.game_in_process.code)
                        })
                }
                }><Link to={'/play/' + map.id}>{map.name} | {stars}</Link></li>
            })}
        </ul>
    </>;
}