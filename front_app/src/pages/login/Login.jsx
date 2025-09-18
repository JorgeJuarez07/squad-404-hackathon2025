const Login = () => {
  const zitadelAuthUrl = `https://interle-jy3ptw.us1.zitadel.cloud/oauth/v2/authorize?client_id=338010317902660978&response_type=code&scope=openid%20profile%20email&redirect_uri=http://localhost:3000/callback`;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Iniciar Sesión</h1>
      <a
        href={zitadelAuthUrl}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Login con ZITADEL
      </a>
    </div>
  );
};

export default Login;
