const BlockTable = (props) => {
	// console.log('BlockTable props', props);
	return(
		<div className="container h-330" >
			<div className="block-ing table-responsive p-3 mb-4" style={{height:'330px'}}>
				<table className="table table-white table-hover table-sm">
					<thead>
						<tr>
							<th className=''>No.</th>
							{props.flag ==='I' ? <th className=' text-start'>Ingredients</th> :
							 <th className=' text-start'>Equipment</th>}
							<th className=' text-end'>{props.flag === 'I' ? 'Quantity' : 'Time'}</th>
							{props.flag ==='I' ? <th className=' text-end'>Units</th> : ""}
							<th className=' text-center'>Action</th>
						</tr>
					</thead>
					<tbody>
						{props.componentList.map((value,i) => <IngredientRow flag={props.flag} value={value} i={i}
							ingredients={props.ingredients} changeIngredient={props.changeIngredient}
							changeIngredientQuantity = {props.changeIngredientQuantity}
							deleteIngredient = {props.deleteIngredient}
						/>)}
					</tbody>
				</table>
			</div>
		</div>

	)
}


const IngredientRow = (props) => {
	// console.log('In IngredientRow', props.value);
	return(
		<tr>
			<td className='align-middle' >{props.i+1}</td>
			<td className='align-middle'>
				<select className="select-box text-start" name="ingredient" id="" value={props.flag === 'I' ? props.value.ingredient_id : props.value.equipment_id} 
				  placeholder="Enter" onChange={(e) => props.changeIngredient(e, props.i, props.flag)}>
					<option disabled selected value=""></option>
					{props.ingredients.map ((value) => {
					// console.log('Options', value.id, props );
					return  (<option  value={value.id}> {props.flag === 'I' ? value.name : value.equipment} </option> )
					}
						)}
				</select>
			</td>
			<td className='align-middle text-end' >
				<input className="input-box text-end" type="text" value = {props.value.quantity} 
				  placeholder="Enter" onChange={ (e) => { props.changeIngredientQuantity(e, props.i, props.flag) } }
				/>
			</td>
			{props.flag === 'I' ?
				<td className='align-middle text-end' >
				{props.value.unit_name}
			</td> : " "}
			<td className='align-middle text-center ' >
				<i className="bi bi-x-square" style={{'font-size': '1.3rem', color: "#BD302D"}}
					onClick={(e) => {props.deleteIngredient (e, props.i, props.flag) }}></i>
			</td>
		</tr>
	)
} 

export default BlockTable
