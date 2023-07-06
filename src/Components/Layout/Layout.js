import { Outlet} from 'react-router-dom'
import TopBar from '../Menu/TopBar'
import Footer from '../Footer/Footer'

const Layout = () => {

	return (
		<div className='container'>
			<div className='row'>
				<TopBar />
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