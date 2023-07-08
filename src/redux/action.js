import { 
	SET_USER,
	SET_INGREDIENTS_LIST,
 } from "./reducer";

export const setUser = (user) => {
	return({
		type: SET_USER,
		payload:user
	})
}

export const setIngredientsListToMove = (iList) => {
	return ({
		type:SET_INGREDIENTS_LIST,
		payload:iList
	})
}