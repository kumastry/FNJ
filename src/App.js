import Header from "./components/Header";
import Footer from "./components/Footer";
import Word from "./components/Word";
import Wine from "./components/Wine";
import React, {useEffect} from "react";
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import Tabs from './components/Tabs';

const Router = () => (
  <BrowserRouter>
  <Tabs/>
    <Switch>
      <Route exact path ="/wine" component={Wine}/>
      <Route exact path ="/word" component={Word}/>
    </Switch>
  </BrowserRouter>
);


function App() {
    return (
      <div>
        <Header/>
        <Router/>
      </div>
    );
}

export default App;