import { useState, useEffect } from 'react'
import { useSelector  } from 'react-redux'
import { useNavigate, Link  } from "react-router-dom";
import { DOCUMENT_STATUS, DOCUMENT_TYPE} from './Constants'



const DocumentList = () => {
	const user = useSelector (state => state.user);

	const tDate = new Date();
	const [ documentList, setDocumentList ] = useState ( [ { date:tDate.toISOString() } ] );
	const [ showList, setShowList ] = useState ( [ { date:tDate.toISOString() } ] );
	const [ showType, setShowType ] = useState ('All')
	const [ showStatus, setShowStatus ] = useState ('All')

	const getDocumentList = async () => {
		const BASE_URL = process.env.REACT_APP_BASE_URL;
		const URL = BASE_URL + '/api/warehouse';

		const reqData = {
			method : 'GET',
			headers:{
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			},
		}

		try {
			const data = await fetch (URL+'/?active=true', reqData);
			const dataJS = await data.json();
			console.log('GET List dataJS =>', dataJS);
			if (data.ok) {
				setDocumentList ( [...dataJS] );
				setShowList ( [...dataJS] );
			}
			else {
				console.log(`Error getting list of documents. Status: ${data.status}. Message: ${data.msg}`)
				alert(`Error getting list of documents. Status: ${data.status}. Message: ${dataJS.msg}`)
			} 
		} catch (error) {
			console.log(error);
			alert (`Error getting list of documents. Message: ${error}`)		

		}

	}

	useEffect (() => {
		const t = async () =>{
			await getDocumentList();
		}	
		t();
	},[]);

	useEffect (()=>{
		setShowList (
			documentList.filter ( (value) => 
			(showType === 'All' || value.type === showType) && 
			(showStatus === 'All' || value.status === showStatus))
		) 
	}, [showStatus , showType])

	// console.log('Document details:', documentList);
	// console.log('Status, type select', showStatus, showType);

	return (
		<div className='container'>
			<div className='row'>
				<div className='col'>
					<h1>Warehouse documents</h1>

					<label htmlFor="type">Show type:</label>
					<select name="type" id="" defaultValue={showType} onChange={(e)=>setShowType(e.target.value)}>
						<option value="All">All</option>
						<option value={DOCUMENT_TYPE.PURCHASE}>{DOCUMENT_TYPE.PURCHASE}</option>
						<option value={DOCUMENT_TYPE.SPAN}>{DOCUMENT_TYPE.SPAN}</option>
					</select>

					<label htmlFor="type">Show status:</label>
					<select name="status" id="" defaultValue={showStatus} onChange={(e)=>setShowStatus(e.target.value)}>
						<option value="All">All</option>
						<option value={DOCUMENT_STATUS.COMPLETED}>{DOCUMENT_STATUS.COMPLETED}</option>
						<option value={DOCUMENT_STATUS.DRAFT}>{DOCUMENT_STATUS.DRAFT}</option>
					</select>

				</div>
			</div>
			<div className='row '>
				<div className='col-8'>
					<div className='row'>
						<table>
							<thead>
								<tr>
								<th className=''>#</th>
								<th className=''>DATE</th>
									<th className='text-center'>type</th>
									<th className='text-center'>status</th>
								</tr>
							</thead>
							<tbody>
								{ showList.map ((value, i) => <DocumentLine item={value} i={i} /> )}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)

}

const DocumentLine = (props) => {
	const item = props.item;

	return (
		<tr key={props.i} >
			<td className={'col-1 '}>{item.id}</td>
			<td className={'col-4 '}>
			<Link to={'/warehouse/'+ item.id}>{item.date.split('T')[0]}</Link> 
			</td>
			<td className={'col-2 text-center '}>
				{item.type}
			</td>
			<td className={'col-2 text-center '}>
				{item.status}
			</td>
			<td>
				<Link to={'/task/'+item.id} >Edit</Link>
			</td>
		</tr>
	)
}

export default DocumentList;
