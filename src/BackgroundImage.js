import React from 'react'
import classnames from 'classnames'


class BackgroundImage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			imageLoaded:false,
			defaultHeight: null,
			currentSrc:null
		}
		this.resizeTimer
	}

	sizeImage() {
		const src = typeof this.refs.image.currentSrc !== 'undefined' ? this.refs.image.currentSrc : this.refs.image.src
		this.setState({
			currentSrc: src
		})
	}

	handleImageLoad() {
		const currentSrc = this.refs.image.src
		this.setState({
			imageLoaded:true,
			currentSrc
		})
		if (this.props.callback) {
			this.props.callback()
		}
	}

	handleImageLoadError() {
		console.log('There was an error loading this image.')
	}

	componentDidMount() {
		const thisImage = this.refs.image
		//window.addEventListener('resize', () => this.sizeImage() )

		// this is for server rendering in case image loads too fast so onload won't fire on client
		if (thisImage.complete) this.handleImageLoad()
	}

	handleResize() {
		clearTimeout(this.resizeTimer)
		this.resizeTimer = setTimeout( () => {
			this.sizeImage()
		}, 1000)
	}

	componentWillUnmount() {
		//window.removeEventListener('resize', () => this.handleResize() )
	}

	render() {
		let bgClasses = classnames({
			'show' : this.state.imageLoaded,
			'bg-container' : true
		})

		const { src, srcSet, backgroundSize } = this.props
		return (
			<div>
				<div ref="bgcontainer" className="yo" style={{
					backgroundPosition: 'center',
					backgroundSize: backgroundSize || 'cover',
					backgroundRepeat:'no-repeat',
					backgroundImage: 'url(' + this.state.currentSrc + ')'}}>

					<img ref="image" src={ src } srcSet={ srcSet }
							 alt={ this.props.alt ? this.props.alt : '' }
							 onLoad={ ()=> { this.handleImageLoad() }}
							 onError={ () => { this.handleImageLoadError() }}
							 style={{ 'visibility':'hidden','zIndex':-1 }} />
					{ this.props.children }
				</div>
			</div>
		)
	}
}

export default BackgroundImage
