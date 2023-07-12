import { useState, useEffect } from 'react'
import { useSelector, useDispatch  } from 'react-redux';
import { setLoader } from '../../redux/action';
import { useNavigate, Link  } from "react-router-dom";
import { DOCUMENT_STATUS, DOCUMENT_TYPE} from './Constants'



const DocumentList = () => {
	const user = useSelector (state => state.user);
	const dispatch = useDispatch ();
	const navigate = useNavigate ();

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
			dispatch ( setLoader (true) );
			const data = await fetch (URL+'/?active=true', reqData);
			const dataJS = await data.json();
			dispatch ( setLoader (false) );
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
			dispatch ( setLoader (false) );
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
			<h6>Warehouse documents</h6>
			<div className="container  bg-white shadow-lg">

				<div className="row justify-content-md-center">
					<div className='col-12 col-lg-8 mt-3 p-3'>
							<div className='row'>
								<div className=' col'>
									<div className='row'>
										<label className='col-lg-4 col-form-label' htmlFor="type">Type:</label>
										<div className='col-lg-8 '>
											<select className='form-select' name="type" id="" defaultValue={showType} onChange={(e)=>setShowType(e.target.value)}>
												<option value="All">All</option>
												<option value={DOCUMENT_TYPE.PURCHASE}>{DOCUMENT_TYPE.PURCHASE}</option>
												<option value={DOCUMENT_TYPE.SPAN}>{DOCUMENT_TYPE.SPAN}</option>
											</select>
										</div>
									</div>
								</div>
								<div className='col'>
									<div className='row'>
										<label className='col-lg-4 col-form-label' htmlFor="type">Status:</label>
										<div className='col-lg-8'>
											<select className='form-select' name="status" id="" defaultValue={showStatus} onChange={(e)=>setShowStatus(e.target.value)}>
												<option value="All">All</option>
												<option value={DOCUMENT_STATUS.COMPLETED}>{DOCUMENT_STATUS.COMPLETED}</option>
												<option value={DOCUMENT_STATUS.DRAFT}>{DOCUMENT_STATUS.DRAFT}</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
				</div>
				
				<div className='p-3'>
					<div className="row justify-content-md-center">
						<div className='scroll_div col-12 col-lg-8 mt-3 p-3'>
							<table className="table">
								<thead className='font-comfortaa'>
									<tr>
									<th className=''>n</th>
									<th className=''>date</th>
									<th className='text-center'>type</th>
									<th className='text-center'>status</th>
									<th className='text-center'></th>
									</tr>
								</thead>
								<tbody className='font-roboto'>
									{ showList.map ((value, i) => <DocumentLine item={value} i={i} navigate={navigate}/> )}
								</tbody>
							</table>
						</div>
						<div className="row justify-content-md-center">
							<div className='col-12 col-lg-8 mt-3 p-3'>
								<div className="row ">
									<div className="col text-start">
										<button className="btn btn-outline-danger" onClick={ () => navigate ('/warehouse/span') } >To production</button>
									</div>
									<div className="col text-end">
										<button className="btn btn-outline-danger" onClick={ () => navigate ('/warehouse/purchase') }>For purchase</button>
									</div>
								</div>
							</div>
						</div>


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
			<td className={'col-6 '}>
			<Link to={'/warehouse/'+ item.id}>{item.date.split('T')[0]}</Link> 
			</td>
			<td className={'col-2 text-center '}>
				{item.type}
			</td>
			<td className={'col-2 text-center '}>
				{item.status}
			</td>
			<td>
				<div className='col-1'>
					<i className="bi bi-pencil" style={{'font-size': '1.3rem', color: "#BD302D"}}
						onClick={(e) => {
							e.preventDefault();
							props.navigate ('/task/'+item.id);} }></i>
				</div>

			</td>
		</tr>
	)
}

export default DocumentList;
