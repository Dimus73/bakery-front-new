import {Link, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { setUser } from '../../redux/action'

// import d from '../../../public/img/logo.gpeg'
const TopBar = () =>{
	const navigate = useNavigate();
	const dispatch = useDispatch ();
	const user = useSelector(state => state.user)

	const logOut = (e) => {
		const user = { 
			id:'',
			username:'',
			roles:[],
			token:''
		}
		dispatch (setUser(user));
		localStorage.setItem('user', JSON.stringify(user))
		navigate('/');

	}

	// fixed-top
	return (
		<>
			{/* <div className="container-flued bg-white shadow ">
				<header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-1 mb-1 ">
					<div className="col-md-3 mb-2 mb-md-0 text-center">
						<a href="/" className="d-inline-flex link-body-emphasis text-decoration-none">
							<img src="/img/logo.jpeg" alt="ffff"  width="80" height="60" />
							<svg className="bi" width="40" height="32" role="img" aria-label="Bootstrap">
							</svg>
						</a>
					</div>

					<ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
						<li><Link to="/" className="nav-link px-2 link-secondary">Home</Link></li>
						<li><Link to="#" className="nav-link px-2">Features</Link></li>

						<li className='nav-item dropdown'>
								<Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" to="#" >
									Recipe
								</Link>
								<ul className="dropdown-menu">
									<li><Link className="dropdown-item" to="/recipe/list" >List</Link></li>
									<li><Link className="dropdown-item" to="/recipe/create" >Create</Link></li>
								</ul>
						</li>

						
						<li className="nav-item dropdown">
								<Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									Catalogs
								</Link>
								<ul className="dropdown-menu">
								<li><Link className="dropdown-item" to="/catalog/ingredients">Ingredient</Link></li>
								<li><Link className="dropdown-item" to="/catalog/equipment">Equipment</Link></li>
									<li><Link className="dropdown-item" to="#">Another action</Link></li>
									<li><hr className="dropdown-divider" /></li>
									<li><Link className="dropdown-item" to="#">Something else here</Link></li>
								</ul>
						</li>

						<li><Link to="#" className="nav-link px-2">Pricing</Link></li>
						<li><Link to="#" className="nav-link px-2">FAQs</Link></li>
						<li><Link to="#" className="nav-link px-2">About</Link></li>


					</ul>

					<div className="col-md-3 text-end">
						<ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
							{ user.username ? 
									<li><Link to="/" className="nav-link px-2" onClick={logOut}>Logout</Link></li>
									:
									<li><Link to="/login" className="nav-link px-2">Login</Link></li>}
							<li><Link to="/registry" className="nav-link px-2">Registry</Link></li>
							<div>USER: | {user.username}</div>
						</ul>
					</div>
				</header>
  		</div> */}









		<nav className="navbar navbar-expand-lg rounded bg-white shadow fixed-top font-comfortaa text-dark pt-3 pb-3" >
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample10" aria-controls="navbarsExample10" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

				<div className="col-5 col-md-3 mb-2 mb-md-0 text-center">
						<Link to="/" className="d-inline-flex link-body-emphasis text-decoration-none">
							<img src="/img/logo.jpeg" alt="ffff"  width="80" height="60" />
							<svg className="bi" width="40" height="32" role="img" aria-label="Bootstrap">
							</svg>
						</Link>
					</div>



        <div className="collapse navbar-collapse justify-content-md-center" id="navbarsExample10">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="#">Centered nav only</Link>
            </li>


            <li className="nav-item dropdown">
								<Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" to="#" >
									Task
								</Link>
								<ul className="dropdown-menu">
									<li><Link className="dropdown-item" to="/task/list" >List</Link></li>
									<li><Link className="dropdown-item" to="/task/create" >Create</Link></li>
								</ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link disabled">Disabled</Link>
            </li>


						<li className='nav-item dropdown'>
								<Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" to="#" >
									Recipe
								</Link>
								<ul className="dropdown-menu">
									<li><Link className="dropdown-item" to="/recipe/list" >List</Link></li>
									<li><Link className="dropdown-item" to="/recipe/create" >Create</Link></li>
								</ul>
						</li>

						
						<li className="nav-item dropdown">
								<Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									Catalogs
								</Link>
								<ul className="dropdown-menu">
								<li><Link className="dropdown-item" to="/catalog/ingredients">Ingredient</Link></li>
								<li><Link className="dropdown-item" to="/catalog/equipment">Equipment</Link></li>
									<li><Link className="dropdown-item" to="#">Another action</Link></li>
									<li><hr className="dropdown-divider" /></li>
									<li><Link className="dropdown-item" to="#">Something else here</Link></li>
								</ul>
						</li>


						<li><Link to="/registry" className="nav-link px-2">Registry</Link></li>

          </ul>
        </div>


				<div className="col-5 col-md-3 text-end ">
					<ul className="nav col-md-auto mb-2 justify-content-center mb-md-0">
						{ user.username ? 
								<div className='row align-items-center'>
									<div className='col'>
										<span className='navbar-text'>{user.username}</span>
									</div>
									<div className='col-1'>
										<i className="bi bi-box-arrow-in-right navbar-text" style={{'font-size': '1.8rem', color: 'black'}} onClick={logOut}></i>
									</div>
								</div>
								:
								<li><Link to="/login" className="nav-link px-2">Login</Link></li>
						}
					</ul>
				</div>


      </div>

    </nav>







		</>



	)
}

export default TopBar