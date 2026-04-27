import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
