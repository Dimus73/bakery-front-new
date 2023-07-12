import { Outlet} from 'react-router-dom'
import TopBar from '../Menu/TopBar'
import Footer from '../Footer/Footer'
import Loader from './Loader'

const Layout = () => {

	return (
		<div className='container'>
			<div className='row'>
				<TopBar />
				<Loader />
			</div>
			<div className='row'>
				<div className="container" style={{marginTop:"150px"}}>
					<div className='row'>
						<Outlet />
					</div>
				</div>
			</div>
			<div className='pb-5'></div>
		</div>
	)
}

export {Layout}