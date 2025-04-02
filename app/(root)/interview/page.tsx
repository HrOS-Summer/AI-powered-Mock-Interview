import Agent from '@/components/Agent'
import React from 'react'

const page = () => {
  return (
    <>
        <h3>Interview generation</h3>
        <Agent username="user" type="generate"/>
    </>
  )
}

export default page