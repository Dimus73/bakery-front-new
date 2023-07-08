export const SET_USER = 'SET_USER'
export const SET_INGREDIENTS_LIST = 'SET_INGREDIENTS_LIST'

let initState = ""
try {
	const localStorageData = localStorage.getItem('user');
	// console.log('From reducer localStorageData :', localStorageData);
	initState = { user:JSON.parse (localStorageData)}
	// console.log('From reducer after JSON parse :', initState);
	initState = ('username' in initState.user) ? initState : 
	{
			user : { id:'',
					username:'',
					roles:[],
					token:''
		}
	}

} catch (error) {
	// console.log("Error in init initState");

	initState = {
		user : { id:'',
				username:'',
				roles:[],
				token:''
			}
		}
}

initState.ingredientsForMove = []

export const reducer = (state = initState, action = {}) => {
	switch (action.type){
		case SET_USER :
			return ( { ...state, user:action.payload } )
		case SET_INGREDIENTS_LIST :
			return ( {...state, ingredientsForMove: action.payload} )
		default:
			return ({...state})

	}
}