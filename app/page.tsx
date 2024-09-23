
import { getDocuments } from "@/actions/get-documents";
import { DocumentsList } from "@/components/documents-list";
import { Navbar } from "./(dashboard)/_components/navbar";
import { HomeSidebar } from "./(dashboard)/_components/home-sidebar";


const HomePage =  async () => {
    
  
    const documents = await getDocuments();

    return (
      <div className="flex flex-col min-h-screen">
       <div className="fixed inset-y-0 w-full z-50 h-[80px] md:pl-56">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <HomeSidebar />
      </div>
        
        <main className="flex-grow md:pl-60 pt-[80px]">
          <DocumentsList items={documents} />
        </main>
      </div>
    )
}

export default HomePage