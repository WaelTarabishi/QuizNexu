const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-start mt-28 h-screen">
      {children}
    </div>
  );
};

export default AuthLayout;
