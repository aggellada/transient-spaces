function LoginForm() {
  return (
    <form>
      <label>username</label>
      <input type="text" name="username" required />
      <label>password</label>
      <input type="password" name="password" required />
    </form>
  );
}

export default LoginForm;
