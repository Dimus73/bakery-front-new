import { 
	SET_USER,
	SET_INGREDIENTS_LIST,
	SET_LOADER,
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

export const setLoader = (loaderState) => {
	return ({
		type:SET_LOADER,
		payload:loaderState
	})
}