import { useState, useEffect } from "react";
import {useDispatch , useSelector } from "react-redux";
import { setLoader } from "../../redux/action";
import { useNavigate } from "react-router-dom";
import { setIngredientsListToMove } from "../../redux/action";


const ResourcesUsed = (props) => {
	const [resource, setResource] = useState(
		{
			ingredients:[{}],
			equipments :[{}],
		}
		);
	const user = useSelector ((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// console.log('Resource props.id=>', props.id);
	const id = props.id;
	// const id=93;

	const getResource = async (id) => { 
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/task/resource/' + id
		
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
			console.log('Resource from DB=>', data, dataJS);
			if (data.ok) {
				setResource (dataJS);
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
		const t = async () => {
			getResource(id);
		}
		t ();
	},[])

	useEffect (() =>{
		const t = async () => {
			getResource(id);
		}
		t ();
	},[props.id])


	// **************** Call Pushes List
	const callPushesList = () => {
		dispatch (setIngredientsListToMove(resource.ingredients));
		// console.log('Weth send to dispatch=>',resource.ingredients );
		navigate ('/warehouse/purchase');
	}

	const callSpanList = () => {
		dispatch (setIngredientsListToMove(resource.ingredients));
		// console.log('Weth send to dispatch=>',resource.ingredients );
		navigate ('/warehouse/span');
	}

	return (
		<div className="container pt-3">
			<div className="row">
				<div className="row">
					<table className="table">
						<thead>
							<tr>
								<th className='col-1 text-center'>n</th>
								<th className='col-7 text-start'>ingredients</th>
								<th className='col-2 text-center'>stock</th>
								<th className='col-2 text-center'>quantity</th>
								<th className='col-2 text-center'>unit</th>
							</tr>
						</thead>
						<tbody>
							{resource.ingredients.map ((item, i) => <TableRows item={item} i={i} resource={'I'}/> )}
						</tbody>
					</table>
				</div>
				<div className="row ">
				  <div className="col text-start">
						<button className="btn btn-outline-danger" onClick={ callSpanList }>To production</button>
					</div>
					<div className="col text-end">
						<button className="btn btn-outline-danger" onClick={ callPushesList }>Purchase</button>
					</div>
				</div>

				<div className="row"> 
					<table className="table mt-3">
						<thead>
							<tr>
								<th className='col-1 text-center'>n</th>
								<th className='col-7 text-start'>Equipment</th>
								<th className='col-2 text-center'>quantity</th>
								<th className='col-2 text-center'>unit</th>
							</tr>
						</thead>
						<tbody>
							{resource.equipments.map ((item, i) => <TableRows item={item} i={i}  resource={'E'}/> )}
						</tbody>
					</table>
				</div>

			</div>
		</div>
	)
}

const TableRows = (props) => {
	return(
		<tr key={props.i}>
			<td className='col-1 text-center'>{props.i+1}</td>
			<td className='col-1 text-start'>{ props.item.resource }</td>
			{props.resource === 'I' ? <td className='col-1 text-center'>{ props.item.quantity_on_stock }</td> : ''}
			<td className='col-1 text-center'>{ props.item.quantity }</td>
			<td className='col-1 text-center'>{ props.item.unit_name }</td>
		</tr>
	)
}

export default ResourcesUsed

