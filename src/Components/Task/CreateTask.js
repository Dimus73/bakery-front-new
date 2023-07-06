import { useState, useEffect } from 'react'
import { useSelector  } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import { emptyRecipe } from '../Recipe/EmptyRecipe';
import  ResourcesUsed  from './ResourcesUsed';


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
			const data = await fetch(URL, reqData);
			const dataJS = await data.json();
			// console.log(data, dataJS);
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
			const result = await fetch(URL, reqData);
			const resultJS = await result.json();
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
				const result = await fetch(URL, reqData);
				const resultJS = await result.json();
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

	// console.log('Before return', user, task);

	return (
		<div className="container">
			{editMode === EDIT_MODE.CREATE ? <h1>CREATE daily task</h1>
			:
			editMode === EDIT_MODE.EDIT ? <h1>EDIT daily task</h1> 
			:
			<h1>VIEW daily task</h1> 
			}
			<label htmlFor="taskDate">Choice the day</label>
			<input type="date" name='taskDate' value={task.date} 
				onChange={(e)=> setTask({...task, date:e.target.value})}/>
			<div className='row'>
				<div className='col-6'>
					<div className='container'>
						<div className='row'>
							<div>
								<table className='table table-hover'>
									<thead>
										<tr>
											<th className='col-1'>No</th>
											<th className='col-4'>Recipe</th>
											<th className='col-2'>Quantity in recipe</th>
											<th className='col-1'>Unit</th>
											<th className='col-2 text-end'>Task numbers</th>
											<th className='col-2'>Total</th>
										</tr>
									</thead>
									<tbody>
											{task.taskList.map ((value,i) => <TaskRow item={value} recipeList = {recipeList} i={i} choseRecipe={choseRecipe} changeQuantity={changeQuantity} />) }
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div className='col-6'>
					{ !(editMode === EDIT_MODE.CREATE) ? <ResourcesUsed id={task.id}/> : '' }
				</div>
			</div>
			
			{editMode === EDIT_MODE.CREATE ? <button className='btn btn-primary m-3' onClick={ () => saveNewTask (EDIT_MODE.CREATE) } >Save</button>
			:
			editMode === EDIT_MODE.EDIT ? <button className='btn btn-primary m-3' onClick={ () => saveNewTask (EDIT_MODE.EDIT) } >Update</button> 
			:
			<h4>Task is in work. View mode</h4> 
			}
			<button className='btn btn-primary m-3' onClick={ () => navigate(`/task/list`) } >Close</button>
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
			<td className="col-2" >
				{props.item.quantityInRecipe}
			</td>
			<td className="col-1" >
				{props.item.unit_name}
			</td>
			<td className='col-2'>
				<input  className='text-end w-100' type="text" name="quantity" value={props.item.quantity} onChange={(e) => props.changeQuantity (e, props.i)} /> 
			</td>
			<td className="col-2" >
				{props.item.totalQuantity}
			</td>
		</tr>
	)
}

export default CreateTask