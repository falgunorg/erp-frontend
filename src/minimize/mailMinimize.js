import swal from "sweetalert";

class MailMinimize {
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isSameYear = date.getFullYear() === now.getFullYear();
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };

    if (isToday) {
      return date.toLocaleTimeString([], timeOptions); // If today, show time
    } else if (isSameYear) {
      const dateOptions = { month: "numeric", day: "numeric" };
      return `${date.toLocaleDateString(
        [],
        dateOptions
      )} ${date.toLocaleTimeString([], timeOptions)}`;
    } else {
      const dateOptions = { month: "numeric", day: "numeric", year: "2-digit" };
      return `${date.toLocaleDateString(
        [],
        dateOptions
      )} ${date.toLocaleTimeString([], timeOptions)}`;
    }
  }
  constructor() {
    this.getAccessToken = null;
    this.setEmails = null;
  }

  setAccessTokenAndEmails(getAccessToken, setEmails) {
    this.getAccessToken = getAccessToken;
    this.setEmails = setEmails;
  }

  async handleDelete(id) {
    try {
      const accessToken = await this.getAccessToken();
      const moveResponse = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}/move`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destinationId: "deleteditems",
          }),
        }
      );

      if (moveResponse.ok) {
        this.setEmails((prevEmails) =>
          prevEmails.filter((email) => email.id !== id)
        );
      } else {
        console.error("Failed to move email to Deleted Items");
      }
    } catch (error) {
      console.error("Error deleting email:", error);
    }
  }

  async handleRestore(id) {
    try {
      const accessToken = await this.getAccessToken();

      const folderCheckResponse = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/mailFolders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const foldersData = await folderCheckResponse.json();
      let restoredFolder = foldersData.value.find(
        (folder) => folder.displayName === "Restored"
      );

      if (!restoredFolder) {
        const createFolderResponse = await fetch(
          `${process.env.REACT_APP_MICROSOFT_API_URL}/me/mailFolders`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              displayName: "Restored",
            }),
          }
        );
        restoredFolder = await createFolderResponse.json();
      }

      const moveResponse = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}/move`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destinationId: restoredFolder.id,
          }),
        }
      );

      const responseData = await moveResponse.json();
      if (moveResponse.ok) {
        this.setEmails((prevEmails) =>
          prevEmails.filter((email) => email.id !== id)
        );
      } else {
        console.error("Failed to restore email");
      }
    } catch (error) {
      console.error("Error restoring email:", error);
    }
  }

  async archiveMail(mailId) {
    try {
      const accessToken = await this.getAccessToken();
      const archiveFolder = await this.getOrCreateFolder(
        "Archive",
        accessToken
      );

      const moveResponse = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${mailId}/move`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destinationId: archiveFolder.id,
          }),
        }
      );

      if (moveResponse.ok) {
        // Remove the archived email from the current state
        this.setEmails((prevEmails) =>
          prevEmails.filter((email) => email.id !== mailId)
        );
      } else {
        console.error("Failed to archive email ID:", mailId);
      }
    } catch (error) {
      console.error("Error archiving email ID:", mailId, error);
    }
  }

  async handlePermanentDelete(id) {
    try {
      const accessToken = await this.getAccessToken();
      const deleteResponse = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (deleteResponse.ok) {
        this.setEmails((prevEmails) =>
          prevEmails.filter((email) => email.id !== id)
        );
      } else {
        console.error("Failed to permanently delete email");
      }
    } catch (error) {
      console.error("Error permanently deleting email:", error);
    }
  }

  async toggleFlag(id, currentFlagStatus) {
    try {
      const accessToken = await this.getAccessToken();
      let newFlagStatus =
        currentFlagStatus === "notFlagged"
          ? "flagged"
          : currentFlagStatus === "flagged"
          ? "complete"
          : "notFlagged";

      const response = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            flag: { flagStatus: newFlagStatus },
          }),
        }
      );

      if (response.ok) {
        this.setEmails((prevEmails) =>
          prevEmails.map((email) =>
            email.id === id
              ? { ...email, flag: { flagStatus: newFlagStatus } }
              : email
          )
        );
      } else {
        console.error("Failed to toggle flag");
      }
    } catch (error) {
      console.error("Error toggling flag:", error);
    }
  }

  async markAsRead(id) {
    const accessToken = await this.getAccessToken();
    try {
      const readResponse = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isRead: true,
          }),
        }
      );

      if (readResponse.ok) {
        this.setEmails((prevEmails) =>
          prevEmails.map((email) =>
            email.id === id ? { ...email, isRead: true } : email
          )
        );
      } else {
        console.error("Failed to mark email as read for ID:", id);
      }
    } catch (error) {
      console.error("Error marking email as read ID:", id, error);
    }
  }
  async markAsUnread(id) {
    const accessToken = await this.getAccessToken();
    try {
      const unreadResponse = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isRead: false,
          }),
        }
      );

      if (unreadResponse.ok) {
        this.setEmails((prevEmails) =>
          prevEmails.map((email) =>
            email.id === id ? { ...email, isRead: false } : email
          )
        );

        
      } else {
        console.error("Failed to mark email as unread for ID:", id);
      }
    } catch (error) {
      console.error("Error marking email as unread ID:", id, error);
    }
  }

  async copyMail(id, folderId) {
    try {
      const accessToken = await this.getAccessToken();

      // Copy the email to the target folder using folderId
      const copyResponse = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}/copy`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destinationId: folderId, // Use the folderId for copying
          }),
        }
      );

      // Check if the response is OK (status in the range 200-299)
      if (!copyResponse.ok) {
        const errorData = await copyResponse.json();
        throw new Error(`Error copying email: ${errorData.error.message}`);
      }

      // Optionally, return the response data if needed
      const result = await copyResponse.json();
      return result; // Return the copied email or confirmation message
    } catch (error) {
      console.error("Error copying email:", error);
      throw error; // Rethrow the error for further handling if needed
    }
  }

  async moveMail(id, folderId) {
    try {
      const accessToken = await this.getAccessToken();

      // Move the email to the target folder using folderId
      const moveResponse = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}/move`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destinationId: folderId, // Use the folderId instead of hardcoded "deleteditems"
          }),
        }
      );

      if (moveResponse.ok) {
        this.setEmails((prevEmails) =>
          prevEmails.filter((email) => email.id !== id)
        );
      }
    } catch (error) {
      console.error("Error moving email:", error);
    }
  }

  //Bulk Items Here
  async bulkDelete(selectedMailIds) {
    const confirmDelete = await this.showConfirmation(
      "Are you sure?",
      "Do you want to delete selected emails?"
    );

    if (confirmDelete) {
      const accessToken = await this.getAccessToken();
      for (const id of selectedMailIds) {
        try {
          const moveResponse = await fetch(
            `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}/move`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                destinationId: "deleteditems",
              }),
            }
          );

          if (moveResponse.ok) {
            this.setEmails((prevEmails) =>
              prevEmails.filter((email) => email.id !== id)
            );
          } else {
            console.error("Failed to move email to Deleted Items for ID:", id);
          }
        } catch (error) {
          console.error("Error deleting email ID:", id, error);
        }
      }
    }
  }
  async bulkRestore(selectedMailIds) {
    const confirmRestore = await this.showConfirmation(
      "Are you sure?",
      "Do you want to restore selected emails?"
    );

    if (confirmRestore) {
      const accessToken = await this.getAccessToken();
      let restoredFolder = await this.getOrCreateFolder(
        "Restored",
        accessToken
      );

      for (const id of selectedMailIds) {
        try {
          const moveResponse = await fetch(
            `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}/move`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                destinationId: restoredFolder.id,
              }),
            }
          );

          if (moveResponse.ok) {
            this.setEmails((prevEmails) =>
              prevEmails.filter((email) => email.id !== id)
            );
          } else {
            console.error("Failed to restore email ID:", id);
          }
        } catch (error) {
          console.error("Error restoring email ID:", id, error);
        }
      }
    }
  }
  async bulkPermanentDelete(selectedMailIds) {
    const confirmDelete = await this.showConfirmation(
      "Are you sure?",
      "Do you want to permanently delete selected emails?"
    );

    if (confirmDelete) {
      const accessToken = await this.getAccessToken();
      for (const id of selectedMailIds) {
        try {
          const deleteResponse = await fetch(
            `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (deleteResponse.ok) {
            this.setEmails((prevEmails) =>
              prevEmails.filter((email) => email.id !== id)
            );
          } else {
            console.error("Failed to delete email ID:", id);
          }
        } catch (error) {
          console.error("Error deleting email ID:", id, error);
        }
      }
    }
  }
  async bulkRead(selectedMailIds) {
    const confirmRead = await this.showConfirmation(
      "Are you sure?",
      "Do you want to mark selected emails as read?"
    );

    if (confirmRead) {
      const accessToken = await this.getAccessToken();
      for (const id of selectedMailIds) {
        try {
          const readResponse = await fetch(
            `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                isRead: true,
              }),
            }
          );

          if (readResponse.ok) {
            this.setEmails((prevEmails) =>
              prevEmails.map((email) =>
                email.id === id ? { ...email, isRead: true } : email
              )
            );
          } else {
            console.error("Failed to mark email as read for ID:", id);
          }
        } catch (error) {
          console.error("Error marking email as read ID:", id, error);
        }
      }
    }
  }
  async bulkUnread(selectedMailIds) {
    const confirmUnread = await this.showConfirmation(
      "Are you sure?",
      "Do you want to mark selected emails as unread?"
    );

    if (confirmUnread) {
      const accessToken = await this.getAccessToken();
      for (const id of selectedMailIds) {
        try {
          const unreadResponse = await fetch(
            `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                isRead: false,
              }),
            }
          );

          if (unreadResponse.ok) {
            this.setEmails((prevEmails) =>
              prevEmails.map((email) =>
                email.id === id ? { ...email, isRead: false } : email
              )
            );
          } else {
            console.error("Failed to mark email as unread for ID:", id);
          }
        } catch (error) {
          console.error("Error marking email as unread ID:", id, error);
        }
      }
    }
  }
  //bulk archive
  async bulkArchive(selectedMailIds) {
    const confirmRestore = await this.showConfirmation(
      "Are you sure?",
      "Do you want to Archive selected emails?"
    );

    if (confirmRestore) {
      const accessToken = await this.getAccessToken();
      let restoredFolder = await this.getOrCreateFolder("Archive", accessToken);

      for (const id of selectedMailIds) {
        try {
          const moveResponse = await fetch(
            `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}/move`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                destinationId: restoredFolder.id,
              }),
            }
          );

          if (moveResponse.ok) {
            this.setEmails((prevEmails) =>
              prevEmails.filter((email) => email.id !== id)
            );
          } else {
            console.error("Failed to restore email ID:", id);
          }
        } catch (error) {
          console.error("Error restoring email ID:", id, error);
        }
      }
    }
  }

  //bulk Move

  async bulkMove(mailIds, folderId) {
    const confirmMove = await this.showConfirmation(
      "Are you sure?",
      "Do you want to move the selected emails?"
    );

    if (!confirmMove) return;

    try {
      const accessToken = await this.getAccessToken();

      // Loop through each email ID and move it to the target folder
      for (const id of mailIds) {
        try {
          const moveResponse = await fetch(
            `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${id}/move`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                destinationId: folderId,
              }),
            }
          );

          if (moveResponse.ok) {
            // Remove the email from the local state
            this.setEmails((prevEmails) =>
              prevEmails.filter((email) => email.id !== id)
            );
          } else {
            console.error(
              `Failed to move email with ID ${id}:`,
              await moveResponse.json()
            );
          }
        } catch (error) {
          console.error(`Error moving email with ID ${id}:`, error);
        }
      }
    } catch (error) {
      console.error("Error in bulk move:", error);
    }
  }

  // Helper function for confirmation dialogs
  async showConfirmation(title, text) {
    return new Promise((resolve) => {
      swal({
        title: title,
        text: text,
        icon: "warning",
        buttons: {
          cancel: "Cancel",
          confirm: {
            text: "Yes",
            value: true,
          },
        },
      }).then((confirm) => resolve(confirm));
    });
  }

  // Helper function to get or create a folder
  async getOrCreateFolder(folderName, accessToken) {
    const folderCheckResponse = await fetch(
      `${process.env.REACT_APP_MICROSOFT_API_URL}/me/mailFolders`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const foldersData = await folderCheckResponse.json();
    let folder = foldersData.value.find(
      (folder) => folder.displayName === folderName
    );

    if (!folder) {
      const createFolderResponse = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/mailFolders`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayName: folderName,
          }),
        }
      );
      folder = await createFolderResponse.json();
    }

    return folder;
  }
}

const mailMinimize = new MailMinimize();
export { mailMinimize, MailMinimize };
