import React from 'react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold">Sign in</h2>
        <form className="mt-4 space-y-3">
          <input name="email" placeholder="Email" className="w-full p-2 border rounded" />
          <input name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" />
          <button className="w-full py-2 bg-blue-600 text-white rounded">Sign in</button>
        </form>
      </div>
    </div>
  )
}
