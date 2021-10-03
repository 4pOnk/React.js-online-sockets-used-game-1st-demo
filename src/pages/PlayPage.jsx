import Header from '../components/header/Header'
import '../view/styles/IndexPage.css';
import {useState, Component} from "react";
import '../view/styles/AddPage.css';
import {
    useLocation
} from "react-router-dom";
import axios from "axios";
import Echo from 'laravel-echo'


export default class AddPage extends Component {

    constructor(props) {
        super(props);
        this.team1Color = '#F19066';
        this.team2Color = '#778BEB';
        this.state = {
            addModal: false,
            rerender: true,
            data: [],
            gamePaused: false,
            team1: [],
            team2: [],
            mapId: +window.location.href.split('/')[window.location.href.split('/').length - 1],
            code: '',
        }
    }


    checkOnlyOne = (e) => {
        this.setState({
            active: e.target.id
        });
    };


    componentDidMount() {
        let canvas = document.querySelector('#canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = document.documentElement.offsetWidth * 0.6;
        canvas.height = document.documentElement.offsetHeight - 150;

        var r = canvas.width / 18;
        var w = r * 2;
        var h = Math.sqrt(3) * r;
        let activeColor = '#F5CD79';


        window.Echo = new Echo({
            broadcaster: 'socket.io',
            host: 'http://192.168.43.250:6001',
            authorizer: (channel, options) => {
                return {
                    authorize: (socketId, callback) => {
                        axios({
                            method: "POST",
                            url: "http://192.168.43.250:8000/api/broadcasting/auth",
                            headers: {
                                Authorization: "Bearer " + this.props.token
                            },
                            data: {
                                socket_id: socketId,
                                channel_name: channel.name
                            }
                        }).then((response) => {
                            callback(false, response.data)
                        }).catch((error) => {
                            callback(true, error)
                        })

                    }
                }
            }
        })

        window.Echo.channel('invitations').listen('.Invite', (response) => {
            this.setState({team1: [...this.state.team1, response.user]})
        })

        function getHex(x, y, retPos) {
            if (retPos === undefined) {
                retPos = {};
            }
            var xa, ya, xpos, xx, yy, r2, h2;
            r2 = r / 2;
            h2 = h / 2;
            xx = Math.floor(x / r2);
            yy = Math.floor(y / h2);
            xpos = Math.floor(xx / 3);
            xx %= 6;
            if (xx % 3 === 0) {      // column with diagonals
                xa = (x % r2) / r2;  // to find the diagonals
                ya = (y % h2) / h2;
                if (yy % 2 === 0) {
                    ya = 1 - ya;
                }
                if (xx === 3) {
                    xa = 1 - xa;
                }
                if (xa > ya) {
                    retPos.x = xpos + (xx === 3 ? -1 : 0);
                    retPos.y = Math.floor(yy / 2);
                    return retPos;
                }
                retPos.x = xpos + (xx === 0 ? -1 : 0);
                retPos.y = Math.floor((yy + 1) / 2);
                return retPos;
            }
            if (xx < 3) {
                retPos.x = xpos + (xx === 3 ? -1 : 0);
                retPos.y = Math.floor(yy / 2);
                return retPos;
            }
            retPos.x = xpos + (xx === 0 ? -1 : 0);
            retPos.y = Math.floor((yy + 1) / 2);
            return retPos;
        }

        function drawCell(cellPos, fStyle, sStyle) {
            var cell = [1, 0, 3, 0, 4, 1, 3, 2, 1, 2, 0, 1];
            var r2 = r / 2;
            var h2 = h / 2;

            function drawCell(x, y) {
                var i = 0;
                ctx.beginPath();
                ctx.moveTo((x + cell[i++]) * r2, (y + cell[i++]) * h2)
                while (i < cell.length) {
                    ctx.lineTo((x + cell[i++]) * r2, (y + cell[i++]) * h2)
                }
                ctx.closePath();
            }

            ctx.lineWidth = 2;
            var cx = Math.floor(cellPos.x * 3);
            var cy = Math.floor(cellPos.y * 2);
            if (cellPos.x % 2 === 1) {
                cy -= 1;
            }
            drawCell(cx, cy);
            if (fStyle !== undefined && fStyle !== null) {  // fill hex is fStyle given
                ctx.fillStyle = fStyle
                ctx.fill();
            }
            if (sStyle !== undefined) {  // stroke hex is fStyle given
                ctx.strokeStyle = sStyle
                ctx.stroke();
            }
        }

        let clearAll = () => {
            if (!this.state.gamePaused)
                ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        let drawCells = () => {
            if (!this.state.gamePaused)
                this.state.data.forEach(hex => {
                    drawCell(hex, hex.color)
                })
        }
        let checkClose = (coords) => {
            let close = false;
            this.state.data.forEach(hex => {
                if (coords.x > 0 && coords.y > 0 && coords.x <= Math.floor(canvas.width / w) && coords.y <= Math.floor(canvas.height / w))
                    if ((hex.y === coords.y - 1 || hex.y === coords.y + 1 || hex.y === coords.y) && (hex.x === coords.x - 1 || hex.x === coords.x + 1 || hex.x === coords.x)) {
                        if (hex.y === coords.y && hex.x === coords.x) {
                            close = false;
                            return 0;
                        }
                        close = true;
                    }
            })
            return close
        }

        function useQuery() {
            return new URLSearchParams(useLocation().search);
        }


        window.axios.get(window.url + '/api/games/game?id=' + this.state.mapId, {headers: {"Authorization": "Bearer " + this.props.token}})
            .then((res) => {
                this.setState({
                    //data: JSON.parse(res.data.game_in_process.hexagons),
                    code: res.data.game_in_process.code,
                }, () => {
                    clearAll();
                    drawCells();
                    this.setState({gamePaused: true})
                })
            });

                canvas.addEventListener('mousemove', (e) => {
                    let coords = getHex(e.offsetX, e.offsetY);
                    clearAll();
                    if (coords.x > 0 && coords.y > 0 && coords.x <= Math.floor(canvas.width / w) && coords.y <= Math.floor(canvas.height / w))
                        if (!this.state.gamePaused)
                            drawCell(coords, 'white', 'gray');

                    let close = checkClose(coords);
                    if (close) {
                        if (!this.state.gamePaused)
                            drawCell(coords, activeColor, 'gray');
                    }
                    drawCells();

                })
                canvas.addEventListener('click', (e) => {
                    let coords = getHex(e.offsetX, e.offsetY);
                    let close = checkClose(coords);
                    if (close) {
                        this.setState({addModal: true, editingCoords: coords});
                    }

                })
                if (this.state.rerender) {
                    clearAll();
                    drawCells();
                    this.setState({rerender: false})
                }
            }

        render()
        {
            return <section className="battleField">
                <Header user={this.props.user} setUser={this.props.setUser} logo={true}/>
                <div className="team1" style={{position: 'absolute', top: "50%", transform: 'translateY: -100%'}}>
                    <h2>Команда 1</h2>
                    {this.state.team1.map((user) => {
                        return <p>{user.username}</p>
                    })}
                </div>
                <div className="team2"
                     style={{position: 'absolute', right: 0, top: "50%", transform: 'translateY: -100%'}}>
                    <h2>Команда 2</h2>
                </div>
                <h1>ID комнаты: {this.state.code}</h1>
                <canvas id="canvas" style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translate(-50%)',
                    bottom: 0,
                    cursor: "pointer"
                }}/>
                {this.state.addModal ? <>
                    <div style={{
                        position: 'absolute',
                        width: "100vw",
                        height: '100vh',
                        backgroundColor: 'black',
                        opacity: '0.7',
                        zIndex: '2'
                    }}/>
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: '40%',
                        padding: "20px",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: 'white',
                        zIndex: '2'
                    }}>
                    <textarea
                        style={{width: "100%", height: "100px", border: '2px solid var(--black)', textAlign: 'center'}}
                        placeholder='Вопрос' value={this.state.question}
                        onChange={(e) => this.setState({question: e.target.value})}/>
                        <div className="line">
                            <input value={this.state.variant1} onChange={(e) => {
                                this.setState({variant1: e.target.value})
                            }} type="text" placeholder="Вариант 1"/>
                            <input value={this.state.variant2} onChange={(e) => {
                                this.setState({variant2: e.target.value})
                            }} type="text" placeholder="Вариант 2"/>
                            <input value={this.state.variant3} onChange={(e) => {
                                this.setState({variant3: e.target.value})
                            }} type="text" placeholder="Вариант 3"/>
                            <input value={this.state.variant4} onChange={(e) => {
                                this.setState({variant4: e.target.value})
                            }} type="text" placeholder="Вариант 4"/>
                        </div>
                        <div className="line">
                            <div><h3>Верный вариант</h3>
                                <input checked={this.state.active === '1'} type="radio" onClick={() => {
                                    this.setState({active: '1'})
                                }} value="1" name="correct"/> 1
                                <input checked={this.state.active === '2'} type="radio" onClick={() => {
                                    this.setState({active: '2'})
                                }} value="2" name="correct"/> 2
                                <input checked={this.state.active === '3'} type="radio" onClick={() => {
                                    this.setState({active: '3'})
                                }} value="3" name="correct"/> 3
                                <input checked={this.state.active === '4'} type="radio" onClick={() => {
                                    this.setState({active: '4'})
                                }} value="4" name="correct"/> 4
                            </div>
                            <input type="button" className='joinFight' value='Добавить' onClick={() => {
                                if (this.state.question !== '' && this.state.variant1 !== '' && this.state.variant2 !== '' && this.state.variant3 !== '' && this.state.variant4 !== '') {

                                    this.setState({
                                        data: [...this.state.data, {
                                            ...this.state.editingCoords,
                                            question: this.state.question,
                                            variants: [this.state.variant1, this.state.variant2, this.state.variant3, this.state.variant4],
                                            current: this.state.active, color: 'green'
                                        }], addModal: false
                                    });


                                    this.state.question = '';
                                    this.state.variant1 = '';
                                    this.state.variant2 = '';
                                    this.state.variant3 = '';
                                    this.state.variant4 = '';
                                    this.state.active = '1'
                                }
                            }
                            }/>
                        </div>
                    </div>
                </> : null}
            </section>
        }

    }
