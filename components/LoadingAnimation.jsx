import React from 'react'
import Loading from '../public/loading.gif'

const LoadingAnimation = (props) => {
  return (
    <div style={{ marginTop: '1rem' }} className="is-flex is-justify-content-center	is-align-items-center" >
      <img className={props.size === 'small' ? 'image is-32x32' : 'image is-96x96'} src={Loading} />
    </div >
  )
}

export default LoadingAnimation;
