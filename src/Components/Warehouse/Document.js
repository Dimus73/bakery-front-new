import { useState, useEffect } from 'react'
import { useSelector  } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import { emptyRecipe } from '../Recipe/EmptyRecipe';
import { EDIT_MODE, DOCUMENT_STATUS, DOCUMENT_TYPE} from './Constants'

// const EDIT_MODE ={
// 	CREATE : 'create',
// 	EDIT   : 'edit',
// 	VIEW   : 'view',
// }

// const DOCUMENT_STATUS = {
// 	DRAFT     : 'draft',
// 	COMPLETED : 'completed',
// }

// const DOCUMENT_TYPE = {
// 	PURCHASE : 'purchase',
// 	SPAN     : 'span' 
// }



const Document = (props) => {

	const tDate = new Date();
	const params = useParams();

	const blankDocument = {
		date:tDate.toISOString().split('T')[0],
		type : props.docType === DOCUMENT_TYPE.PURCHASE ? DOCUMENT_TYPE.PURCHASE : DOCUMENT_TYPE.SPAN, 
		status : DOCUMENT_STATUS.DRAFT,
		active : true,
	}
	
	const blankDocumentTable = {
			// id : 0,
			documentId : 0,
			ingredientId : '',
			quantity : 0,
			cost : 0,

			unit_name : '',
			totalCost : 0,
		}
	
	
	const [ingredientsList, setIngredientsList] = useState([{}]);

	const [editMode, setEditMode] = useState (EDIT_MODE.CREATE)
	// const docType = props.docType;

	const user = useSelector ( (state) =>(state.user) )
	
	const [document, setDocument] = useState({...blankDocument});

	const [documentList, setDocumentList] = useState([{...blankDocumentTable}])

	// console.log('PARAMS =>', params);
	// console.log('PROPS =>', props);
	const navigate = useNavigate();


// ---------------------------
// Function to read the list of available ingredients
// ---------------------------

	const getIngredientsList = async () => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/catalog/ingredients'

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
			console.log('Ingredients list:', data, dataJS);
			if (data.ok) {
				setIngredientsList (dataJS);
			} else {
				alert(`Error getting list of ingredients. Status: ${data.status}. Message: ${dataJS.msg}`)
			}
		} catch (error) {
			console.log(error);
			alert (`Error getting list of ingredients. Message: ${error}`)
		}
	}

	useEffect (() =>{
		const tt = async () => {
			await getIngredientsList ();
			if ('id' in params){
				await getDocument (params.id)
			}
		}
		tt ();

	},[])

	// ---------------------------
	// Function for getting task in edit mode
	// ---------------------------
	const getDocument = async (id) => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/warehouse/'+id

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
				resultJS.docDetail.push({...blankDocumentTable})
				setDocumentList ([...resultJS.docDetail])
				delete resultJS.docDetail;
				setDocument ({...resultJS})
			} else {
				alert(`Error getting Document. Status: ${result.status}. Message: ${resultJS.msg}`)
			}
		} catch (error) {
			console.log(error);
			alert (`Error getting Document. Message: ${error}`)		
		}

	}


	// ---------------------------
	// Function for saving a new task or update task
	// ---------------------------

	const saveNewDocument = async (mode, status) => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/warehouse'

	console.log('Mode, status', mode, status);

		const data = clearData(documentList)

	// 	// console.log('Client DATA to save', data, mode);
		if (documentDetailCheck ( data )) {
			const reqData = {
				// method : 'POST',
				method : mode === EDIT_MODE.CREATE ? 'POST' : 'PUT',
				headers:{
					'Content-type' : 'application/json',
					'Authorization' : 'Bearer ' + user.token
				},
				body : JSON.stringify({
					...document, 
					userId:user.userId, 
					docDetail:data,
					status,
				}),
			}
			console.log('Send data', {
				...document, 
				userId:user.userId, 
				docDetail:data,
				status,
			});
	
			try {
				const result = await fetch(URL, reqData);
				const resultJS = await result.json();
				// console.log('After saving data:', resultJS);
				if (result.ok){
					setEditMode(EDIT_MODE.EDIT);
					if (status === DOCUMENT_STATUS.DRAFT) {
						alert('Document saved successfully');
						navigate (-1);
					} else {
						alert('The document was successfully saved and completed');
						navigate (-1);
					}
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
	const clearData = (documentList) => {
		// console.log('TASK', task);
		const data = [...documentList];
		// console.log('DATA', data);
		const temp = data.filter((value) => 'id' in value)
		// console.log('TEMP', temp, data.taskList);
		
		return temp

	}


	// ---------------------------
	// Control data before sending it to the server
	// ---------------------------
	const documentDetailCheck = (documentDetail) => {
		if ( documentDetail.length === 0 ) {
			alert ('The document must contain at least one record')
			return false;
		}
		if (documentDetail.some((value) =>  isNaN(value.quantity) || Number(value.quantity) <=0 || isNaN(value.cost) || Number(value.cost) <=0 )){
			alert ('In the quantity and cost fields must be a number greater than zero')
			return false;
		}
		return true;
	}



	// ---------------------------
	// Callback function  called when a ingredient is selected
	// ---------------------------
	const choseIngredient = (e, i) => {

		const currentId = e.target.value;
		const currentIngredient = ingredientsList.filter ((value => value.id === Number(currentId)))

		documentList[i].ingredientId = currentId;
		// documentList[i].ingredientName = currentIngredient[0].name;
		documentList[i].unit_name = currentIngredient[0].unit_name; 	
			
		if (!('id' in documentList[i])){
			documentList[i].id=0;
		}
		if ( documentList.every (value => ('id' in value) ) ){
			documentList.push({...blankDocumentTable});
		}
		// console.log('After Chose ingredient LIST=>', documentList);
		setDocumentList([...documentList]);
	}

	// ---------------------------
	// Callback functions called when the quantity and cost to be changes
	// ---------------------------

	const changeTotal = (cost, quantity, i) =>{
		if ( !isNaN ( cost*quantity ) ){
			return cost*quantity
		}
		return
	}

	const changeQuantity = (e, i) =>{
		const currentQuantity = e.target.value;
		if ( !isNaN(currentQuantity) ){
			documentList[i].quantity = currentQuantity;
			documentList[i].totalCost = changeTotal ( documentList[i].cost, documentList[i].quantity ); 
			setDocumentList([...documentList]); 
		}
	}

	const changeCost = (e, i) =>{
		const currentQuantity = e.target.value;
		if ( !isNaN(currentQuantity) ){
			documentList[i].cost = currentQuantity;
			documentList[i].totalCost = changeTotal ( documentList[i].cost, documentList[i].quantity ); 
			setDocumentList([...documentList]); 
		}
	}


	// console.log('Before return', user, task);
	console.log('Before return Document =>', document);
	console.log('Before return Document LIST=>', documentList);

	return (
		<div className="container">
			<h1>Document</h1>
			<p>{JSON.stringify(documentList)}</p>
			{editMode === EDIT_MODE.CREATE ? <h3>Mode: CREATE</h3>
			:
			editMode === EDIT_MODE.EDIT ? <h3>Mode: EDIT</h3> 
			:
			<h1>VIEW daily task</h1> 
			}

			{document.type === DOCUMENT_TYPE.PURCHASE ? <h3>Document type: Purchase</h3> 
			:
			<h3>Document type: Span</h3> }

			{document.status === DOCUMENT_STATUS.DRAFT ? <h3>Document status: Draft</h3> 
			:
			<h3>Document status: Completed</h3> }

			<label htmlFor="taskDate">Choice the day</label>
			<input type="date" name='taskDate' value={document.date} 
				onChange={(e)=> setDocument({...document, date:e.target.value})}/>
			<div className='row'>
				<div className='col-6'>
					<div className='container'>
						<div className='row'>
							<div>
								<table className='table table-hover'>
									<thead>
										<tr>
											<th className='col-1'>No</th>
											<th className='col-4'>ingredient</th>
											<th className='col-1'>Unit</th>
											<th className='col-2 text-end'>Cost per one</th>
											<th className='col-2 text-end'>Quantity</th>
											<th className='col-2 text-end'>Total</th>
										</tr>
									</thead>
									<tbody>
											{documentList.map ((value,i) => <DocumentRow item={value} 
											ingredientsList = {ingredientsList} i={i} 
											choseIngredient = {choseIngredient} 
											changeQuantity  = {changeQuantity} 
											changeCost      = {changeCost}/>) }
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			{editMode === EDIT_MODE.CREATE ? <button className='btn btn-primary m-3' onClick={ () => saveNewDocument (editMode, DOCUMENT_STATUS.DRAFT) } >Save</button>
			:
			editMode === EDIT_MODE.EDIT ? <button className='btn btn-primary m-3' onClick={ () => saveNewDocument (editMode, DOCUMENT_STATUS.DRAFT) } >Update</button> 
			:
			<h4>Task is in work. View mode</h4> 
			}
			<button className='btn btn-primary m-3' onClick={ () => saveNewDocument (EDIT_MODE.EDIT, DOCUMENT_STATUS.COMPLETED) } >Save & Completed</button>
			<button className='btn btn-primary m-3' onClick={ () => navigate(-1) } >Close</button> 
		</div>
	)
}


const DocumentRow = (props) => {
	return (
		<tr key={props.i} >
			<td className="col-1" >{props.i+1}</td>
			<td className="col-4" >
				<select name="ingredientId" id="" value={props.item.ingredientId} onChange={(e) => props.choseIngredient(e,props.i)} >
					<option value="" disabled selected ></option>
						{props.ingredientsList.map ( ( value,i ) => 
								<option key={i} value={value.id} >{value.name}</option>)}
				</select>
			</td>
			<td className="col-1" >
				{props.item.unit_name}
			</td>
			<td className='col-2'>
				<input  className='text-end w-100' type="text" name="cost" value={props.item.cost} onChange={(e) => props.changeCost (e, props.i)} /> 
			</td>
			<td className='col-2'>
				<input  className='text-end w-100' type="text" name="quantity" value={props.item.quantity} onChange={(e) => props.changeQuantity (e, props.i)} /> 
			</td>
			<td className="col-2 text-end" >
				{props.item.totalCost}
			</td>
		</tr>
	)
}

export default Document



// SELECT
// 	i."id", 
// 	i."name", 
// 	COALESCE (sum( CASE WHEN b.type = 'span' 
// 	THEN
// 		-a.quantity
// 	ELSE
// 		a.quantity
// END), 0) AS qountity, 
// 	COALESCE (sum ( CASE WHEN b.type = 'span'
// 	THEN 
// 	  -a.quantity*a.cost
// 	ELSE
// 		a.quantity*a.cost
// 	END)
// 	 / 
// 	sum( CASE WHEN b.type = 'span' 
// 	THEN
// 		-a.quantity
// 	ELSE
// 		a.quantity
// END), 0) AS costt
// FROM
// 	ingredients AS i
// 	LEFT JOIN
// 	warehouse_detail AS "a"
// 	ON 
// 		i."id" = "a".ingredient_id
// 	LEFT JOIN
// 	warehouse AS b
// 	ON 
// 		"a".warehouse_id = b."id"
// GROUP BY
// 	i."name", 
// 	i."id"
// ORDER BY name