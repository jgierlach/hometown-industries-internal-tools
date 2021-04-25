import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../auth'

export default function MonitorAsins({ props }) {
  const { user } = useAuth()
  if (user) {
    return (
      <h1 className="title has-text-centered mt-4">Monitor Asins Page</h1>
    )
  } else {
    return (
      <h1 className="has-text-centered title mt-4">Please <Link href="/login">Login</Link> to your account.</h1>
    )
  }
}
