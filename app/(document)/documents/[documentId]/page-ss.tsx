import DocumentIdPageClient from './page';

const DocumentIdPage = async ({ params }: { params: { documentId: string } }) => {
  const { documentId } = params;

  if (!documentId) {
    return <p>Document not found</p>;
  }

  return <DocumentIdPageClient />;
};

export default DocumentIdPage;