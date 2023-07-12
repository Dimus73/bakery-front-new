import { useState, useEffect } from 'react'
import { useSelector, useDispatch  } from 'react-redux'
import { setLoader } from '../../redux/action';
import { useNavigate, Link  } from "react-router-dom";
import ResourcesUsed from './ResourcesUsed';
import './TaskList.css';

const TaskList = () => {
	const user = useSelector (state => state.user);
	const dispatch = useDispatch ();

	const tDate = new Date();
	const [ taskList, setTaskList ] = useState ( [ { date:tDate.toISOString() } ] );
	const [ activeTask, setActiveTask ] = useState ( 0 );
	const navigate = useNavigate ();

	const getTaskList = async () => {
		const BASE_URL = process.env.REACT_APP_BASE_URL;
		const URL = BASE_URL + '/api/task';

		const reqData = {
			method : 'GET',
			headers:{
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			},
		}

		try {
			dispatch ( setLoader (true) );
			const data = await fetch (URL, reqData);
			const dataJS = await data.json();
			dispatch ( setLoader (false) );
			// console.log('GET List dataJS =>', dataJS);
			if (data.ok) {
				setTaskList ( [...dataJS] );
				setActiveTask ( dataJS[0].id )
			}
			else {
				console.log(`Error getting list of recipes. Status: ${data.status}. Message: ${data.msg}`)
				alert(`Error getting list of recipes. Status: ${data.status}. Message: ${dataJS.msg}`)
			} 
		} catch (error) {
			dispatch ( setLoader (false) );
			console.log(error);
			alert (`Error getting list of recipes. Message: ${error}`)		

		}

	}

	 useEffect (() => {
		const t = async () =>{
			await getTaskList();
		}	
		t();
	},[]);

	console.log('taskList', taskList);
	
	return (
		<div className='container '>
			<div className='row'>
				<div className='col-12 col-lg-6  font-comfortaa'>
					<div className='container  bg-white p-5 pb-3 pt-3 shadow-lg'>
						<h6>Task list</h6>
						<div className='scroll_div pt-3'>
							<table className='table'>
									<thead >
										<tr>
											<th className='col-1'>n</th>
											<th className='col-7'>date</th>
											<th className='col-2'>in work</th>
											<th className='col-1'>ready</th>
											<th className='col-1'></th>
										</tr>
									</thead>
									<tbody  className='font-roboto'>
										{ taskList.map ((value, i) => <TaskLine item={value} i={i} activeTask={activeTask} setActiveTask={setActiveTask} navigate={navigate}/> )}
									</tbody>
							</table>
						</div>
						<div className='text-end'>
							<button className='btn btn-outline-danger mt-3' on onClick={()=>navigate('/task/create')}>New</button>
						</div>
					</div>
				</div>

				<div className='col-12 col-lg-6 font-comfortaa'>
					<div className='container  bg-white p-5 pb-3pt-3 shadow-lg'>
						<h6>Resources</h6>
						<div className=''>
							<ResourcesUsed id={activeTask} />
						</div>
					</div>
				</div>

			</div>
		</div>
	)

}

const TaskLine = (props) => {
	const item = props.item;

	const isActive = i => i ? 'table-success' : ''; 


	return (
		<tr key={props.i} onClick= { () => props.setActiveTask (props.item.id) } style={{cursor:'pointer'}}>
			<td className={'col-1 ' + isActive(item.id === props.activeTask)}>{item.id}.</td>
			<td className={'col-6 ' + isActive(item.id === props.activeTask) }>
				{item.date.split('T')[0]}
			</td>
			<td className={'text-center ' + isActive(item.id === props.activeTask)}>
				{item.in_work ? 'Yes' : 'No'}
			</td>
			<td className={'text-center ' + isActive(item.id === props.activeTask) }>
				{item.is_ready ? 'Yes' : 'No'}
			</td>
			<td className={'align-middle text-center ' + isActive(item.id === props.activeTask) } >
				<i className="bi bi-pencil" style={{'font-size': '1.3rem', color: "#BD302D"}}
					onClick={() => props.navigate('/task/'+item.id)}></i>
			</td>
		</tr>
	)
}

export default TaskList;
