import { useSelector } from 'react-redux'

const HomePage = () => {
	const user = useSelector (state => state.user)
	// console.log('State user from home page', user);

	return(
		<div>
		<h1>HomePage</h1>
		<br /><br /><hr />
		<h2>Current user info:</h2>
		<h6>User ID: {user.userId}</h6>
		<h6>User name: {user.username}</h6>
		<h6>User roles: {user.rolesList}</h6>
		<h6>User token: {user.token}</h6>
	</div>

	)
}

export default HomePage