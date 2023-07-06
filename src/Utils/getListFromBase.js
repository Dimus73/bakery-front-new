// module.exports  = async (token, URL) => {
// 	const BASE_URL = process.env.REACT_APP_BASE_URL;
	

// 	const reqData = {
// 		method : 'GET',
// 		headers : {
// 			'Content-type' : 'application/json',
// 			'Authorization' : 'Bearer ' + token
// 		}
// 	}

// 	try {
// 		const res = await fetch (BASE_URL+URL, reqData);
// 		const resJS = await res.json();

// 		return {
// 			ok : res.ok,
// 			res : resJS
// 		}

// 	} catch (error) {
// 		return{
// 			ok : false,
// 			res : error.message
// 		}		
// 	}

// }

const getAll = async (token, URL) => {
	const BASE_URL = process.env.REACT_APP_BASE_URL;
	

	const reqData = {
		method : 'GET',
		headers : {
			'Content-type' : 'application/json',
			'Authorization' : 'Bearer ' + token
		}
	}

	try {
		const res = await fetch (BASE_URL+URL, reqData);
		const resJS = await res.json();

		return {
			ok : res.ok,
			res : resJS
		}

	} catch (error) {
		return{
			ok : false,
			res : error.message
		}		
	}

}

export default getAll