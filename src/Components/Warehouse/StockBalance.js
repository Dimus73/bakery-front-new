import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoader } from "../../redux/action";
import { useNavigate } from "react-router-dom";
import { setIngredientsListToMove } from "../../redux/action";
import './StockBalance.css';


const StockBalance = () => {
	const [stockList, setStockList] = useState([]);
	const user = useSelector ((state) => state.user);
	const dispatch = useDispatch ();
	const navigate = useNavigate();

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
			setStockList (dataJS);
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

	useEffect (() =>{
		const t = async () => {
			getIngredientsList();
		}
		t ();
	},[])

  console.log('Befor return', stockList);
	return (
		<div className="container">
				<h6 className=''>Stock balance</h6	>
			<div className="container  bg-white shadow-lg">
				<div className="p-5 ">
					<div className="row justify-content-md-center">
						<div className="scroll_div col-12 col-lg-8 mt-3 p-3">
							<table className="table">
								<thead   className='font-comfortaa'>
									<tr>
										<th className='col-1 text-center'>n</th>
										<th className='col-7 text-start'>ingredients</th>
										<th className='col-2 text-center'>quantity</th>
										<th className='col-2 text-center'>unit</th>
										<th className='col-2 text-center'>cost</th>
									</tr>
								</thead>
								<tbody className='font-roboto'>
									{stockList.map ((item, i) => <TableRows item={item} i={i}/> )}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div className="row justify-content-md-center text-end pb-4 pe-5">
					<div className="col-12 col-lg-8">
						<button className="btn btn-outline-danger" onClick={()=>(navigate(-1))}>Close</button>
					</div>
				</div>
			</div>
		</div>
	)
}

const TableRows = (props) => {
	return(
		<tr key={props.i}>
			<td className='col-1 text-center'>{props.i+1}</td>
			<td className='col-1 text-start'>{ props.item.name }</td>
			<td className='col-1 text-center'>{ props.item.qountity }</td>
			<td className='col-1 text-center'>{ props.item.unit_name }</td>
			<td className='col-1 text-center'>{ props.item.costt.toFixed(2) }</td>
		</tr>
	)
}

export default StockBalance

