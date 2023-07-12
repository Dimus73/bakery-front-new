import { useState, useEffect } from 'react'
import { useSelector, useDispatch  } from 'react-redux'
import { setLoader } from '../../redux/action';
import { useNavigate, useParams } from "react-router-dom";
import { emptyRecipe } from '../Recipe/EmptyRecipe';
import  ResourcesUsed  from './ResourcesUsed';
import './CreateTask.css';


const emptyTask = {
	taskId : 0,
	recipeId : '',
	recipeName : '',
	quantityInRecipe : 0,
	unit_name : "",
	quantity : '',
	totalQuantity : 0,
	inWork : false,
	isReady : false
}

const EDIT_MODE ={
	CREATE : 'create',
	EDIT : 'edit',
	VIEW : 'view',
}

const CreateTask = () => {

	// const [taskList, setTaskList] = useState( [ {...emptyTask} ] );

	const [recipeList, setRecipeList] = useState([{}]);

	const [editMode, setEditMode] = useState (EDIT_MODE.CREATE)

	const user = useSelector ( (state) =>(state.user) )
	const dispatch = useDispatch ();
	const tDate = new Date()
	
	const [task, setTask] = useState({
		id : 0,
		date : tDate.toISOString().split('T')[0],
		inWork : false,
		isReady : false,
		user_id : user.userId,
		taskList : [{...emptyTask}]
	});

	const params = useParams();
	// console.log('PARAMS =>', params);
	const navigate = useNavigate();


// ---------------------------
// Function to read the list of available recipes
// ---------------------------

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
			dispatch ( setLoader (true) );
			const data = await fetch(URL, reqData);
			const dataJS = await data.json();
			dispatch ( setLoader (false) );
			// console.log(data, dataJS);
			if (data.ok) {
				setRecipeList (dataJS);
			} else {
				alert(`Error getting list of recipes. Status: ${data.status}. Message: ${dataJS.msg}`)
			}
		} catch (error) {
			dispatch ( setLoader (false) );
			console.log(error);
			alert (`Error getting list of recipes. Message: ${error}`)
		}
	}

	useEffect (() =>{

		const tt = async () => {
			await getRecipeList ();
			if ('id' in params){
				await getTask (params.id)
			}
		}
		tt ();

	},[])

	// ---------------------------
	// Function for getting task in edit mode
	// ---------------------------
	const getTask = async (id) => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/task/'+id

		const reqData = {
			method : 'GET',
			headers:{
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			},
		}

		try {
			dispatch ( setLoader (true) );
			const result = await fetch(URL, reqData);
			const resultJS = await result.json();
			dispatch ( setLoader (false) );
			if (result.ok){
				setEditMode(EDIT_MODE.EDIT);
				// console.log('DATE :', resultJS.date);
				const tDate = new Date(resultJS.date)

				const year = tDate.getFullYear();
				const month = String(tDate.getMonth() + 1).padStart(2, '0');
				const day = String(tDate.getDate()).padStart(2, '0');
				const formattedDate = `${year}-${month}-${day}`;
				
				const options = {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					timeZone: 'Asia/Jerusalem'
				};
				// resultJS.date = tDate.toLocaleString('en-US', options);
				// resultJS.date = tDate.toISOString().split('T')[0];
				resultJS.date = formattedDate;
				resultJS.user_id = user.userId
				
				resultJS.taskList.push ({});
				// console.log('resultJS0', resultJS);
				setTask ({...resultJS})
			} else {
				alert(`Error getting list of recipes. Status: ${result.status}. Message: ${resultJS.msg}`)
			}
		} catch (error) {
			dispatch ( setLoader (false) );
			console.log(error);
			alert (`Error getting list of recipes. Message: ${error}`)		
		}

	}


	// ---------------------------
	// Function for saving a new task or update task
	// ---------------------------

	const saveNewTask = async (mode) => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/task'

		// console.log('No CLEANER DATA to save', task);

		const data = clearData(task)

		// console.log('Client DATA to save', data, mode);
		if (taskDataCheck ( data )) {
			const reqData = {
				method : mode === EDIT_MODE.CREATE ? 'POST' : 'PUT',
				headers:{
					'Content-type' : 'application/json',
					'Authorization' : 'Bearer ' + user.token
				},
				body : JSON.stringify(data),
			}
	
			try {
				dispatch ( setLoader (true) );
				const result = await fetch(URL, reqData);
				const resultJS = await result.json();
				dispatch ( setLoader (false) );
				// console.log('After saving data:', resultJS);
				if (result.ok){
					// console.log('After saving data:', resultJS);
					setEditMode(EDIT_MODE.EDIT);
	
					const tDate = new Date(resultJS.date)
					resultJS.date = tDate.toISOString().split('T')[0];
					resultJS.user_id = user.userId
					resultJS.taskList.push ({});
					// console.log('resultJS0', resultJS);
					setTask ({...resultJS})
	
				} else {
					alert(`Error getting list of recipes. Status: ${result.status}. Message: ${resultJS.msg}`)
				}
	
			} catch (error) {
				dispatch ( setLoader (false) );
				console.log(error);
				alert (`Error getting list of recipes. Message: ${error}`)		
			}
	
		}

	}

	// ---------------------------
	// Clearing data before sending it to the server
	// ---------------------------
	const clearData = (task) => {
		// console.log('TASK', task);
		const data = {...task};
		console.log('DATA', data);
		const temp = data.taskList.filter((value) => 'id' in value)
		// console.log('TEMP', temp, data.taskList);
		data.taskList = data.taskList.filter((value) => 'id' in value)

		return data

	}

	// ---------------------------
	// Control data before sending it to the server
	// ---------------------------
	const taskDataCheck = (data) => {
		if ( data.taskList.length === 0 ) {
			alert ('The task must contain at least one recipe')
			return false;
		}
		if (data.taskList.some((value) =>  isNaN(value.quantity) || Number(value.quantity) <=0 )){
			alert ('In the quantity field must be a number greater than zero')
			return false;
		}
		return true;
	}



	// ---------------------------
	// Callback function  called when a recipe is selected
	// ---------------------------
	const choseRecipe = (e, i) => {
		const currentId = e.target.value;
		const currentRecipe = recipeList.filter ((value => value.id === Number(currentId)))

		task.taskList[i].recipeId = currentId;
		task.taskList[i].recipeName = currentRecipe[0].name;
		task.taskList[i].unit_name = currentRecipe[0].unit_name; 	
		task.taskList[i].quantityInRecipe = currentRecipe[0].finish_quantity	
		if (!('id' in task.taskList[i])){
			task.taskList[i].id=0;
		}
		if ( task.taskList.every (value => ('id' in value) ) ){
			task.taskList.push({...emptyTask});
		}
		// console.log('On change', task);
		setTask({...task})
	}

	// ---------------------------
	// Callback function called when the quantity to be produced changes
	// ---------------------------
	const changeQuantity = (e, i) =>{
		const currentQuantity = e.target.value;
		if ( !isNaN(currentQuantity) ){
			task.taskList[i].quantity = currentQuantity;
			task.taskList[i].totalQuantity = Number ( currentQuantity ) * Number ( task.taskList[i].quantityInRecipe )
			setTask({...task}); 
		}

	}

	// ---------------------------
	// Callback function called to remove recipe from task
	// ---------------------------
	const removeRecipe = (e, i) => {
		task.taskList = task.taskList.filter ((value,index) => index !== i );
		setTask({...task}); 
	}


	// console.log('Before return', user, task);

	return (
		<div className="container">
			<div className='row'>
				{editMode === EDIT_MODE.CREATE ? <h6>CREATE daily task</h6>
				:
				editMode === EDIT_MODE.EDIT ? <h6>EDIT daily task</h6>
				:
				<h1>VIEW daily task</h1>
				}
			</div>
			<div className='row'>
				<div className='col-12 col-lg-6  font-comfortaa'>
					<div className='container  bg-white p-5 pb-3 pt-3 shadow-lg'>
						<div className='row text-start mt-3'>
							<div className='col'>
								<label class="form-label" htmlFor="taskDate">Date</label>
							</div>
							<div  className='col'>
								<input className='datepicker form-control' type="date" name='taskDate' value={task.date}
									onChange={(e)=> setTask({...task, date:e.target.value})}/>
							</div>
						</div>
						<div className='scroll_div pt-3 overflow-on'>
							<div>
								<table className='table table-hover'>
									<thead>
										<tr>
											<th className='col-1 text-center'>No</th>
											<th className='col-4'>recipe</th>
											<th className='col-2 text-center'>quan.</th>
											<th className='col-1 text-center'>unit</th>
											<th className='col-2 text-end'>repeat</th>
											<th className='col-2 text-end'>total</th>
											<th className='col-2'></th>
										</tr>
									</thead>
									<tbody>
											{task.taskList.map ((value,i) => <TaskRow item={value} recipeList={recipeList} i={i} choseRecipe={choseRecipe} changeQuantity={changeQuantity} removeRecipe={removeRecipe} />) }
									</tbody>
								</table>
							</div>
						</div>
						<div className='text-end'>
							{editMode === EDIT_MODE.CREATE ? <button className='btn btn-outline-danger m-3' onClick={ () => saveNewTask (EDIT_MODE.CREATE) } >Save</button>
							:
							editMode === EDIT_MODE.EDIT ? <button className='btn btn-outline-danger m-3' onClick={ () => saveNewTask (EDIT_MODE.EDIT) } >Update</button>
							:
							<h4>Task is in work. View mode</h4>
							}
							<button className='btn btn-outline-danger m-3' onClick={ () => navigate(`/task/list`) } >Close</button>
						</div>
						
					</div>
				</div>
				<div className='col-12 col-lg-6 font-comfortaa'>
					<div className='container  bg-white p-5 pb-3pt-3 shadow-lg'>
						<h6>Resources</h6>
						{ !(editMode === EDIT_MODE.CREATE) ? <ResourcesUsed id={task.id}/> : '' }
					</div>
				</div>
			</div>
		</div>
	)
}


const TaskRow = (props) => {
	return (
		<tr key={props.i} >
			<td className="col-1" >{props.i+1}</td>
			<td className="col-4" >
				<select name="recipeId" id="" value={props.item.recipeId} onChange={(e) => props.choseRecipe(e,props.i)} >
					<option value="" disabled selected ></option>
						{props.recipeList.map ( ( value,i ) => 
								<option key={i} value={value.id} >{value.name}</option>)}
				</select>
			</td>
			<td className="col-2 text-center" >
				{props.item.quantityInRecipe}
			</td>
			<td className="col-1 text-center" >
				{props.item.unit_name}
			</td>
			<td className='col-2'>
				<input  className='text-end w-100' type="text" name="quantity" value={props.item.quantity} onChange={(e) => props.changeQuantity (e, props.i)} /> 
			</td>
			<td className="col-2 text-center" >
				{props.item.totalQuantity}
			</td>
			<td className='align-middle text-center ' >
				<i className="bi bi-x-square" style={{'font-size': '1.3rem', color: "#BD302D"}}
					onClick={(e) => {props.removeRecipe (e, props.i) }}></i>
			</td>
		</tr>
	)
}

export default CreateTask