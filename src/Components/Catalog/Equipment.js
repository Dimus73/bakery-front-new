import { useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FieldCheck } from '../../Utils/Fieldcheck';
import './Ingredients.css';
import { Button, Modal } from 'react-bootstrap'
import { setLoader } from '../../redux/action';

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

	const dispatch = useDispatch();

	const getRequest = (URL, toDo) => {
		const reqData = {
			method: "GET",
			headers:{
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			},
		}
	
		dispatch (setLoader(true));
		fetch(URL, reqData)
		.then(data =>  {
			// console.log('From Get:', data);
			dispatch (setLoader(false));
			if (!data.ok) {
				throw new Error (`Error getting data. Status ${data.status}. Message `)
			}
			return data.json()
		})
		.then(data => {
			toDo(data)
		})
		.catch((err) => {
			dispatch (setLoader(false));
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
		<h6 className=''>Catalog | Equipment</h6	>
		<div className='container bg-white p-5 shadow-lg'>
			<div className='row font-comfortaa'>
			<div className='col-lg-2'></div>
				<div className='col-12 col-lg-4'>
						<form action="">
							<div className='row'>
								<div className='col-10'>
									<input className='form-control' type="text" value={searchStr} onChange={(e) => setSearchStr(e.target.value)} placeholder='Enter to filter'/>
								</div>
								<div className='col-1'>
									<i className="bi bi-x-square" style={{'font-size': '1.8rem', color: "#BD302D"}} onClick={(e) => { e.preventDefault(); setSearchStr('') }}></i>
								</div>
							</div>
						</form>
				</div>
			</div>
			<div className='row justify-content-md-center'>
				<div className=' col-12 col-lg-8 mt-3 p-3' >
					<div className='scroll_div'>
						<table className='table '>
							<thead  className='font-comfortaa'>
								<tr>
									<td>Equipment</td>
									<td>Quantity</td>
									<td></td>
									<td></td>
								</tr>
							</thead>
							<tbody className='font-roboto'>
								{equipmentsFiltered.map((value,i) => <GetEquipment item={value} editButton = {pushEditButton} i={i} updateIngredient = {updateEquipment}/>)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		<div>
		</div >
			<div className='row justify-content-md-start'>
			<div className='col-lg-2'></div>
			<div className='form-box col-12 col-lg-6 mt-3 p-3'>
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

			<td className='align-middle text-center ' >
				<i className="bi bi-pencil" style={{'font-size': '1.3rem', color: "#BD302D"}}
					onClick={() => props.editButton (props.item)}></i>
			</td>

			<td className='align-middle text-center ' >
				<i className="bi bi-x-square" style={{'font-size': '1.3rem', color: "#BD302D"}}
					onClick={() => props.updateIngredient ({...props.item, active:false}) }></i>
			</td>

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
			<div className='row'>
				<div>New</div>
			</div>
			<form className='font-comfortaa' onSubmit={props.addEquipment} action="">
				<div className='row justify-content-md-center' >
					<div className='col-7'>
						<input className='form-control' onChange={(e) => setCurrentItem ({...currentItem, equipment:e.target.value}) }
									type="text" name='equipment'  value = {currentItem.equipment} placeholder="Enter equipment"/>
					</div>
					<div className='col-3'>
						<input className='form-control' onChange={(e) => setCurrentItem ({...currentItem, quantity:e.target.value}) }
									name='quantity' value = {currentItem.quantity} />
					</div>
					<div  className='col-1'>
						<button  className='btn m-1 me-md-2 btn-outline-danger' type='submit'>Add</button>
					</div>
				</div>
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
		<div  className='row'>
			<div  className='font-comfortaa'>Edit equipment: {props.item.equipment}</div>
		</div>
		<form action="" className='form font-comfortaa'>
			<div className='row'>
				<div className='col-7'>
					<input className='form-control' onChange={(e) => setCurrentItem ({...currentItem, equipment:e.target.value}) }
									type="text" name='equipment'  value = {currentItem.equipment}/>
				</div>
				<div className='col-3'>
					<input  className='form-control' onChange={(e) => setCurrentItem ({...currentItem, quantity:e.target.value}) }
									name='quantity' value = {currentItem.quantity} />
				</div>

				<div className='col-1'>
					<i className="bi bi-save2" style={{'font-size': '1.3rem', color: "#BD302D"}}
						onClick={(e) => {
							e.preventDefault();
							props.updateEquipment(currentItem);} }></i>
				</div>

				<div className='col-1'>
					<i className="bi bi-x-square" style={{'font-size': '1.3rem', color: "#BD302D"}}
						onClick={(e) => {
							e.preventDefault();
							props.cancelUpdate ();}}></i>
				</div>

			</div>
		</form>
	</>
	)
}



	export default Equipment
