import { SET_USER } from "./reducer";

export const setUser = (user) => {
	return({
		type: SET_USER,
		payload:user
	})
}