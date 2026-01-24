import Breadcrumb from '@/components/Breadcrumb'
import WaitListusers from '@/components/WaitListusers'
import MasterLayout from '@/masterLayout/MasterLayout'
import React from 'react'

const page = () => {
  return (
    <>
    {/* MasterLayout comonent */}
    <MasterLayout>
        {/* Bread crump */}
        <Breadcrumb title='Waiting List Users' />

        {/* wait list users */}
        <WaitListusers />
    </MasterLayout>
    </>
  )
}

export default page