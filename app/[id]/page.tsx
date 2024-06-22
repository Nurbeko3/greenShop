import React from 'react'

const page = ({params}:any) => {
  const id = params.id
  return (
    <div>page - {id}</div>
  )
}

export default page