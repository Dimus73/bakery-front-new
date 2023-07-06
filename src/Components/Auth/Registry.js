import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

const Registry = () => {
	const BASE_URL = process.env.REACT_APP_BASE_URL
	const URL = '/api/auth/registration'
	const user = useSelector (state => state.user)

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
			const res = await fetch(BASE_URL+URL, reqData);
			console.log(res);	
			const resJS = await res.json()
			console.log(resJS);
			if (res.ok) {
				alert (`User ${username} added successfully`)
			} else {
				alert (`Error adding user. Error:${res.status}. Message:"${resJS.msg}"`)
			}
		} catch (error) {
			console.log('Error adding user', error);
			alert('Error adding user. Message: ' + error)
		}
	}

	return(
		<div>
			<form onSubmit={addUser} action="submit">
				<label htmlFor="username">Username:</label>
				<input type="text" name='username' />
				<label htmlFor="password1">Enter password:</label>
				<input type="text" name='password1'/>
				<label htmlFor="password2">Reenter password</label>
				<input type="text" name='password2'/>
				<button type='submit'>Registry</button>
			</form>
		</div>
	)
}

export default Registry;