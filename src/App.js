import logo from './logo.svg';
import './App.css';
import {Routes, Route, Link} from 'react-router-dom'
import Ingredients      from './Components/Catalog/Ingredients';
import Equipment        from './Components/Catalog/Equipment';
import { Layout }       from './Components/Layout/Layout'
import { PageNoFound }  from './Components/PageNoFound';
import Login            from './Components/Auth/Login';
import Registry         from './Components/Auth/Registry';
import HomePage         from './Components/Homepage';
 
import RecipeList       from './Components/Recipe/RecipeList';
import Recipe           from './Components/Recipe/Recipe';
import RecipeEdit       from './Components/Recipe/RecipeEdit';
import RecipeDetailView from './Components/Recipe/RecipeDetailView';

import CreateTask       from './Components/Task/CreateTask';
import TaskList         from './Components/Task/TaskList';

import Document         from './Components/Warehouse/Document';
import DocumentList     from './Components/Warehouse/DocumentList';
import StockBalance     from './Components/Warehouse/StockBalance';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col } from 'react-bootstrap';

function App() {
  return (
  <>
    {/* <Ingredients /> */}
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index                        element={<RecipeList />} />
        <Route path='login'                 element={<Login />} />
        <Route path='registry'              element={<Registry />} />

        <Route path='catalog/ingredients'   element={<Ingredients />} />
        <Route path='catalog/equipment'     element={<Equipment />} />

        <Route path='recipe/list'           element={<RecipeList/>} />
        <Route path='recipe/:id'            element={<RecipeEdit/>} />
        <Route path='recipe/create'         element={<Recipe/>} />
        <Route path='recipe/detail/:id'     element={<RecipeDetailView/>} />

        <Route path='task/create'           element={<CreateTask/>} />
        <Route path='task/list'             element={<TaskList/>} />
        <Route path='task/:id'              element={<CreateTask/>} />

        <Route path='warehouse/purchase'    element={<Document docType={'purchase'}/>} />
        <Route path='warehouse/span'        element={<Document docType={'span'}/>} />
        <Route path='warehouse/'            element={<DocumentList />} />
        <Route path='warehouse/:id'         element={<Document />} />
        <Route path='warehouse/stock'       element={<StockBalance />} />

        <Route path='*'                     element={<PageNoFound />} />
      </Route>
    </Routes>
  </>
);
}

export default App;


