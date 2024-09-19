import React from 'react'
import MechanicApplyLeave from '../../components/mechanic/MechanicApplyLeave';
import MechanicLeaveHistory from '../../components/mechanic/MechanicLeaveHistory';

const MechanicLeave = () => {
  return (
    <div className='flex gap-4 flex-wrap'>
      {/* Container for the apply leave section */}
      <div className='flex-1 min-w-[340px]'>
        <MechanicApplyLeave />
      </div>
      {/* Container for the leave history section */}
      <div className='flex-1 min-w-[340px] sm:min-w-[500px] shadow-custom p-4 rounded-lg bg-white'>
        <MechanicLeaveHistory />
      </div>
    </div>
  )
}

export default MechanicLeave;