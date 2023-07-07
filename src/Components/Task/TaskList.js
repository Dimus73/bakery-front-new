import { useState, useEffect } from 'react'
import { useSelector  } from 'react-redux'
import { useNavigate, Link  } from "react-router-dom";
import ResourcesUsed from './ResourcesUsed';

const TaskList = () => {
	const user = useSelector (state => state.user);

	const tDate = new Date();
	const [ taskList, setTaskList ] = useState ( [ { date:tDate.toISOString() } ] );
	const [ activeTask, setActiveTask ] = useState ( 0 );

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
			const data = await fetch (URL, reqData);
			const dataJS = await data.json();
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
		<div className='container'>
			<h1>Task list</h1>
			<div className='row'>
				<div className='col-6'>
					<table>
						<thead>
							<tr>
							<th className=''>#</th>
							<th className=''>DATE</th>
								<th className=''>In Work</th>
								<th className=''>Ready</th>
							</tr>
						</thead>
						<tbody>
							{ taskList.map ((value, i) => <TaskLine item={value} i={i} activeTask={activeTask} setActiveTask={setActiveTask}/> )} 
						</tbody>
					</table>
				</div>

				<div className='col-6'>
					<ResourcesUsed id={activeTask} />
				</div>

			</div>
		</div>
	)

}

const TaskLine = (props) => {
	const item = props.item;

	const isActive = i => i ? 'text-decoration-underline' : ''; 


	return (
		<tr key={props.i} onClick= { () => props.setActiveTask (props.item.id) }>
			<td className={'col-1 ' + isActive(item.id === props.activeTask)}>{item.id}</td>
			<td className={'col-6 ' + isActive(item.id === props.activeTask) }>
				{item.date.split('T')[0]}
			</td>
			<td className={'text-center ' + isActive(item.id === props.activeTask)}>
				{item.in_work ? 'Yes' : 'No'}
			</td>
			<td className={'text-center ' + isActive(item.id === props.activeTask) }>
				{item.is_ready ? 'Yes' : 'No'}
			</td>
			<td>
				<Link to={'/task/'+item.id} >Edit</Link>
			</td>
		</tr>
	)
}

export default TaskList;
