import {useDispatch, useSelector} from 'react-redux'
import { setUser } from '../../redux/action';
import { useNavigate } from 'react-router-dom';
import { setLoader } from '../../redux/action';
import './Login.css'

const Login = () => {
	const dispatch = useDispatch();
	const user = useSelector (state => state.user)
	const navigate = useNavigate();


	const logInFunction = async (e) => {
		e.preventDefault()
		const username = e.target.elements.username.value;
		const password = e.target.elements.password.value;
		console.log(username, password);
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/auth/login'
	
		
		try {
			const reqData = {
				method : 'POST',
				headers:{
					'Content-type' : 'application/json'
				},
				body:JSON.stringify({
					username,
					password,
				})
			}
			// console.log(reqData);

			dispatch (setLoader(true));
			const data = await fetch(URL, reqData); 
			const result = await data.json()
			dispatch (setLoader(false));
			
			if (data.ok) {
				localStorage.setItem( 'user', JSON.stringify (result) );
				dispatch(setUser(result));
				console.log('In login function', result);
				navigate( '/' );
			} else {
				console.log(`Problems occurred during user login. Message: ${result.message}`);
				alert(`Problems occurred during user login. Message: ${result.message}`);
			}

		} catch (error) {
			dispatch (setLoader(false));
			console.log('No log in', error);
			alert(`Problems occurred during user login. Message: ${error.message}`);
		}

	}

	return (
		<>
			{/* <h1>Login page</h1>
			<h2>{user.username}</h2>
			<form action="" onSubmit={logInFunction}>
				<input type="text" name="username" />
				<input type="text" name="password" />
				<button type="submit">Login</button>
			</form> */}
			{/* <div>
				<br /><br /><hr />
				<h2>Current user info:</h2>
				<h6>User ID: {user.userId}</h6>
				<h6>User name: {user.username}</h6>
				<h6>User roles: {user.rolesList}</h6>
				<h6>User token: {user.token}</h6>
			</div> */}
			<div className='container'>
				<div className='row justify-content-center'>
					<div className='col-11 bg-white p-0'>
						<div className='m-3' style={{backgroundColor:'#FDEDDA'}}>
							<main class="form-signin w-100 m-auto">
								<form className='form-signin' action="" onSubmit={logInFunction}>
									<div className='row jd-flex align-items-center justify-content-center'>
										<img class="mb-4" src="/img/logo.svg" alt=""  height="90" />
									</div>
									<div class="form-floating mb-4">
										<input type="text" class="form-control" id="floatingInput" placeholder="password" name="username" />
										<label for="floatingInput">Login</label>
									</div>
									<div class="form-floating mb-4 ">
										<input type="password" class="form-control" id="floatingPassword" placeholder="Password" name="password"/>
										<label for="floatingPassword">Password</label>
									</div>
									<button class="btn btn-danger w-100 py-2" type="submit">Sign in</button>
								</form>
							</main>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Login