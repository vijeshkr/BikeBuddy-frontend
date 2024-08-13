import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * MechanicSpareParts Component
 * 
 * This component serves as a container for the nested routes related to spare parts.
 * Achieve filter option based on the vehicles
 * 
 * 
 */

const MechanicSpareParts = () => {
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default MechanicSpareParts;