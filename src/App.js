import React, {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import AddPage from './pages/AddPage'
import MyMapsPage from './pages/MyMapsPage';
import PlayPage from './pages/PlayPage';

import './index.css';
import axios from "axios";
import RegisterPage from "./pages/RegisterPage";

window.io = require('socket.io-client')

export default function App() {

    const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('user')));
    let _setUser = (data) => {
        window.localStorage.setItem('user', JSON.stringify(data))
        setUser(data);
    }
    const [token, setToken] = useState(JSON.parse(window.localStorage.getItem('token')));
    let _setToken = (data) => {
        window.localStorage.setItem('token', JSON.stringify(data))
        setToken(data);
    }
    const [roomId, setRoomId] = useState('');


    window.url = 'http://192.168.43.250:8000';



    window.axios = axios;
    // window.axios.post(window.url + '/api/messages', {message: '123'});


    return (
        <Router>
            <Switch>
                <Route path="/login">
                    {!user ?
                        <LoginPage user={user} setUser={_setUser} setToken={_setToken}/>
                        : <IndexPage user={user}/>}
                </Route>
                <Route path="/register">
                    {!user ?
                        <RegisterPage user={user} setUser={_setUser} setToken={_setToken}/>
                        : <IndexPage user={user}/>}
                </Route>
                <Route path="/add">
                    {user ? user.isTeacher ?
                        <AddPage user={user} setUser={_setUser} token={token}/>
                        : <IndexPage user={user}/> : <IndexPage user={user}/>}
                </Route>
                <Route path="/my-maps">
                    {user ? user.isTeacher ?
                        <MyMapsPage setRoomId={setRoomId} user={user} setUser={_setUser} token={token}/>
                        : <IndexPage user={user}/> : <IndexPage user={user}/>}
                </Route>
                <Route path="/play">
                    {user ?
                        <PlayPage setRoomId={setRoomId} roomId={roomId} user={user} setUser={_setUser} token={token}/>
                        : <IndexPage user={user}/> }
                </Route>
                <Route path="/">
                    <IndexPage token={token} user={user} setUser={_setUser}/>
                </Route>
            </Switch>
        </Router>
    );
}