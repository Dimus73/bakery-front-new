import { useSelector } from "react-redux"
import './Loader.css'

const Loader = () => {
	const loader = useSelector (state => state.loader);
	return (
		<div>
			{loader ? (
				<div className="position-absolute top-50 start-50 translate-middle z-index-100">
					<img src="/img/loader.svg" alt="" />
				</div>
			):''}
		</div>
	)
}

export default Loader;