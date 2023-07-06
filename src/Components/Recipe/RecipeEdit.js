
import { useParams } from "react-router-dom";
import Recipe from './Recipe'

const RecipeEdit = () => {
	const {id} = useParams(); 

	return(
		<div>
			<h1>Recipe Edit</h1>
			<Recipe flag={'edit'} id={id} />
		</div>
	)
}

export default RecipeEdit