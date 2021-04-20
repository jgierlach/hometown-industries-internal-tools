import Loading from '../public/loading.gif'

const LoadingAnimation = () => {
  return (
    <div style={{ marginTop: '1.5rem' }} className="is-flex is-justify-content-center	is-align-items-center" >
      <img className="image is-96x96" src={Loading} />
    </div >
  )
}

export default LoadingAnimation;
