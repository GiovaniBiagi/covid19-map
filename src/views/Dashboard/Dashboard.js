import React, { useState, useEffect } from 'react';
import { Cards } from '../../components';
import ReactMapGL, { Marker } from 'react-map-gl';
import { AreaChart, ResponsiveContainer, Area, XAxis, YAxis, Tooltip, ReferenceLine} from 'recharts';
import moment from 'moment';
import { Tooltip as AntdTooltop, Divider } from 'antd';

import './styles.css';

function Markers({ data }) {
    return data.map(
        city => <Marker
            key={city.country}
            longitude={city.countryInfo.long}
            latitude={city.countryInfo.lat}
        >
            <AntdTooltop placement="top" title={() => (
                <>
                    <p><b>{city.country}</b></p>
                    <p>Casos: {city.cases}</p>
                    <p>Curados: {city.recovered}</p>
                    <p>Mortes: {city.deaths}</p>
                </>
            )}>
                <img src="https://www.revistaversar.com.br/wp-content/uploads/2020/03/5bd08abf7aaafa0575d8502b.png" width="50" alt="Coronavírus" />
            </AntdTooltop>
        </Marker>
    )
}

const CustomizedLabel = () => <h4 style={{ color: "#FFF" }}>Máximo atual</h4>

export default function Dashboard() {
    const [viewport, setViewport] = useState({
        width: '100%',
        height: '100%',
        zoom: 2
    });
    const [timeseries, setTimeseries] = useState([])
    const [countries, setCountries] = useState([])
    const [general, setGeneral] = useState([])

    useEffect(() => {
        let active = true
        fetch(process.env.REACT_APP_API_TIMESERIES)
            .then((res) => res.json())
            .then((data) => {
                if (active) {
                    const filterEmptyFields = data.Brazil.filter(i => i.deaths !== 0);
                    setTimeseries(filterEmptyFields)
                }
            })
        fetch(process.env.REACT_APP_API_URL + '/countries?sort=country')
            .then((res) => res.json())
            .then((data) => {
                if (active) {
                    setCountries(data);
                }
            })
        fetch(process.env.REACT_APP_API_URL + '/all')
            .then((res) => res.json())
            .then((data) => {
                if (active) {
                    setGeneral(data)
                }
            })
        return () => {
            active = false
        }
    }, [])

    return (
        <>
            <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8vh' }}>
                <h1 style={{ color: '#FFF' }}>COVID-19 NO MUNDO</h1>
            </header>
            <div className="container">
                <div className="card-container">
                    <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
                        <span style={{ color: '#FFF' }}>Dados gerais</span>
                    </Divider>
                    <Cards cssUncommonClass="firstCard">
                        <h4>Testes realizados: {general.tests}</h4>
                    </Cards>
                    <Cards cssUncommonClass="secondCard">
                        <h4>Casos confirmados: {general.cases}</h4>
                    </Cards>
                    <Cards cssUncommonClass="thirdCard">
                        <h4>Recuperados: {general.recovered}</h4>
                    </Cards>
                    <Cards cssUncommonClass="fourthCard">
                        <h4>Mortes: {general.deaths}</h4>
                    </Cards>
                </div>
                <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
                    <span style={{ color: '#FFF' }}>Mapa mundial do COVID-19</span>
                </Divider>
                <div className="map-container">
                    <ReactMapGL
                        {...viewport}
                        onViewportChange={setViewport}
                        mapboxApiAccessToken={() => console.log('inserir API KEY do mapbox aqui')}
                    >
                        <Markers data={countries} />
                    </ReactMapGL>
                </div>
                <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
                    <span style={{ color: '#FFF' }}>Linha do tempo no Brasil</span>
                </Divider>
                <div className="linechart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timeseries}
                            margin={{ top: 50, right: 30, left: 20, bottom: 30 }}>
                            <defs>
                                <linearGradient id="deaths" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FC3534" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#FC3534" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="recovered" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#5AE393" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#5AE393" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="confirmed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3A80E2" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3A80E2" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <ReferenceLine y={40000} label={<CustomizedLabel/>} stroke="white" strokeDasharray="3 3" />
                            <Area type="monotone" dataKey="deaths" stroke="#FC3534" fillOpacity={1} fill="url(#deaths)" />
                            <Area type="monotone" dataKey="recovered" stroke="#5AE393" fillOpacity={1} fill="url(#recovered)"/>
                            <Area type="monotone" dataKey="confirmed" stroke="#3A80E2" fillOpacity={1} fill="url(#confirmed)"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <p className="datetime">Última atualização: {moment(general.updated).format('DD/MM/YYYY, h:mm:ss a')}</p>
            </div>
        </>
    )
}
