import React from 'react'
import ReactDOM from 'react-dom'
import { Slider, Slide } from './src/Slider.js'
import './src/main.scss'

class App extends React.Component {
    render() {
        return(
            <div>
                <Slider key="0">
                    <Slide src={ `https://i.ytimg.com/vi/AEWJYfjZaDE/maxresdefault.jpg` } alt="" key={ `0` } />
                    <Slide src={ `https://i.ytimg.com/vi/AEWJYfjZaDE/maxresdefault.jpg` } alt="" key={ `1` } />
                    <Slide src={ `https://i.ytimg.com/vi/AEWJYfjZaDE/maxresdefault.jpg` } alt="" key={ `2` } />
                    <Slide src={ `https://i.ytimg.com/vi/AEWJYfjZaDE/maxresdefault.jpg` } alt="" key={ `3` } />
                    <Slide src={ `https://i.ytimg.com/vi/AEWJYfjZaDE/maxresdefault.jpg` } alt="" key={ `4` } />
                </Slider>
                <h1>React Simple Slider<br/>by <a href="https://radenb.com">radenB</a></h1>
            </div>
        )
    }
}

const APP = document.getElementById('app')

ReactDOM.render(<App />, APP)
