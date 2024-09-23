import { Logo } from "./logo"

export const HomeSidebar = () => {
    return (
        <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
           <div className="p-6 flex items-center gap-2 justify-center">
                <Logo />
                <p className="text-[18px] text-[#0369A1]">DOCUSHELF</p>
           </div>
        </div>
    )
}