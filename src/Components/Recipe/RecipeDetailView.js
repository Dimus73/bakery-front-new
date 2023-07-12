import './RecipeDetailView.css'
import { useParams, useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import {emptyRecipe} from './EmptyRecipe'
import { useSelector, useDispatch } from 'react-redux';
import { setLoader } from '../../redux/action';

const RecipeDetailView = (props) => {

	const {id} = useParams();
	const [ recipe, setRecipe ] = useState(emptyRecipe);
	const user = useSelector (state => state.user)
	const dispatch = useDispatch ();
	const navigate = useNavigate() ;

	const  getRecipe = async (id) => {
		const BASE_URL = process.env.REACT_APP_BASE_URL;
		const URL = BASE_URL + '/api/recipe/'+id;
		const reqData = {
			method:'GET',
			headers : {
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			}
		}

		try {
			dispatch ( setLoader (true) );
			const data = await fetch(URL, reqData);
			const dataJS = await data.json();
			dispatch ( setLoader (false) );
			if (data.ok) {
				setRecipe (dataJS)
				console.log(dataJS);
				console.log('Call');
			}	
		} catch (error) {
			dispatch ( setLoader (false) );
			console.log(error);
			alert (`Error getting recipes detail. Message: ${error}`)
		}
	}

	const goBack = (i) => {
		navigate (-i);
	}

	useEffect (() => {
		getRecipe (id);
	},[])

	
	return (

		<div className='container 111 bg-white shadow-lg' >
			<div className='row pt-4'>
				<div className='col-6 ps-4'>
					<div className='border border-2' >
						<img className="img-fluid recipe-img" src={recipe.img} alt="" />
					</div>
					<h5 className='mt-4 font-comfortaa'  style={{color:"#BD302D"}}>description</h5>
					<p className='font-roboto'>{recipe.description}</p>
				</div>

				<div className='col-6 pe-4' >
					<div className='row border-bottom border-black'>
						<div className='col-8'>
							<h3 className='font-comfortaa'><strong>{recipe.name}</strong></h3>
						</div>
						<div className='col-4 text-end'>
							<h3 className='font-comfortaa'><strong>{recipe.finish_quantity}</strong><span> {recipe.unit_name}</span> </h3>
						</div>
					</div>


					<div className='row border-bottom border-black mt-4'>
						<div>
							<table className='table table-hover table-borderless'>
								<thead className='font-comfortaa' >
									<tr >
										<th className='col-1'  style={{color:"#BD302D"}}><h5>No.</h5></th>
										<th className='col-7 text-start' style={{color:"#BD302D"}}><h5>ingredients</h5></th>
										<th className='col-2 text-end' style={{color:"#BD302D"}}><h5>quantity</h5></th>
										<th className='col-2 text-end' style={{color:"#BD302D"}}><h5>units</h5></th> 
									</tr>	
								</thead>
								<tbody className='font-roboto'>
									{ recipe.ingredients.map ((value, i) =>{
										return (
											<tr key={i}>
												<td>{i+1}.</td>
												<td>{value.ingredients_name}</td>
												<td className='text-end'>{value.quantity}</td>
												<td className='text-end'>{value.unit_name}</td>
											</tr>
										)
									})
									}
								</tbody>
							</table>
						</div>
					</div>

					<div className='row border-bottom border-black mt-4'>
						<div>
							<table className='table table-hover table-borderless'>
								<thead className='font-comfortaa' >
									<tr >
										<th className='col-1'  style={{color:"#BD302D"}} ><h5>No.</h5></th>
										<th className='col-7 text-start' style={{color:"#BD302D"}}><h5>equipment</h5></th>
										<th className='col-2 text-end' style={{color:"#BD302D"}}><h5>time</h5></th>
										<th className='col-2 text-end' style={{color:"#BD302D"}}><h5>units</h5></th> 
									</tr>	
								</thead>
								<tbody className='font-roboto'>
									{ recipe.equipments.map ((value, i) =>{
										return (
											<tr key={i}>
												<td >{i+1}.</td>
												<td>{value.equipment_name}</td>
												<td className='text-end'>{value.quantity}</td>
												<td className='text-end'>min</td>
											</tr>
										)
									})
									}
								</tbody>
							</table>
						</div>
					</div>
					<div className='d-grid gap-2 d-md-flex justify-content-md-end pb-4'>
						<button type="button" class="btn btn-danger mt-4 btn-lg" onClick={() =>goBack(1)}>Close</button>
					</div>
				</div>
			</div>
		</div>
	)

}

export default RecipeDetailView;