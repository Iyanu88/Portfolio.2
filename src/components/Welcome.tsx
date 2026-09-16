type WelcomeProps = {
  name?: string
}

function Welcome({ name = 'there' }: WelcomeProps) {
  return <h1>Welcome, {name}!</h1>
}

export default Welcome
