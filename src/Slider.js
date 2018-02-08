import React from 'react'
import Link from 'gatsby-link'
import gsap from 'gsap'
import { TransitionGroup, Transition } from 'react-transition-group'
import BackgroundImage from './BackgroundImage.js'

export class Slider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            active: null,
            length: this.props.children.length,
            loaded: false,
            prev: 0
        }

        this.onScroll = () => this.handleScrollCheck()
        this.imagesLoaded = 0
    }
    componentDidMount() {
        const { length } = this.state
        let { fill } = this.refs

        this.tl = new TimelineMax({ paused: true, onComplete: () => this.handleImageChange()})

        this.props.children.map( slide => {
            let newImage = new Image();
            newImage.src = slide.props.src
            newImage.sizes = slide.props.sizes
            newImage.srcSet = slide.props.srcSet
            // console.log('new image ==> ', newImage)
            newImage.addEventListener('load', () => this.handleImageLoad() )
        })



        // Only set scroll Listener if more than 1 Slide
        length > 1 ? window.addEventListener('scroll', this.onScroll, {passive: true} ) : null
    }
    componentDidUpdate(nextProps) {
        let { fill } = this.refs

        if ( fill ) {
            // Clears out old timeline, adds only new active timer
            this.tl.clear()
            this.tl.set(fill, {x: '-100%'})
            this.tl.to(fill, 4.5, {x: '0%', ease: Power0.easeNone})
        }
    }
    componentWillUnmount() {
        const { length } = this.state
        this.tl.pause()
        this.tl.clear()
        length > 1 ? window.removeEventListener('scroll', this.onScroll ) : null
        if (this.controller) this.controller.destroy()
        if (this.scene) this.scene.destroy()
        this.controller = null
        this.scene = null
    }

    handleScrollCheck() {
        let { slider } = this.refs
        const top = slider.getBoundingClientRect().top
        const height = slider.clientHeight
        const winHeight = window.innerHeight

        top > winHeight*-1 && top < height ? this.tl.play() : this.tl.pause()
    }

    handleImageLoad() {
        this.imagesLoaded++
        if( this.imagesLoaded == this.state.length ) {
            this.setState( { loaded: true, active: 0 })
            this.tl.play()
            this.scrollMagicScene()
        }
    }


    scrollMagicScene() {
        this.controller = this.props.controller
        let heroTL = new TimelineMax()

        const slides = this.refs.slideContainer
        Array.from(slides.children).map( slide =>
            heroTL.fromTo( slide, .5, {  scale:1.0,y:0 }, { scale:1.15,y:'20%' }) )

        const trigger = this.refs.slider
        const height = trigger.clientHeight
        this.scene = new ScrollMagic.Scene({
            triggerElement:trigger,
            reverse:true,
            triggerHook: .1,
            duration:height + 'px'
        })
        //.addIndicators()
        .setTween(heroTL)
        .addTo(this.controller)
    }

    handleImageChange(val) {
        let { active, length } = this.state
        let increment = val ? val : 1
        let newActive = active + increment > length - 1 ? 0 : active + increment < 0 ? length - 1 : active + increment

        this.setState({ active: newActive, prev: active })
        this.tl.restart()
    }
    handleSetActive(newActive) {
        let { active } = this.state

        this.setState({ active:newActive, prev: active })
        this.tl.restart()
        this.tl.pause()
    }
    handleEnter(node, newActive) {
        let { active, length, prev } = this.state
        let offset = active > prev || prev == length - 1 && active == 0 ? 100 : -100

        let tl = new TimelineMax()
        tl.fromTo( node, 1.0, {x: `${offset}%`}, {x: '0%', ease:Power2.easeInOut }, 0)
    }
    handleExit(node, oldActive) {
        let { active, length } = this.state
        let offset = active > oldActive || oldActive == length - 1 && active == 0 ? -100 : 100

        let tl = new TimelineMax()
        // tl.set(node, { css: { position: 'absolute', top: '0' }})
        tl.to( node, 1.0, {x: `${offset}%`, ease:Power2.easeInOut })
    }
    handleTimerPause(isPaused) {
        // console.log(isPaused)
        isPaused ? this.tl.pause() : this.tl.play()
    }
    render() {
        let { active, loaded, length } = this.state
        let { children, controller } = this.props
        return (
            <div className={ length > 1 ? 'slider' : 'single slider' } ref="slider"
                 style={ this.props.margins ?
                          { width: 'calc(100vw - 16.666%)', margin:'80px auto 0' } : null}>
                {
                    length > 1 ?
                        <span>
                            <div className="prev" onClick={ () => this.handleImageChange(-1)}></div>
                            <div className="next" onClick={ () => this.handleImageChange()}></div>
                        </span> : null
                }
                {
                    loaded == true && length > 1 ? (
                        <div ref="slideContainer">
                        <TransitionGroup className="slide">
                            <Transition key={ active }
                                        timeout={ 1000 }
                                        onEnter={ (node) => this.handleEnter(node, active) }
                                        onExit={ (node) => this.handleExit(node, active) }
                                        >

                                        { children[active] }

                            </Transition>
                        </TransitionGroup>
                        </div>
                    ) : children.map( (slide, index) => {
                            let classes = index > 0 ? 'slide hidden' : 'slide'
                            return (
                                <div ref="slideContainer" className={ classes } key={index}>
                                    { slide }
                                </div>
                            )
                        })
                }
                {
                    <div className="normalize-height">
                        <img src={ children[0].props.src } srcSet={ children[0].props.srcSet } alt="" />
                    </div>
                }
                {
                    loaded == true && length > 1 ? (
                        <div className="timer">
                            { children.map( (slide, index) => {
                                let { active } = this.state
                                let classes = index < active ? 'block active' : 'block'
                                let length = 100 / this.props.children.length
                                let width = index > 0 ? `calc(${length}% - 3px)` : `${length}%`

                                { /* On Click change active && Resume timeline on hoverout ONLY on current */ }
                                return (
                                    <div className={ classes } style={{ width }} key={ index }
                                    onClick={ () => this.handleSetActive(index) }
                                    onMouseOver={ active == index ? () => this.handleTimerPause(true) : null }
                                    onMouseLeave={ active == index ? () => this.handleTimerPause(false) : null }>

                                        {/* Reset transform to account for user interaction with navigations */}
                                        <div className="fill" ref={ active == index ? 'fill' : null } style={{ transform: active > index - 1 ? '' : null}} />
                                    </div>
                                )
                            }) }
                        </div>
                    ) : null
                }
            </div>
        )
    }
}

export class Slide extends React.Component {
    render() {
        let { srcSet, src, alt } = this.props
        return (
            <BackgroundImage src={ src } srcSet={ srcSet } alt={ alt }>
                <div className="content">
                    { this.props.children }
                </div>
            </BackgroundImage>
        )
    }
}
