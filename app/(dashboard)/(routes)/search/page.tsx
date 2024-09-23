
import { SearchInput } from "@/components/search-input";
import { getDocuments } from "@/actions/get-documents";
import { DocumentsList } from "@/components/documents-list";


const SearchPage = async () => {

  const documents = await getDocuments();

  return (
    <>
      <div className="px-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="px-6 mt-0">
        <DocumentsList items={documents} />
      </div>
    </>
  );
};

export default SearchPage;
