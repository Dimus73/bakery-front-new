import { useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { FieldCheck } from '../../Utils/Fieldcheck';
import './Ingredients.css';
import { Button, Modal } from 'react-bootstrap'

const BASE_URL = process.env.REACT_APP_BASE_URL;
const URL = BASE_URL + '/api/catalog/';
const URL_Equipment = 'equipment';


const Equipment = () =>{
	const [equipments, setEquipments] =useState([]);
	const [equipmentsFiltered, setEquipmentsFiltered] =useState([]);
	const [currentItem, setCurrentItem] = useState({id:'', name:'', quantity:''});
	const [searchStr, setSearchStr] = useState('');

	const [showModal, setShowModal] = useState(false);

	const user = useSelector (state => state.user)

	const getRequest = (URL, toDo) => {
		const reqData = {
			method: "GET",
			headers:{
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			},
		}

		fetch(URL, reqData)
		.then(data =>  {
			// console.log('From Get:', data);
			if (!data.ok) {
				throw new Error (`Error getting data. Status ${data.status}. Message `)
			}
			return data.json()
		})
		.then(data => {
			toDo(data)
		})
		.catch((err) => {
			alert ('There was a communication error with the server while reading data. Check server operation and try again.')
			console.log('getRequest ERROR:', err);
		})
	}

	
	useEffect(()=>{
		getRequest(URL+URL_Equipment, setEquipments);
	}, []);

	useEffect (() =>{
			setEquipmentsFiltered (equipments.filter((value) => 
									searchStr ? value.equipment.toLowerCase().indexOf( searchStr.toLowerCase() ) !== -1 : true))
	}, [equipments, searchStr])	

// ----------------------------------------------
// Data validation before saving
// ----------------------------------------------
	const dataValidation = (name, quantity) => {
		if (!FieldCheck(name)) {
			alert ("The field contains an invalid word. Please don't use words: ['SELECT', 'INSERT', 'DELETE', 'UPDATE']")
		} else if (!name){
			alert ("The Ingredient field cannot be empty")
		} else if (!quantity){
			alert ("The Quantity field cannot be empty")
		} else {
			return true;
		}		
		return false;
	}

// ----------------------------------------------
// Name validation before saving
// ----------------------------------------------
	const nameAddValidation = (name) => {
		if ( equipments.some ((value) => (value.equipment.toLowerCase() === name.toLowerCase())) ){
			alert ("This ingredient is already in the database. Duplicate ingredients are not allowed.")
		} else {
			return true;
		}		
		return false;
	}

// ----------------------------------------------
// Name validation before update
// ----------------------------------------------
const nameUpdateValidation = (id, name) => {
		if ( equipments.some ((value) => (value.equipment.toLowerCase() === name.toLowerCase() && value.id !== id)) ){
			alert ("This ingredient is already in the database. Duplicate ingredients are not allowed.")
		} else {
			return true;
		}		
		return false;
	}

// ----------------------------------------------
// Function for adding an equipment
// ----------------------------------------------
	const addEquipment = (e) =>{
		e.preventDefault();

		const equipment = e.target.elements.equipment.value;
		const quantity = e.target.elements.quantity.value;
		console.log('From Add =>', equipment, quantity);
//Checking data for validity.
		if (dataValidation (equipment, quantity) && nameAddValidation (equipment) ) {
// Sending data to the server
			const reqData = {
				method: "POST",
				headers:{
					'Content-type' : 'application/json',
					'Authorization' : 'Bearer ' + user.token
				},
				body:JSON.stringify({
					equipment,
					quantity
				})
			}

			setCurrentItem ({id:'', equipment:'', quantity:'', active:false});

			fetch (URL+URL_Equipment, reqData)
			.then (data=> data.json())
			.then (data => {
				setEquipments(data)})
			.catch(err => {
				alert ('There was a communication error with the server while saving data. Check server operation and try again.')
				console.log("ERROR when saving data", err)
			})
		}
	}

// ----------------------------------------------
// Function for updating an equipment
// ----------------------------------------------
	const updateEquipment = (item) => {
		console.log('Update function =>', item);
		if ( dataValidation(item.equipment, item.quantity) && nameUpdateValidation(item.id, item.equipment) ){
			const reqData = {
				method : 'PUT',
				headers : {
					'Content-type':'application/json',
					'Authorization' : 'Bearer ' + user.token

				},
				body : JSON.stringify ({
					id : item.id,
					equipment : item.equipment,
					quantity : item.quantity,
					active : item.active
				})
			}

			setCurrentItem ({id:'', equipment:'', quantity:'', active:false});

			fetch (URL+URL_Equipment, reqData)
			.then (data => data.json())
			.then (data => setEquipments(data)) 
			.catch((err) => {
				alert ('There was a communication error with the server while saving data. Check server operation and try again.')
				console.log('getRequest ERROR:', err);
			})
	
		} else {
			console.log('Not valid. currentItem =>', currentItem);
		}

	}
// ----------------------------------------------
// Function for Cancel update an equipment
// ----------------------------------------------
	const cancelUpdate = () => {
		setCurrentItem ({id:'', equipment:'', quantity:0});
	}
// ----------------------------------------------
// Push Edit button (update an ingredient)
// ----------------------------------------------
	const pushEditButton = (item) => {
		setCurrentItem ({id : item.id, equipment : item.equipment, quantity : item.quantity, active : item.active})
	}

	// console.log('ingredientsFiltered =>', ingredientsFiltered);

	const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = (e) => {
		e.preventDefault();
    setShowModal(true);
  };


	return (
	<div className='container'>
		<h3 className=''>Catalog | Equipment</h3	>
		<div className='container '>
			<div className='row justify-content-md-center'>
				<div className='col-6'>
					<form action="">
						<input type="text" value={searchStr} onChange={(e) => setSearchStr(e.target.value)} placeholder='Enter to filter'/>
						<button onClick={(e) => { e.preventDefault(); setSearchStr('') }} >Clear</button>
						<button onClick={handleShowModal}>modal</button>
					</form>
				</div>
			</div>
			<div className='row justify-content-md-center'>
				<div className=' col-8 mt-3 p-3' >
					<div className='scroll_div'>
						<table className='table table-primary'>
							<thead>
								<tr>
									<td>Equipment</td>
									<td>Quantity</td>
									<td></td>
									<td></td>
								</tr>
							</thead>
							<tbody>
								{equipmentsFiltered.map((value,i) => <GetEquipment item={value} editButton = {pushEditButton} i={i} updateIngredient = {updateEquipment}/>)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		<div>
		</div >
			<div className='row justify-content-md-center'>
				<div className='form-box col-6 mt-3 p-3'>
					{currentItem.equipment ?
						<UpdateForm item = {currentItem} updateEquipment={updateEquipment} cancelUpdate={cancelUpdate} />
						:
						<AddForm item = {currentItem} addEquipment={addEquipment} />
					}
				</div>
			</div>
		</div>
		<Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Модальное окно</Modal.Title>
        </Modal.Header>
        <Modal.Body>Содержимое модального окна</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Сохранить изменения
          </Button>
        </Modal.Footer>
      </Modal>

	</div>
	)
}


const GetEquipment = (props) => {
	return(
		<tr key={props.i}>
			<td>{props.item.equipment}</td>
			<td>{props.item.quantity}</td>
			<td><button onClick={() => props.editButton (props.item)}>Edit</button></td>
			<td><button onClick={() => props.updateIngredient ({...props.item, active:false}) }>Deactivate</button></td>
		</tr>
	)
}


const AddForm = (props) => {
	const [currentItem, setCurrentItem] = useState({})

	useEffect (()=>{
		setCurrentItem({id:props.item.id, 
			equipment:props.item.equipment, 
			quantity:props.item.quantity})	
	},[props.item])	
		
	return (
		<>
			<div>Add new equipment:</div>
			<form onSubmit={props.addEquipment} action="">
				<label htmlFor="equipment">Equipment:</label>
				<input onChange={(e) => setCurrentItem ({...currentItem, equipment:e.target.value}) }
							type="text" name='equipment'  value = {currentItem.equipment}/>
				<label htmlFor="quantity">Quantity:</label>
				<input onChange={(e) => setCurrentItem ({...currentItem, quantity:e.target.value}) }
							name='quantity' value = {currentItem.quantity} />
				<button type='submit'>Add</button>
			</form>
		</>
	)
}

const UpdateForm = (props) => {
	const [currentItem, setCurrentItem] = useState({})

	useEffect (()=>{
		setCurrentItem({
			id : props.item.id, 
			equipment : props.item.equipment, 
			quantity : props.item.quantity,
			active : props.item.active
		})	
	},[props.item])																								

	return (
	<>
		<div>`Edit equipment: {props.item.equipment}` </div>
		<form action="" className='form'>
			<label htmlFor="equipment">Ingredient:</label>
			<input onChange={(e) => setCurrentItem ({...currentItem, equipment:e.target.value}) }
							type="text" name='equipment'  value = {currentItem.equipment}/>
			<label htmlFor="quantity">Unit:</label>
			<input onChange={(e) => setCurrentItem ({...currentItem, quantity:e.target.value}) }
							name='quantity' value = {currentItem.quantity} />
			<button onClick={(e) => {
				e.preventDefault();
				props.updateEquipment(currentItem);} }>Update</button> 
			<button onClick={(e) => {
				e.preventDefault();
				props.cancelUpdate ();}}>Cancel</button> 
		</form>
	</>
	)
}



	export default Equipment
