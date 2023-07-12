import { useSelector, useDispatch  } from "react-redux";
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { useNavigate  } from "react-router-dom";
import './RecipeList.css'
import { setLoader } from "../../redux/action";

const RecipeList = () =>{
	const user = useSelector (state => state.user)
	const [recipeList, setRecipeList] = useState([]);
	const dispatch = useDispatch();
	// const override: CSSProperties = {
	// 	display: "block",
	// 	margin: "0 auto",
	// 	borderColor: "red",
	// };
	
	const navigate = useNavigate();

	const getRecipeList = async () => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/recipe'

		const reqData = {
			method : 'GET',
			headers:{
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			},
		}

		try {
			dispatch (setLoader(true));
			const data = await fetch(URL, reqData);
			const dataJS = await data.json();
			dispatch (setLoader(false));
			console.log(data, dataJS);
			if (data.ok) {
				setRecipeList (dataJS);
			} else {
				alert(`Error getting list of recipes. Status: ${data.status}. Message: ${dataJS.msg}`)
			}
		} catch (error) {
			console.log(error);
			alert (`Error getting list of recipes. Message: ${error}`)
		}
	}

	useEffect (() => {
		getRecipeList()
	},[]);

	// console.log('recipeList', recipeList);

	return (
		<div>
			<div className="row g-4">
					{recipeList.map((value, i) => <RecipeCard item={value} i={i} navigate ={navigate}/>)}
				</div>
		</div>
	)
}


const RecipeCard = (props) => {
	
	return(

	<div key={props.i} key1={props.i} className="col-12 col-md-6 col-lg-4 col-xl-3" >
		
    <div className="bg-white shadow shadow-lg">
			<div className="img-cont1">
				<div className="img-cont2">
					<img src= {props.item.img} className="recipe-img-card " style={{objectFit:"cover"}} alt="..."
						onClick={()=> props.navigate("/recipe/detail/"+props.item.id)} />
					</div>
			</div>
			<div className="row mt-3 pb-3">
				<div className="col ms-3">
					<h6 className="card-title font-comfortaa">{props.item.name}</h6>
				</div>
				<div className="col text-end me-3">
					<button className="btn btn-lg  btn-outline-danger" 
						onClick={()=> props.navigate("/recipe/"+props.item.id)}>Edit</button>
				</div>
			</div>
		</div>
  </div>
	)
}


export default RecipeList


