import { serialize } from 'cookie';

export default function handler(req, res) {
  const { documentId } = req.query;

  if (!documentId) {
    return res.status(400).json({ error: 'Document ID is required' });
  }

  const cookie = serialize('documentId', documentId, { path: `/documents/${documentId}`});

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ success: true });
}