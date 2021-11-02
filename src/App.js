import Home from './Screen/home';
import EditPolicy from './Screen/updatePolicy'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './App.css';


function App() {
  return (
    <Router>
    <Switch>
    <Route exact path='/' component={Home}></Route>
    <Route exact path='/edit/:id' component={EditPolicy}></Route>
  </Switch>
  </Router>
  );
}

export default App;
