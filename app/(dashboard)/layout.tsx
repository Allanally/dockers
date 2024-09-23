import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import Footer from "./_components/footer";
import Script from "next/script";

const DshboardLayout = ({ children }: { children: React.ReactNode }) => {
 
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed inset-y-0 w-full z-50 h-[80px] md:pl-56">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="flex-grow md:pl-56 pt-[80px]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DshboardLayout;
