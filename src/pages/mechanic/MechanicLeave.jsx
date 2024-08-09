import React from 'react'
import MechanicApplyLeave from '../../components/mechanic/MechanicApplyLeave';

const MechanicLeave = () => {
  return (
    <div className='flex gap-4 flex-wrap'>
      <div className='flex-1 min-w-[340px] shadow-custom p-4 rounded-md'>
      <MechanicApplyLeave/>
      </div>
      <div className='flex-1 min-w-[350px]'>
      {/* <MechanicApplyLeave/> */}
      </div>
    </div>
  )
}

export default MechanicLeave;