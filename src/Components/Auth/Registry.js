import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { setLoader } from '../../redux/action';
import './Registry.css'

const Registry = () => {
	const BASE_URL = process.env.REACT_APP_BASE_URL
	const URL = '/api/auth/registration'
	const user = useSelector (state => state.user)
	const dispatch = useDispatch() ;

	const addUser = (e) => {
		e.preventDefault();
		const username = e.target.elements.username.value; 
		const password1 = e.target.elements.password1.value; 
		const password2 = e.target.elements.password2.value;

		if (password1 !== password2) {
			alert ('Password fields must match')
			return
		}

		registryUserInDb (username, password1);

		// e.target.elements.username.value = ''; 
		// e.target.elements.password1.value = ''; 
		// e.target.elements.password2.value = '';
	}

	const registryUserInDb = async (username, password) =>{
		const reqData = {
			method : 'POST',
			headers : {
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			},
			body : JSON.stringify({
				username,
				password
			}) 
		}

		try {
			dispatch (setLoader(true));
			const res = await fetch(BASE_URL+URL, reqData);
			dispatch (setLoader(false));

			console.log(res);	
			const resJS = await res.json();
			console.log(resJS);
			if (res.ok) {
				alert (`User ${username} added successfully`);
			} else {
				alert (`Error adding user. Error:${res.status}. Message:"${resJS.msg}"`)
			}
		} catch (error) {
			console.log('Error adding user', error);
			alert('Error adding user. Message: ' + error)
		}
	}

	return(
		// <div>
		// 	<form onSubmit={addUser} action="submit">
		// 		<label htmlFor="username">Username:</label>
		// 		<input type="text" name='username' />
		// 		<label htmlFor="password1">Enter password:</label>
		// 		<input type="text" name='password1'/>
		// 		<label htmlFor="password2">Reenter password</label>
		// 		<input type="text" name='password2'/>
		// 		<button type='submit'>Registry</button>
		// 	</form>
		// </div>
		<div>
			<div className='container'>
				<div className='row justify-content-center'>
					<div className='col-4 bg-white p-0'>
						<div className='m-3' style={{backgroundColor:'#FDEDDA'}}>
							<main class="form-signin w-100 m-auto">
								<form className='form-signin' action="" onSubmit={addUser}>
									<div className='row jd-flex align-items-center justify-content-center'>
										<img class="mb-4" src="/img/logo.svg" alt=""  height="90" />
									</div>
									<div class="form-floating mb-4">
										<input type="text" class="form-control" id="floatingInput" placeholder="password" name="username" />
										<label for="floatingInput">Login</label>
									</div>
									<div class="form-floating mb-4 ">
										<input type="password" class="form-control" id="floatingPassword" placeholder="Password 1" name="password1"/>
										<label for="floatingPassword">Password 1</label>
									</div>
									<div class="form-floating mb-4 ">
										<input type="password" class="form-control" id="floatingPassword" placeholder="Password 2" name="password2"/>
										<label for="floatingPassword">Password 2</label>
									</div>
									<button class="btn btn-danger w-100 py-2" type="submit">Registry</button>
								</form>
							</main>
						</div>
					</div>
				</div>
			</div>

		</div>
	)
}

export default Registry;