import { useState, useEffect } from "react";
import { UseSelector, useSelector } from "react-redux";

const ResourcesUsed = (props) => {
	const [resource, setResource] = useState(
		{
			ingredients:[{}],
			equipments :[{}],
		}
		);
	const user = useSelector ((state) => state.user);
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
			const data = await fetch(URL, reqData);
			const dataJS = await data.json();
			// console.log(data, dataJS);
			if (data.ok) {
				setResource (dataJS);
			} else {
				alert(`Error getting list of recipes. Status: ${data.status}. Message: ${dataJS.msg}`)
			}
		} catch (error) {
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


	return (
		<div className="container">
			<div className="row">
				<h1>ResourcesUsed</h1>

				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Ingredients</th>
							<th>quantity</th>
							<th>unit</th>
						</tr>
					</thead>
					<tbody>
						{resource.ingredients.map ((item, i) => <TableRows item={item} i={i}/> )}
					</tbody>
				</table>

				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Equipment</th>
							<th>quantity</th>
							<th>unit</th>
						</tr>
					</thead>
					<tbody>
						{resource.equipments.map ((item, i) => <TableRows item={item} i={i}/> )}
					</tbody>
				</table>

			</div>
		</div>
	)
}

const TableRows = (props) => {
	return(
		<tr key={props.i}>
			<td>{props.i+1}</td>
			<td>{ props.item.resource }</td>
			<td>{ props.item.quantity }</td>
			<td>{ props.item.unit_name }</td>
		</tr>
	)
}

export default ResourcesUsed

