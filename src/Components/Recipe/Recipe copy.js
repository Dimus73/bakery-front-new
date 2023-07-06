import './Recipe.css'
import { useSelector } from 'react-redux'
import {useState, useEffect} from 'react'
import getAll from '../../Utils/getListFromBase'
import BlockTable from './RecipeTable'


const Recipe = (props) => {
	const user = useSelector (state => state.user);
	const emptyRecipe = {
		name : '',
		finish_quantity : 1,
		unit_id : '',
		semifinished : false,
		ingredients:[
			{}
		],
		equipments:[
			{}
		],
		description:'',
		imgURL:'',
		img:'',
		creator : user.userId
	}

	const [equipments, setEquipment] = useState([{}]);
	const [ingredients, setIngredients] = useState([{}]);
	const [units, setUnits] = useState([{}]);
	const [recipe, setRecipe] = useState( emptyRecipe )

	// ---------------------------
	// Get All ingredients for select tub
	// ---------------------------

	const getAllIngredients = async () => {
		const URL = '/api/catalog/ingredients'
		const temp = await getAll(user.token, URL);
  
		if (!temp.ok) {
			alert (temp.res)
			return ;
		}
		return temp.res;
		// console.log(temp.res);
	}

	// ---------------------------
	// Get All equipment for select tub
	// ---------------------------
	const getAllEquipment = async () => {
		const URL = '/api/catalog/equipment'
		const temp = await getAll(user.token, URL);
  
		if (!temp.ok) {
			alert (temp.res)
			return ;
		}
		return (temp.res);
	}

	// ---------------------------
	// Get All units for right display
	// ---------------------------
	const getAllUnits = async () => {
		const URL = '/api/catalog/units'
		const temp = await getAll(user.token, URL);
  
		if (!temp.ok) {
			alert (temp.res)
			return ;
		}
		return(temp.res);
	}

	// ---------------------------
	// Get recipe detail in case of Edit
	// ---------------------------

	const getRecipeDetail = async (id) => {
		const BASE_URL = process.env.REACT_APP_BASE_URL;
		const URL = BASE_URL + '/api/recipe/'+id;

		const reqData = {
			method : 'GET',
			headers:{
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			},
		}
		try {
			const data = await fetch(URL, reqData);
			const dataJS = await data.json();
			if (data.ok) {
				dataJS.ingredients.push({})
				dataJS.equipments.push({})

				return dataJS
			} else {
				alert(`Error getting recipes detail. Status: ${data.status}. Message: ${dataJS.msg}`)
			}
		} catch (error) {
			console.log(error);
			alert (`Error getting recipes detail. Message: ${error}`)
		}

	}


	useEffect( () => {
		const tt = async () => {
			const v_ingredients = await getAllIngredients();
			const v_equipments  = await getAllEquipment();
			const v_units       = await getAllUnits();
			setEquipment(v_equipments);
			setIngredients(v_ingredients);
			setUnits(v_units);
			// console.log('IF FLAG', props.recipe);
			if (props.flag === 'edit') {
				const res = await getRecipeDetail(props.id);
				console.log('Flags:', props, res);
				setRecipe({...res})
				
			}
		}
	 	tt()
	} ,[]);
	

	// ---------------------------
	// Checking data before sending it to the server
	// ---------------------------

	const recipeDataCheck = (data) => {
		if (!(data.name.trim())) {
			alert ('Recipe name field cannot be empty');
			return false
		}
		if (isNaN(data.finish_quantity)){
			alert ('You must specify the amount of output')
			return false
		}
		if (data.unit_id == 1){
			alert('It is necessary to select units of finished products')
			return false
		}
		if (data.ingredients.some((value) =>  isNaN(value.quantity) || Number(value.quantity) <=0 )){
			alert ('In the "number of ingredients" field must be a number greater than zero')
			return false;
		}
		if (data.equipments.some((value) =>  isNaN(value.quantity) || Number(value.quantity) <=0 )){
			alert ('In the "equipment time" field must be a number greater than zero')
			return false;
		}
		return true
	}

	// ---------------------------
	// Clearing data before sending it to the server
	// ---------------------------
	const clearData = (recipe) => {
		const data = {...recipe};

		data.ingredients = data.ingredients.filter((value) => 'id' in value)
		data.equipments = data.equipments.filter((value) => 'id' in value)
		data.name = data.name.trim();

		return data

	}


	// ---------------------------
	// Function to save data to database
	// ---------------------------
	const saveRecipe = async () => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/recipe'
		// recipe.creator = user.id;

		const data = clearData(recipe);

		if (!recipeDataCheck(data)) { 
			return
		}

		 console.log('Recipe from FRONT to SAVE=>', data, user);

		const reqData = {
			method : 'POST',
			headers : {
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token 
			},
			body : JSON.stringify (data)
		}
		// await fetch (URL, reqData)
		try {
			await fetch (URL, reqData)	
		} catch (error) {
			console.log(`Error while saving recipe. Message: ${error}`);
			alert (`Error while saving recipe. Message: ${error}`)
		}
	}

	// ---------------------------
	// Function to update existing recipe in database
	// ---------------------------
	const updateRecipe = async () => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/recipe'

		const data = clearData(recipe);

		if (!recipeDataCheck(data)){
			return
		}

		console.log('Recipe from FRONT to SAVE=>', data, user);

		const reqData = {
			method : 'PUT',
			headers : {
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token 
			},
			body : JSON.stringify (data)
		}
		try {
			const res = await fetch (URL, reqData);
			const resJS = await res.json()
			if ( res.ok ) {
				alert ('Recipe update successful ')
			} else {
				console.log(`Error in updating. Status:${res.status}. Message: ${resJS}`);
				alert (`Error in updating. Status:${res.status}. Message: ${resJS}`)
			}	
		} catch (error) {
			console.log(`Error while UPDATING recipe. Message: ${error}`);
			alert (`Error while UPDATING recipe. Message: ${error}`)
		}


	}

	// ---------------------------
	// Callback function for changing the ingredient. It also changes the unit of measure.
	// ---------------------------
	const changeIngredient = ( e, i, flag ) => { 
		e.preventDefault();
		const newValue = Number( e.target.value );
		if (flag === 'I') {
			const newUnits = ingredients.filter((value) => value.id === newValue)[0].unit_short_name
			recipe.ingredients[i].id = 0;
			recipe.ingredients[i].ingredient_id = newValue;
			recipe.ingredients[i].unit_name = newUnits;
			if ( recipe.ingredients.every((value) => ('ingredient_id' in value)) ){
				recipe.ingredients.push({})
			}
			console.log('recipe.ingredients:',recipe.ingredients);
		} else {
			recipe.equipments[i].id = 0;
			recipe.equipments[i].equipment_id = newValue;
			if ( recipe.equipments.every((value) => ('equipment_id' in value)) ){
				recipe.equipments.push({})
			}
			// console.log(recipe.equipments);

		}
		setRecipe({...recipe}); 

	} 

	// ---------------------------
	// Callback function to change quantity of the ingredient
	// ---------------------------
	const changeIngredientQuantity = ( e, i, flag ) => { 
		e.preventDefault();
		
		if ( !isNaN(e.target.value) ){
			// let nd = 'jjj'
			// console.log(isNaN(nd));
			if ( flag === 'I' ){
				recipe.ingredients[i].quantity = e.target.value;
			} else {
				recipe.equipments[i].quantity = e.target.value;
			}
			setRecipe({...recipe}); 
		}

	} 

	// ---------------------------
	// Callback function to remove the ingridient.
	// ---------------------------
	const deleteIngredient = ( e, i, flag ) => { 
		e.preventDefault();
		if ( flag === 'I' ){
			recipe.ingredients = recipe.ingredients.filter((value,ind) => ind !== i);
		} else {
			recipe.equipments = recipe.equipments.filter((value,ind) => ind !== i);
		}
		setRecipe({...recipe}); 
		
	} 


	return(
		<div className='container bg-white p-5 font-comfortaa'>
			<div className='row'>


				<div className='col-3'>
					
					<div className='mb-3' >
						<label className='form-label' htmlFor="recipe_name">Recipe name:</label>
						<input className='form-control ' type="text" name='recipe_name' value={recipe.name}
							onChange={ (e) => {setRecipe ({...recipe, name:e.target.value})}} />
					</div>

					<div className='mb-3' >
						<label className='form-label' htmlFor="recipe_img">Recipe img:</label>
						<input className='form-control' type="text" name='recipe_img' value={recipe.img}
							onChange={ (e) => {setRecipe ({...recipe, img:e.target.value})}} />
					</div>

					{/* <div contentEditable="true" 
						onInput={ (e) => {setRecipe ({...recipe, name:e.target.innerText})} }>Test edit div</div> */}

					<div className='mb-3' >
						<label className='form-label' htmlFor="finish_quantity">Finish quantity:</label>
						<input  className='form-control' type="text" name='finish_quantity' value={recipe.finish_quantity}
								onChange={ (e) => {setRecipe ({...recipe, finish_quantity:e.target.value})}} />
					</div>

					<div className='mb-3' >
						<label className='form-label' htmlFor="iUnit">Unit:</label>
						<select  className='form-select' onChange={(e) => setRecipe ({...recipe, unit_id:e.target.value}) }
								name='unit' value = {recipe.unit_id} >
							{units.map ((item) =>
								<option key={item.id} value={item.id}>{item.unit_name}</option>
							)}
						</select>
					</div>

					<div>
						<label className='form-label' htmlFor="is_semifinished">Semifinished</label>
						{recipe.semifinished ?
						<input className='form-check-input' type="checkbox" name="is_semifinished" checked
							onChange={ (e) => setRecipe ({...recipe, semifinished:e.target.checked})}/>
						:
						<input className='form-check-input' type="checkbox" name="is_semifinished"
						onChange={ (e) => setRecipe ({...recipe, semifinished:e.target.checked})}/>
						}
					</div>
				</div>


				<div className='col-3'>
					{/* <div>
						<img src={recipe.img} alt="" className='img-thumbnail img-fluid'/>
					</div> */}
						<div className="img-cont1">
							<div className="img-cont2">
								<img src= {recipe.img} className="recipe-img-card " style={{objectFit:"cover"}} alt="..." />
								</div>
						</div>

				</div>
				<div className='col-6'>
					<label htmlFor="description">Description</label>
					<textarea name="description" id="" cols="60" rows="8" value={recipe.description}
						onChange={ (e) => {setRecipe ({...recipe, description:e.target.value})} }></textarea>
				</div>
			</div>
			<div className='row'> 
				<div className='col-md-10 col-xl-6'>
					{/* ---------------------------------- */}
					<div>Ingredient</div>
					<BlockTable flag={'I'}
							componentList={recipe.ingredients} recipe={recipe} 
							ingredients={ingredients} changeIngredient={changeIngredient}
							changeIngredientQuantity = {changeIngredientQuantity}
							deleteIngredient = {deleteIngredient} setRecipe={setRecipe}
					/>
					{/* ---------------------------------- */}
				</div>

				<div className='col-md-10 col-xl-6'>
					{/* ---------------------------------- */}
					<div>Equipment</div>
					<BlockTable flag={'E'}
							componentList={recipe.equipments} recipe={recipe} 
							ingredients={equipments} changeIngredient={changeIngredient}
							changeIngredientQuantity = {changeIngredientQuantity}
							deleteIngredient = {deleteIngredient} setRecipe={setRecipe}
					/>
					{/* ---------------------------------- */}
				</div>
				<div className='row'>
					<div className='col-6'>
						<button onClick={saveRecipe} className='btn btn-primary m-1'>Save recipe</button>
						<button onClick={updateRecipe} className='btn btn-primary m-1'>Update recipe</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Recipe

// https://irecommend.ru/sites/default/files/product-images/1398415/YE2pZJEJ71Mm5dtv3LWPg.jpg
// https://sun9-41.userapi.com/MI4rjKbAP9M05tzE4GXjGLq9d0wd2_agznLc2w/1pbkJLtMnbU.jpg
// http://klublady.ru/uploads/posts/2022-02/1645019230_14-klublady-ru-p-tort-zakher-foto-15.jpg
// https://balthazar.club/uploads/posts/2022-03/thumbs/1646148994_30-balthazar-club-p-morozhenoe-ptiche-moloko-31.jpg
// Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos quos in fugiat, voluptas tempore, maiores libero doloribus ad minima quaerat tenetur excepturi blanditiis hic odio esse a mollitia necessitatibus quo.

// {
//   name: 'Cakce',
//   ingredients: [
//     { id: 1, unit_name: 'pcs', quantity: '3' },
//     { id: 2, unit_name: 'l', quantity: '0.5' },
//     { id: 46, unit_name: 'l', quantity: '2' }
//   ],
//   equipments: [ { id: 4, quantity: '12' }, { id: 2, quantity: '12' } ],
//   description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos quos in fugiat, voluptas tempore, maiores libero doloribus ad minima quaerat tenetur excepturi blanditiis hic odio esse a mollitia necessitatibus quo.\n' +
//     'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos quos in fugiat, voluptas tempore, maiores libero doloribus ad minima quaerat tenetur excepturi blanditiis hic odio esse a mollitia necessitatibus quo.\n' +
//     'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos quos in fugiat, voluptas tempore, maiores libero doloribus ad minima quaerat tenetur excepturi blanditiis hic odio esse a mollitia necessitatibus quo.\n',
//   imgURL: 'https://irecommend.ru/sites/default/files/product-images/1398415/YE2pZJEJ71Mm5dtv3LWPg.jpg'
// }