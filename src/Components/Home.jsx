import { useState, useEffect } from 'react'
import axios from 'axios';
import OpenAIChat from './OpenAIChat';
function Home() {
  return (
    <>
      <OpenAIChat/>
    </>
  )
}

export default Home
