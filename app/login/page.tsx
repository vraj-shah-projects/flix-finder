import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div>
      <h1>Log in or sign up</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />

        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />

        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form>
    </div>
  )
}