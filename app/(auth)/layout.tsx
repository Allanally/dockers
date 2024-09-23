const AuthLayout = ({ children}: { children: React.ReactNode}) => {
    return ( 
        <div className="h-full flex items-center mt-6 justify-center">
            {children}
        </div>
     );
}
 
export default AuthLayout;