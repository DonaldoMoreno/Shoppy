export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl p-8 bg-white shadow rounded">
        <h1 className="text-2xl font-semibold">Shoppy — Personal Shopper Marketplace (MVP)</h1>
        <p className="mt-4 text-gray-600">Demo landing. Use the API to sign up, create requests, and run demo flows.</p>
        <div className="mt-6 flex gap-3">
          <a href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded">Sign in</a>
          <a href="/auth/register" className="px-4 py-2 border rounded">Register</a>
        </div>
      </div>
    </main>
  )
}
