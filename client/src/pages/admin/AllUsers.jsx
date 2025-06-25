import React, { useEffect, useState } from 'react'
import '../../styles/AllUsers.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AllUsers = () => {

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user || user.usertype !== 'admin') {
      navigate('/login');
    }
    fetchUsersData();
  }, [navigate])

  const fetchUsersData = async() =>{
    try{
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:6001/fetch-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    }catch(err){
      console.error(err);
      }

    await axios.get('http://localhost:6001/fetch-orders').then(
      (response)=>{
        setOrders(response.data);
      }
    )
   
  }

  // Example for protected delete user (if implemented)
  // const handleDeleteUser = async (userId) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     await axios.delete(`http://localhost:6001/delete-user/${userId}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     fetchUsersData();
  //   } catch (err) {
  //     console.error(err);
  //     alert('Error deleting user');
  //   }
  // };

  return (
    <div className="all-users-page">
      <h3>All Users</h3>

      <div className="user-cards">

        {users.map((user)=>{
          return(
            <div className="user-card">
              <span>
                <h5>User Id </h5>
                <p>{user._id}</p>
              </span>
              <span>
                <h5>User Name </h5>
                <p>{user.username}</p>
              </span>
              <span>
                <h5>Email Address </h5>
                <p>{user.email}</p>
              </span>
              <span>
                <h5>Orders </h5>
                <p>{orders.filter(order=> order.userId === user._id).length}</p>
              </span>
            </div>
          )
        })}
        

      </div>

    </div>
  )
}

export default AllUsers