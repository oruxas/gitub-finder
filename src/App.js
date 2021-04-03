import {React, Fragment, useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css';

import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import { Alert } from './components/layout/Alert';
import { About } from './components/pages/About';


import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([])
  const [user, setUser] = useState({})
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
 
useEffect(() => {
  getInitialUsers()
}, [])

  const getInitialUsers = async () => {
    setLoading(true)
    const res = await axios.get(`https://api.github.com/users?client_id=${
        process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
      setUsers(res.data)
      setLoading(false)
  }

  // getInitialUsers()

  const searchUsers = async (searchText) => {
    setLoading(true)
    const res = await axios.get(`https://api.github.com/search/users?q=${searchText}&client_id=${
      process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    setUsers(res.data.items)
    setLoading(false)
  }

  const getUser = async (username) => {
    setLoading(true)
    const res = await axios.get(`https://api.github.com/users/${username}?client_id=${
      process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
      setUser(res.data)
      setLoading(false)

  }

  const getUserRepos = async (username) => {
    setLoading(true)
    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${
      process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
      setRepos(res.data)
      setLoading(false)

  }
  
  const clearUsers = () => {setUsers([]); setLoading(false)}

  const showAlert = (message, type) => {
    setAlert({ message, type })

    setTimeout(()=> setAlert(null), 5000)
  } 
    return (
      <Router>
       <div className="App">
        <Navbar title="Github Finder" icon="fab fa-github"/>
        <div className="container">
          <Alert alert={alert}/>
          <Switch>
            <Route exact path="/" render={ props => {
              return (
                <Fragment>
                  <Search searchUsers={searchUsers}
                            clearUsers={clearUsers}
                            showClear={ users.length > 0 ? true : false } 
                            setAlert={showAlert} />
                  <Users loading={loading} users={users}/>
                </Fragment>
              )
              
            }}/>
            <Route exact path="/about" component={About}/>
            <Route exact path="/user/:login" render={ props=> {
              return (
                <User { ...props }
                  getUser={getUser}
                  getUserRepos={getUserRepos}
                  repos={repos}
                  user={user}
                  loading={loading}/>
              )
            }}/>
          </Switch>
        
        </div>
        
      </div>
    </Router>
    );
  
}

export default App;
