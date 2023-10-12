// A React functional component `AuthLayout` for creating a common layout for authentication-related pages.

const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return ( 
    <div className="h-full flex items-center justify-center">
      {children}
    </div>
   );
}

export default AuthLayout