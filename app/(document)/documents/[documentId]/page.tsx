"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { File, Loader2 } from "lucide-react";

interface Attachment {
  id: string;
  name: string;
  url: string;
}

interface Document {
  id: string;
  title: string;
  description: string;
  Attachments: Attachment[];
}

const DocumentIdPageClient = () => {
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [documentDetails, setDocumentDetails] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedDocumentId = localStorage.getItem("documentId");
    setDocumentId(storedDocumentId);

    if (storedDocumentId) {
      axios
        .get(`/api/purchase?documentId=${storedDocumentId}`)
        .then((response) => {
          setIsPurchased(response.data.isPurchased);

          if (response.data.isPurchased) {
            axios.get(`/api/admin/${storedDocumentId}`).then((docRes) => {
              setDocumentDetails(docRes.data);
              setLoading(false);
            });
          } else {
            setLoading(false); 
          }
        })
        .catch((error) => {
          toast.error("Error checking purchase status");
          console.error("Error:", error);
          setLoading(false);
        });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/notifications", {
        name,
        email,
        phone,
        documentId,
      });
      toast.success("Request Sent");
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error:", error);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border border-blue-300 animate-spin inline-block  w-12 h-12 border-4 rounded-full" role="status">
         
        </div>
      </div>
    );
  }


  if (isPurchased && documentDetails) {
    return (
      <div className="flex flex-col items-center max-w-4xl mx-auto pb-2">
        <div className="p-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Document Details</h2>
          <h3 className="text-xl">Title: {documentDetails.title}</h3>
          <p>Description: {documentDetails.description}</p>

          {documentDetails.Attachments && documentDetails.Attachments.length > 0 ? (
            <div className="attachments">
              <ul>
                {documentDetails.Attachments.map((attachment: Attachment) => (
                  <li key={attachment.id}>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 gap-4 bg-sky-200 border text-sky-700 rounded-md absolute hover:underline z-50"
                    >
                      <File />
                      <p className="line-clamp-1">{attachment.name}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No attachments available.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto pb-2">
      <div className="p-4 text-center">
        <h1>Document ID: {documentId}</h1>
        <h2 className="text-2xl font-semibold mb-4">This document is locked</h2>
        <p className="mb-4">
          The document is purchasable. In order to view its content, you must first purchase it.
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="absolute z-50">Unlock</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unlock Document</AlertDialogTitle>
              <AlertDialogDescription>
                Please fill in the following details to unlock the document.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <PhoneInput
                  country={"us"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  inputProps={{
                    name: "phone",
                    required: true,
                    autoFocus: true,
                  }}
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Submit</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DocumentIdPageClient;
