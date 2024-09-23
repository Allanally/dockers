"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios"
import { Loader2 } from "lucide-react";

interface Document {
  id: string;
  title: string;
  description: string;
  price: number;
}

interface Notification {
  id: string;
  message: string;
  userId: string;
  createdAt: string;
  isInteracted: boolean; 
  clickedButton?: "unlock" | "decline"; 
  document?: Document;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications", {
          method: "GET",
        });

        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        } else {
          console.error("Error fetching notifications");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleUnlock = async (documentId: string, userId: string) => {
    try {
      const res = await axios.patch("/api/purchase", {
        userId,
        documentId,
        isPurchased: true,
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed to purchase document.");
      }

      await axios.patch("/api/notifications", {
        userId,
        documentId,
      });

      toast.success("Document Unlocked");
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.document?.id === documentId
            ? { ...notification, isInteracted: true, clickedButton: "unlock" }
            : notification
        )
      );
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error unlocking document:", error);
    }
  };

  const handleDecline = async (documentId: string, userId: string) => {
    try {
      await axios.delete("/api/notifications", {
        data: {
          userId,
          documentId,
        },
      });

      await axios.patch("/api/notifications", {
        userId,
        documentId,
      });

      toast.success("Notification Declined");
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.document?.id === documentId
            ? { ...notification, isInteracted: true, clickedButton: "decline" }
            : notification
        )
      );
    } catch (error) {
      toast.error("Error declining notification");
      console.error("Error declining notification:", error);
    }
  };

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`border p-4 rounded-md shadow-md ${notification.isInteracted ? "bg-gray-200" : ""}`}
            >
              <p className="text-lg font-medium">{notification.message}</p>
              <p className="text-sm text-gray-600">Document: {notification.document?.title}</p>
              <p className="text-sm text-gray-600">Description: {notification.document?.description}</p>
              {notification.document?.price !== undefined && (
                <p className="text-sm text-gray-600">Price: ${notification.document.price}</p>
              )}
              <p className="text-sm text-gray-500">
                Date: {new Date(notification.createdAt).toLocaleString()}
              </p>

              <div className="flex justify-center items-center gap-x-2">
                {notification.clickedButton === "unlock" || !notification.isInteracted ? (
                  <Button
                    className="bg-green-500"
                    onClick={() =>
                      handleUnlock(notification.document?.id!, notification.userId)
                    }
                    disabled={notification.isInteracted}
                  >
                    {notification.isInteracted && notification.clickedButton === "unlock"
                      ? "Unlocked"
                      : "Unlock"}
                  </Button>
                ) : null}

                {notification.clickedButton === "decline" || !notification.isInteracted ? (
                  <Button
                    className="bg-red-600"
                    onClick={() =>
                      handleDecline(notification.document?.id!, notification.userId)
                    }
                    disabled={notification.isInteracted}
                  >
                    {notification.isInteracted && notification.clickedButton === "decline"
                      ? "Declined"
                      : "Decline"}
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
