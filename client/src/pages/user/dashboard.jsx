import React from 'react'
import { Navbar } from '@/components/userDash/Navbar'
import SparePartsStore from '@/components/userDash/store';

function UserDashboard() {
  return (
    <div>
      <Navbar />
      <SparePartsStore />
    </div>
  )
}

export default UserDashboard;