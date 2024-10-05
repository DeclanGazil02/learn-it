import { useState, useEffect } from 'react'
import axios from 'axios';

function Home() {
    const [userEmailFound, setUserEmailFound] = useState(false)
  
    useEffect(() => {
    
      const checkUserEmail = async () => {
        const response = await axios.get(`http://localhost:5000/checkUserEmail/?email=${'admin@gmail.com'}`)
        setUserEmailFound(response.data.found)
      }

      console.log("getting userEmail")
      checkUserEmail();
    }, [])

  return (
    <>
    SIGMA!
      <div>
        {userEmailFound ? "found email" : "email not found"}
      </div>
    </>
  )
}

export default Home
