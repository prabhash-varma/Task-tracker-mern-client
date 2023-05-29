import React, { useState, useContext } from 'react'
import Axios from 'axios';
import { store } from '../App';
import { useNavigate } from 'react-router-dom';

function Item(props) {

    const {userdata,setUserData, itemlist, setItemlist } = useContext(store);

    const navigate = useNavigate();


    const deleteItem = (itemid) => {
        console.log(itemid);
        Axios.post("https://task-tracker-mern-server.vercel.app/deleteitem", {
            itemid: itemid
        }, { headers: { "authorization": `bearer ${localStorage.getItem("token")}` } }).then((response) => {

            if (response.data.auth) {
                console.log(response.data);
                setItemlist(itemlist.filter((item) => {
                    return item._id.valueOf() !== itemid;
                }))

                alert("Item deleted successfully")
            }
            else {
                navigate("/login");
            }

        }
        );
    }

    const updateItem = async (itemid) => {

        console.log(itemid);
        localStorage.setItem("itemid", itemid);
        navigate("/updateitem")
    }

    const updateStatus = async (itemid) => {
        console.log(itemid);
        await Axios.post("https://task-tracker-mern-server.vercel.app/updatestatus", {
            itemid: itemid
        }, { headers: { "authorization": `bearer ${localStorage.getItem("token")}` } }).then((response) =>{

            if (response.data.auth) {
                console.log(response.data);
                
                // update itemlist
                setItemlist(itemlist.map((item) => {
                    if (item._id.valueOf() === itemid) {
                        item.status = "completed";
                    }
                    return item;
                }))
                


                alert("Item status updated successfully")
            }
            else {
                navigate("/login");
            }

        }
        );
    }


    return (
        <div>
            <div style={{ margin:"15px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                <div style={{border: "1px solid black"}} class="accordion" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button style={{width:"390px"}} class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#${props.itemid}`} aria-expanded="true" aria-controls="collapseOne">
                                Title: {props.title}
                            </button>
                        </h2>
                        <div id={props.itemid} class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <strong>{props.description}</strong>
                                <p style={{marginTop:"30px"}}> {props.status=="completed" ? <p style={{color:"green"}}>completed</p> : <p style={{color:"red"}}>incomplete</p>}</p>
                                <button style={{margin:"10px"}} className="btn btn-danger" onClick={() => {
                                    deleteItem(props.itemid);
                                }}>
                              <i class="fa fa-trash" aria-hidden="true"/>
                                </button>
                                <button style={{margin:"10px"}} type="button" class="btn btn-success" onClick={() => {
                                    updateItem(props.itemid);
                                }}>
                                <i class="fas fa-edit"></i>
                                </button>

                                {props.status === "incomplete" &&
                                    <button  style={{margin:"10px"}} type="button" class="btn btn-success" onClick={() => {
                                        updateStatus(props.itemid);
                                    }}> <i class="fas fa-tasks"></i>
                                    </button>
                                }
                            
                            </div>
                        </div>
                    </div>


                </div>




            </div>
        </div>
    )
}

export default Item
