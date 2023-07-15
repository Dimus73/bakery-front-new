import { useState, useEffect } from 'react'
import { useDispatch, useSelector  } from 'react-redux'
import { setLoader } from '../../redux/action';
import { setIngredientsListToMove } from '../../redux/action';
import { useNavigate, useParams } from "react-router-dom";
import { emptyRecipe } from '../Recipe/EmptyRecipe';
import { EDIT_MODE, DOCUMENT_STATUS, DOCUMENT_TYPE} from './Constants'
import './Document.css'



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
			stock : 0,
			stockCost : 0,

			unit_name : '',
			totalCost : 0,
		}
	
	
	const [ingredientsList, setIngredientsList] = useState([{}]);

	const [editMode, setEditMode] = useState (EDIT_MODE.CREATE)
	// const docType = props.docType;

	const user = useSelector ( (state) =>(state.user) );
	const incomingList = useSelector ( state => state.ingredientsForMove);

	
	const [document, setDocument] = useState({...blankDocument});

	const [documentList, setDocumentList] = useState([{...blankDocumentTable}])

	// console.log('PARAMS =>', params);
	// console.log('PROPS =>', props);
	const navigate = useNavigate();
	const dispatch = useDispatch();


// ---------------------------
// Function to read the list of available ingredients
// ---------------------------

	const getIngredientsList = async () => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		// const URL = BASE_URL + '/api/catalog/ingredients'
		const URL = BASE_URL + '/api/warehouse/ingrdetail'

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
			console.log('Ingredients list:', data, dataJS);
			if (data.ok) {
				setIngredientsList (dataJS);
				return dataJS;
			} else {
				alert(`Error getting list of ingredients. Status: ${data.status}. Message: ${dataJS.msg}`)
			}
		} catch (error) {
			dispatch ( setLoader (false) );
			console.log(error);
			alert (`Error getting list of ingredients. Message: ${error}`)
		}
	}


