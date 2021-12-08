
import './App.css';
import { BrowserRouter as Router,Route,Switch } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import Messenger from './components/Messenger';
import ProtectRoute from './components/ProtectRoute';
function App() {
  return (
        <Router>
            <Switch>
                <Route path='/messenger/login' component={Login} exact></Route>
                <Route path='/messenger/register' component={Register} exact></Route>
                <ProtectRoute path='/' component={Messenger} exact />
            </Switch>
        </Router>
  );
}

export default App;

