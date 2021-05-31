import {useSelector} from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import './css/app.css'
import Signup from './components/Signup';
import Login from './components/Login';
import WithNav from './components/WithNav';
import Workspace from './components/Workspace';

function App() {
  const isLoggedIn = useSelector(state=>state.isLoggedIn)

  return (
    <div style={{width: "100vw", height: "100vh"}}>
      <Router>
        <div className="contain">
          <Switch>
            <Route path="/login/" exact>
              {/* redirect to home page if logged in */}
              {isLoggedIn ? <Redirect to="/"/> : <Login/>}
            </Route>
            <Route path="/signup/" exact>
              {/* redirect to home page if logged in */}
              {isLoggedIn ? <Redirect to="/"/> : <Signup/>}
            </Route>
            <Route path="/room/" >
              {isLoggedIn ? <Workspace/> : <Login/> }
            </Route>
            <WithNav/>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
