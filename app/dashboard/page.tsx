'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

const page = () => {
  const session = useSession()
  return (
    <div className='min-h-screen flex justify-center items-center'>
      {session.data?.user?.email}
    </div>
  )
}

export default page