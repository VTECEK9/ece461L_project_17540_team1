import React, {useState} from 'react';
import '../App.css';

const Checkout = () => {
    const [hwsets, setHWsets] = useState([
        // Initial hardware set data for name, available, and capacity
        { id: 1, name: 'HW Set 1', capacity: 45, available: 20 },
        { id: 2, name: 'HW Set 2', capacity: 40, available: 30},
      ]);
    


    return(
        <div class = "resource-management">
            <h1>Resource Manager</h1>
            {hwsets.map((hwsets) => (
            <Checkouts
                key={hwsets.id}
                hwsets={hwsets} 
        />
      ))}

      </div>
    );
};

const Checkouts = ({ hwsets}) => {
    const[request, setRequest] = React.useState('');

    return(
        <div class = "hwsets-fix">
             <h2>{hwsets.name}</h2>
     

            <div class = "capacity-box">
                <label>
                    Capacity
                    <input
                    type = "text"
                    value = {hwsets.capacity}
                    class = "trial"

                    />
                </label>


            <div class = "available-box">
                <label>
                    Available
                    <input
                    type = "text"
                    value = {hwsets.available}
                    class = "trial"
                    />
                </label>

            </div>

            <div class = "request-box">
                <label>
                    Request
                    <input
                    type = "text"
                    value = {request}
                    onChange={(e) => setRequest(e.target.value)}
                    class = "trial"

                    />
                </label>

            </div>


        </div>

            <button>Check-in</button>
            <button>Check-out</button>
    

        </div>

    );
};


export default Checkout;