// ---------------------------
// Function to convert incoming list to list of ingredients to pushes 
// ---------------------------

	const convertIncoming = (inList, ingredients) => {
		console.log('In convertIncoming',inList, ingredients);
		const tempList = inList.map ((value) => {
			const curIngredient = ingredients.filter ((item) => value.ingredient_id === item.id) 
			// console.log('In Filter=>', value, curIngredient[0]);
			return ({
				id           : 0,
				documentId   : 0,
				ingredientId : curIngredient[0].id,
				cost         : ((document.type === DOCUMENT_TYPE.SPAN) ? curIngredient[0].costt : 0).toFixed(2),
				quantity     : ((document.type === DOCUMENT_TYPE.SPAN) ? value.quantity : (value.quantity - value.quantity_on_stock)).toFixed(2) ,
				stock        : curIngredient[0].qountity.toFixed(2),
				stockCost    : (curIngredient[0].costt).toFixed(2),
				unit_name    : curIngredient[0].unit_short_name,
				totalCost    : (value.quantity* ((document.type === DOCUMENT_TYPE.SPAN) ? curIngredient[0].costt : 0)).toFixed(2),	

				// totalCost = changeTotal ( documentList[i].cost, documentList[i].quantity
			})
		})
		console.log('TempList =>',tempList);
		return tempList;
	} 

	useEffect (() =>{
		const tt = async () => {
			const tempIngredients = await getIngredientsList ();
			if ('id' in params){
				await getDocument (params.id)
			}
			// console.log('ingredientsForMove =>', incomingList);
			if ( incomingList.length > 0 ) {
				setDocumentList ( convertIncoming (incomingList, tempIngredients) );
				dispatch (setIngredientsListToMove([]));
			}
		}
		tt ();
	},[])

	// ---------------------------
	// Function for getting document in edit mode
	// ---------------------------
	const getDocument = async (id) => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/warehouse/document/'+id

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
				resultJS.docDetail.push({...blankDocumentTable})

				setDocumentList ([...resultJS.docDetail])
				delete resultJS.docDetail;
				setDocument ({...resultJS})
			} else {
				alert(`Error getting Document. Status: ${result.status}. Message: ${resultJS.msg}`)
			}
		} catch (error) {
			dispatch ( setLoader (false) );
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
				dispatch ( setLoader (true) );
				const result = await fetch(URL, reqData);
				const resultJS = await result.json();
				dispatch ( setLoader (false) );
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
				dispatch ( setLoader (false) );
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

		console.log('In check DATA', documentDetail);

		if ( documentDetail.length === 0 ) {
			alert ('The document must contain at least one record')
			return false;
		}
		if ( document.type === DOCUMENT_TYPE.SPAN) {
			if (documentDetail.some((value) =>  isNaN(value.quantity) || Number(value.quantity) <=0 || isNaN(value.cost) || Number(value.cost) ===0 )){
				alert ('In the quantity and cost fields must be a number greater than zero')
				return false;
			}
		} else {
			if (documentDetail.some((value) =>  isNaN(value.quantity) || Number(value.quantity) <=0 || isNaN(value.cost) || Number(value.cost) <= 0 )){
				alert ('In the quantity and cost fields must be a number greater than zero')
				return false;
			}
			if (documentDetail.some ((value) => (document.status != DOCUMENT_STATUS.DRAFT) && (value.stock < 0 || value.stock < value.quantity) ) ) {
				alert('There is not enough ingredient in stock. Please replenish stock before transfer to production')
				return false
			}
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
		documentList[i].unit_name = currentIngredient[0].unit_short_name; 	
		documentList[i].stock = currentIngredient[0].qountity; 	
		documentList[i].stockCost = currentIngredient[0].costt.toFixed(2); 	
		if ( document.type === DOCUMENT_TYPE.SPAN) {
			// console.log('In span document', documentList[i].cost, documentList[i].quantity);
			documentList[i].cost = currentIngredient[0].costt
			documentList[i].totalCost = changeTotal ( documentList[i].cost, documentList[i].quantity ).toFixed(2);
		}	
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
			documentList[i].totalCost = changeTotal ( documentList[i].cost, documentList[i].quantity ).toFixed(2); 
			setDocumentList([...documentList]); 
		}
	}

	const changeCost = (e, i) =>{
		const currentQuantity = e.target.value;
		if ( !isNaN(currentQuantity) ){
			documentList[i].cost = currentQuantity;
			documentList[i].totalCost = changeTotal ( documentList[i].cost, documentList[i].quantity ).toFixed(2); 
			setDocumentList([...documentList]); 
		}
	}


	// console.log('Before return', user, task);
	console.log('Before return Document =>', document);
	console.log('Before return Document LIST=>', documentList);

	return (
		<div className='container'>
				{editMode === EDIT_MODE.CREATE ? <h6>Document Mode: CREATE</h6>
				:
				editMode === EDIT_MODE.EDIT ? <h6>Document Mode: EDIT</h6>
				:
				<h6>Document VIEW daily task</h6>
				}
			<div className="container  bg-white shadow-lg">

				<div className="row justify-content-md-center font-comfortaa">
					<div className='col-12 col-lg-8 mt-3 p-3'>
						<div  className='row'>
							<div className='col'>
								{document.type === DOCUMENT_TYPE.PURCHASE ? <label>Type: Purchase</label>
								:
								<label>Document type: Span</label> }
							</div>
							
							<div className='col'>
								{document.status === DOCUMENT_STATUS.DRAFT ? <label>Status: Draft</label>
								:
								<label>Document status: Completed</label> }
							</div>
							
							<div className='col'>
								<label htmlFor="taskDate">Date</label>
								<input type="date" name='taskDate' value={document.date}
									onChange={(e)=> setDocument({...document, date:e.target.value})}/>
							</div>
						</div>
					</div>
				</div>
				
				
				<div className='row justify-content-md-center'>
					<div className='col-12 col-lg-8 mt-3 p-3'>
						<div className='p-3'>
									<table className='table table-hover'>
										{document.type === DOCUMENT_TYPE.PURCHASE ?
										(<>
											<thead className='font-comfortaa'>
												<tr>
													<th className='col-1'>n</th>
													<th className='col-4'>ingredient</th>
													<th className='col-1'>unit</th>
													<th className='col-2 text-end'>cost per one</th>
													<th className='col-2 text-end'>quantity</th>
													<th className='col-2 text-end'>total</th>
												</tr>
											</thead>
											<tbody className='font-roboto'>
													{documentList.map ((value,i) => <DocumentRowPurchase item={value}
													ingredientsList = {ingredientsList} i={i}
													choseIngredient = {choseIngredient}
													changeQuantity  = {changeQuantity}
													changeCost      = {changeCost}/>) }
											</tbody>
										</>)
										:
										(<>
											<thead className='font-comfortaa'>
												<tr>
													<th className='col-1'>n</th>
													<th className='col-4'>ingredient</th>
													<th className='col-1'>unit</th>
													<th className='col-1 text-end'>cost</th>
													<th className='col-1 text-end'>stock</th>
													<th className='col-1 text-end'>quantity</th>
													<th className='col-1 text-end'>total</th>
												</tr>
											</thead>
											<tbody className='font-roboto'>
													{documentList.map ((value,i) => <DocumentRowSpan item={value}
													ingredientsList = {ingredientsList} i={i}
													choseIngredient = {choseIngredient}
													changeQuantity  = {changeQuantity}
													changeCost      = {changeCost}/>) }
											</tbody>
										</>)
											}
									</table>
						</div>
					</div>
				</div>
			
				<div className="row justify-content-md-center">
					<div className='col-12 col-lg-8 mt-3 p-3'>
						<div className='row'>
							<div className='col text-end'>
								{editMode === EDIT_MODE.CREATE ? <button className='btn  btn-outline-danger m-3' onClick={ () => saveNewDocument (editMode, DOCUMENT_STATUS.DRAFT) } >Save</button>
								:
								editMode === EDIT_MODE.EDIT ? <button className='btn  btn-outline-danger m-3' onClick={ () => saveNewDocument (editMode, DOCUMENT_STATUS.DRAFT) } >Update</button>
								:
								<h4>Task is in work. View mode</h4>
								}
							</div>
							<div className='col-4 text-start'>
								<button className='btn  btn-outline-danger m-3' onClick={ () => saveNewDocument (editMode, DOCUMENT_STATUS.COMPLETED) } >Save & Completed</button>
							</div>
							<div className='col-2 text-end'>
								<button className='btn btn-outline-danger m-3' onClick={ () => navigate(-1) } >Close</button>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	)
}


const DocumentRowPurchase = (props) => {
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

const DocumentRowSpan = (props) => {
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
			<td className="col-1" >
				{props.item.stockCost}
			</td>
			<td className="col-1" >
				{props.item.stock}
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