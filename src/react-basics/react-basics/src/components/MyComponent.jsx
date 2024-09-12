import React, { useState } from 'react'

function MyComponent() {
    const [name, setName] = useState("Guest");
    const [age, setAge] = useState(0);
    const updateName = ()=>{
        setName("Spongebob");
    }
    const updateAgeInc = ()=>{
        setAge(age+1)
    }
    const updateAgeDec = ()=>{
        setAge(age-1)
    }
  return (
    <div>
      <p>Name: {name} </p>
      <button className="name-btn" onClick={updateName}>Set Name</button>
      <p>Age: {age} </p>
      <button className='name-btn' onClick={updateAgeInc}>Increase the age</button>
      {/* <p>Age:{age} </p> */}
      <button className='name-btn'  onClick={updateAgeDec}>Decrease the age</button>
    </div>
  )
}
export default MyComponent
