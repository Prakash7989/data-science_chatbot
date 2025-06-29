import React, { useState, useRef, useEffect, useMemo } from "react";

// Simple icon components (same as before)
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
  </svg>
);

const IconCopy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

const IconMessage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-3h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconDatabase = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const IconCpu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);

const IconTrending = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
    <polyline points="17,6 23,6 23,12"></polyline>
  </svg>
);

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const IconSun = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const IconMoon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

// New Icon: Trash
const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);


// Define the initial bot message content and a stable ID
const initialBotMessageContent = "Hello! I'm your Data Science assistant. Ask me about algorithms, machine learning, statistics, or any data science concepts.";
const initialBotMessage = { from: "bot", text: initialBotMessageContent, id: 'initial-bot-msg' };


export default function App() {
  // State to hold all conversations
  const [allConversations, setAllConversations] = useState(() => {
    const savedConversations = localStorage.getItem('dsChatConversations');
    try {
      const loadedConvs = savedConversations ? JSON.parse(savedConversations) : [];
      // Ensure message IDs exist for loaded messages that might not have them from older saves
      loadedConvs.forEach(conv => {
         conv.messages = conv.messages.map(msg => ({
             ...msg,
             id: msg.id || Date.now() + Math.random() // Assign ID if missing
         }));
      });
      return loadedConvs;
    } catch (e) {
      console.error("Failed to parse conversations from localStorage:", e);
      return [];
    }
  });

  // State to hold the ID of the currently active conversation
  const [activeConversationId, setActiveConversationId] = useState(() => {
    const savedActiveId = localStorage.getItem('dsChatActiveConversationId');
    // Check if the saved ID actually exists in the loaded conversations
    const loadedConversations = JSON.parse(localStorage.getItem('dsChatConversations') || '[]');
    if (savedActiveId && loadedConversations.some(conv => conv.id === savedActiveId)) {
        return savedActiveId;
    }
    return null; // Start with no active conversation (new chat) if saved ID is invalid or none saved
  });

  // Derived state: messages for the currently active conversation
  // Use useMemo to only recompute when dependencies change
  const currentMessages = useMemo(() => {
    const activeConv = allConversations.find(conv => conv.id === activeConversationId);
    if (activeConv) {
       return activeConv.messages;
    }
    // If no active conversation ID (new chat), show the initial bot message
    return [initialBotMessage];
  }, [allConversations, activeConversationId]); // Re-compute if conversations or active ID change

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null); // Changed name from copiedIndex for clarity
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const chatEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Effect to scroll to the end of the chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, loading]); // Scroll when currentMessages or loading state changes

  // Effect to handle responsiveness and sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Collapse sidebar on mobile
      } else {
        setSidebarOpen(true); // Expand sidebar on desktop (can be refined to remember state)
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect to save all conversations and active ID to localStorage whenever they change
  useEffect(() => {
    try {
        localStorage.setItem('dsChatConversations', JSON.stringify(allConversations));
        localStorage.setItem('dsChatActiveConversationId', activeConversationId);
    } catch (e) {
        console.error("Failed to save conversations to localStorage:", e);
    }
  }, [allConversations, activeConversationId]);

  // Effect to set dark mode class on the root element
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);


  // Function to start a new chat
  const startNewChat = () => {
    setActiveConversationId(null); // Setting active ID to null triggers the derived state to show initial message
    setInput(""); // Clear input field
    setError(null); // Clear error state
    if (isMobile) setSidebarOpen(false); // Close sidebar on mobile after starting new chat
  };

  // Function to load an existing chat
  const loadConversation = (convId) => {
    setActiveConversationId(convId);
    setInput(""); // Clear input field when switching chats
    setError(null); // Clear error state when switching chats
    if (isMobile) setSidebarOpen(false); // Close sidebar on mobile after loading chat
  };

  // Function to delete a conversation
  const deleteConversation = (convIdToDelete) => {
      // Optional: Add a confirmation prompt here
      // if (!window.confirm("Are you sure you want to delete this chat?")) {
      //     return;
      // }

      setAllConversations(prevConversations => {
          // Filter out the conversation to delete
          const updatedConversations = prevConversations.filter(conv => conv.id !== convIdToDelete);
          return updatedConversations;
      });

      // If the deleted conversation was the active one, switch to a new chat
      if (activeConversationId === convIdToDelete) {
          startNewChat(); // This will set activeConversationId to null
      }
  };


  async function sendMessage() {
    if (!input.trim() || loading) return; // Prevent sending empty or while loading

    const messageToSend = input.trim();
    const userMsg = { from: "user", text: messageToSend, id: Date.now() + Math.random() }; // Add unique ID

    // Determine the conversation ID this message belongs to *before* state updates
    // If activeConversationId is null, generate a new one. Otherwise, use the current one.
    const convIdForUpdate = activeConversationId === null ? Date.now().toString() : activeConversationId;

    // Clear input, set loading, and update state in ONE functional update
    // This adds the user message optimistically
    setInput(""); // Clear input immediately
    setLoading(true);
    setError(null); // Clear any previous error

    setAllConversations(prevConversations => {
        let updatedConversations = [...prevConversations];
        let conversationIndex = updatedConversations.findIndex(conv => conv.id === convIdForUpdate);
        let conversationToUpdate;

        if (activeConversationId === null) { // This is the start of a NEW chat
            const newName = messageToSend.substring(0, 30) + (messageToSend.length > 30 ? '...' : '');
             // New conversations start with the initial bot message AND the first user message
             // We add the initialBotMessage here explicitly for new chats.
            conversationToUpdate = {
                id: convIdForUpdate, // Use the determined new ID
                name: newName,
                messages: [initialBotMessage, userMsg] // Explicitly add initial bot + user message
            };
            updatedConversations.push(conversationToUpdate);
            // conversationIndex will be the last element after push
            conversationIndex = updatedConversations.length - 1;


        } else { // This is an EXISTING chat
             if (conversationIndex !== -1) {
                  conversationToUpdate = { ...updatedConversations[conversationIndex] }; // Clone the conversation object
                  // Add user message if it's not already the last message (defensive check against double adds)
                  // Also check if message text matches (less reliable but adds robustness)
                  const lastMsg = conversationToUpdate.messages[conversationToUpdate.messages.length - 1];
                  if (conversationToUpdate.messages.length === 0 || lastMsg.id !== userMsg.id || lastMsg.text !== userMsg.text) {
                       conversationToUpdate.messages = [...conversationToUpdate.messages, userMsg]; // Add user message
                   } else {
                       console.warn("Skipping potentially duplicate user message addition based on ID or text.");
                   }
                  updatedConversations[conversationIndex] = conversationToUpdate; // Replace in array
             } else {
                  // This case should ideally not happen if activeConversationId is valid
                  console.error("Active conversation not found for user message addition! ID:", convIdForUpdate);
                  // Return previous state to avoid errors, though UI might be inconsistent
                  return prevConversations;
             }
        }

        // Sort conversations by ID (timestamp) descending for "Recent Chats" list
        // Ensures the latest chat is always at the top
        updatedConversations.sort((a, b) => parseInt(b.id) - parseInt(a.id));

        return updatedConversations; // Return the updated list of conversations
    });

     // If it was a new chat, update the activeConversationId state *after* the conversations state is updated
     // This ensures the UI switches to view the new chat.
     if (activeConversationId === null) {
        setActiveConversationId(convIdForUpdate);
     }


    try {
      const formData = new FormData();
      formData.append("msg", messageToSend); // Use the stored messageToSend

      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
          const errorData = await res.json().catch(() => ({})); // Attempt to parse error JSON
          throw new Error(errorData.error || `Failed to fetch response: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const botMsg = { from: "bot", text: data.answer, id: Date.now() + Math.random() }; // Add unique ID

      // Add bot message to the conversation after receiving it
      setAllConversations(prevConversations => {
          // Find the conversation again using the ID that was set earlier or just generated
           const convIndex = prevConversations.findIndex(conv => conv.id === convIdForUpdate);

           if (convIndex !== -1) {
               const updatedConvs = [...prevConversations];
               const conversationToUpdate = { ...updatedConvs[convIndex] }; // Clone
                // Add bot message if it's not already the last message
               const lastMsg = conversationToUpdate.messages[conversationToUpdate.messages.length - 1];
                if (conversationToUpdate.messages.length === 0 || lastMsg.id !== botMsg.id || lastMsg.text !== botMsg.text) {
                   conversationToUpdate.messages = [...conversationToUpdate.messages, botMsg]; // Add bot message
                } else {
                   console.warn("Skipping potentially duplicate bot message addition based on ID or text.");
                }

                updatedConvs[convIndex] = conversationToUpdate; // Replace
               // Re-sort again in case bot message arrival order affects list order (unlikely with timestamp IDs)
                updatedConvs.sort((a, b) => parseInt(b.id) - parseInt(a.id));
               return updatedConvs;
           }
           // This case should ideally not be reached if the user message was added successfully
           console.error("Conversation not found when adding bot message! ID:", convIdForUpdate);
           return prevConversations;
      });

    } catch (err) {
      console.error("Error sending message:", err); // Log error to console
      const errorBotMsg = { from: "bot", text: `Sorry, something went wrong: ${err.message}`, id: Date.now() + Math.random() }; // Add unique ID, show error to user

      // Add error message to the conversation
       setAllConversations(prevConversations => {
           const convIndex = prevConversations.findIndex(conv => conv.id === convIdForUpdate);

           if (convIndex !== -1) {
               const updatedConvs = [...prevConversations];
               const conversationToUpdate = { ...updatedConvs[convIndex] };
                // Add error message if it's not already the last message
               const lastMsg = conversationToUpdate.messages[conversationToUpdate.messages.length - 1];
                if (conversationToUpdate.messages.length === 0 || lastMsg.id !== errorBotMsg.id || lastMsg.text !== errorBotMsg.text) {
                    conversationToUpdate.messages = [...conversationToUpdate.messages, errorBotMsg]; // Add error message
                } else {
                     console.warn("Skipping potentially duplicate error message addition based on ID or text.");
                }
               updatedConvs[convIndex] = conversationToUpdate;
               updatedConvs.sort((a, b) => parseInt(b.id) - parseInt(a.id));
               return updatedConvs;
           }
           console.error("Conversation not found when adding error message! ID:", convIdForUpdate);
           return prevConversations;
      });
      setError(err.message); // Keep the error state to show message below input
    } finally {
      setLoading(false);
    }
  }


  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const copyToClipboard = (text, key) => { // Use 'key' parameter
    navigator.clipboard.writeText(text);
    setCopiedKey(key); // Set the key of the copied item
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Pass message ID or a unique identifier as messageKey
  const renderMessageContent = (text, messageKey) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = text.split(codeBlockRegex);

    return parts.map((part, i) => {
      // Create a unique key for each part within a message
      const uniquePartKey = `${messageKey}-${i}`;

      if (i % 2 === 1) {
        // This is a code block
        return (
          <div key={`part-${uniquePartKey}`} className="relative group mt-3"> {/* Use unique key for element */}
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto border border-slate-800">
              <code className="text-sm font-mono leading-relaxed">{part}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(part, `copy-${uniquePartKey}`)} // Use unique key for copy button state
              className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 ${ // Show on group hover
                copiedKey === `copy-${uniquePartKey}` // Compare with the key stored in state
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
              title="Copy code"
            >
              {copiedKey === `copy-${uniquePartKey}` ? <IconCheck /> : <IconCopy />}
            </button>
          </div>
        );
      }
      // This is regular text
      return part ? <div key={`part-${uniquePartKey}`} className="whitespace-pre-wrap leading-relaxed">{part}</div> : null; // Use unique key for element
    });
  };


  const quickActions = [
    { icon: IconDatabase, label: "Data Analysis", desc: "Explore datasets and statistics" },
    { icon: IconCpu, label: "ML Models", desc: "Machine learning algorithms" },
    { icon: IconTrending, label: "Visualization", desc: "Charts and graphs" },
    { icon: IconMessage, label: "Code Examples", desc: "Programming examples" }
  ];

  const topics = [
    "Linear Regression", "Neural Networks", "Random Forest", "K-Means Clustering",
    "Data Preprocessing", "Feature Engineering", "Cross Validation", "Hyperparameter Tuning"
  ];

  // Determine if the welcome screen should be shown
  // Show welcome if there are no conversations AND no active chat OR if the current view IS a new chat (activeConversationId === null)
  // AND the current messages array derived state is JUST the initial bot message.
   const showWelcomeScreen = allConversations.length === 0 || (activeConversationId === null && currentMessages.length === 1 && currentMessages[0].id === initialBotMessage.id);


  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Sidebar */}
       {/* Use fixed positioning for the sidebar on mobile when open, and overlay */}
      <div className={`flex-col transition-transform duration-300 ease-in-out ${
           isMobile ?
           (sidebarOpen ? 'fixed inset-y-0 left-0 w-64 md:w-72 lg:w-80 z-40 transform translate-x-0' : 'fixed inset-y-0 left-0 w-64 md:w-72 lg:w-80 z-40 transform -translate-x-full')
           :
           (sidebarOpen ? "w-64 md:w-72 lg:w-80" : "w-16")
        } ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
      } border-r flex overflow-hidden`}> {/* Added flex-col and overflow-hidden */}
        {/* Header */}
        <div className={`p-4 md:p-6 ${darkMode ? 'border-gray-700' : 'border-slate-200'} border-b flex-shrink-0`}> {/* flex-shrink-0 to prevent shrinking */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white"> {/* Added text-white for icon */}
              <IconDatabase />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>MaLeana</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Data Science Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-2 md:p-4 overflow-y-auto custom-scrollbar"> {/* flex-1 to take available space, added custom-scrollbar class */}
          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-4 ${
              activeConversationId === null // Highlight if it's a new chat
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <IconMessage />
            {sidebarOpen && <span>New Chat</span>}
          </button>

          {/* Recent Chats List */}
          {sidebarOpen && allConversations.length > 0 && (
            <>
              <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Recent Chats
              </div>
              <div className="space-y-2">
                {/* Display last 5 conversations (sorted by ID descending) */}
                {allConversations.slice(0, 5).map((conv) => (
                  // Use a div as the container to allow multiple interactive elements
                  <div
                    key={conv.id} // Use conv.id as key for the container
                    className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-sm truncate ${
                      conv.id === activeConversationId
                        ? 'bg-blue-100 text-blue-800 font-semibold'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                     {/* Clickable area for conversation name */}
                    <button
                       onClick={() => loadConversation(conv.id)}
                       className="flex-1 text-left mr-2 truncate" // flex-1 to take space, mr-2 for spacing
                       title={conv.name}
                    >
                      {conv.name}
                    </button>

                    {/* Delete Button - Only visible when sidebar is open */}
                    {sidebarOpen && (
                        <button
                           onClick={(e) => {
                               e.stopPropagation(); // Prevent click from propagating to parent div/button
                               deleteConversation(conv.id);
                           }}
                           className={`p-1 rounded-md transition-colors ${
                             darkMode
                               ? 'text-gray-400 hover:text-red-500 hover:bg-gray-600'
                               : 'text-slate-500 hover:text-red-600 hover:bg-slate-200'
                           }`}
                           title={`Delete chat "${conv.name}"`}
                       >
                           <IconTrash />
                       </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
           {/* Collapsed sidebar view (optional, simplified) */}
           {!sidebarOpen && (
               <div className={`flex flex-col items-center pt-4 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  {/* IconMessage is often just for the "New Chat" button, maybe remove this here? */}
                  {/* <IconMessage className="mb-2" /> */}
                  {allConversations.slice(0, 5).map((conv) => (
                       <button // Use button for semantic correctness and focus states
                           key={conv.id}
                           className={`w-full text-center py-2 rounded-xl transition-colors text-xs truncate ${
                             conv.id === activeConversationId
                               ? 'bg-blue-100 text-blue-800 font-semibold'
                               : darkMode
                                 ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                 : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                           }`}
                          onClick={() => loadConversation(conv.id)} // Make collapsed items clickable
                           title={conv.name}
                       >
                         {conv.name.charAt(0).toUpperCase()} {/* Show first letter */}
                       </button>
                   ))}
               </div>
           )}
        </div>

        {/* Dark Mode Toggle & Sidebar Toggle */}
        <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-slate-200'} border-t flex-shrink-0`}> {/* flex-shrink-0 */}
          <div className="flex items-center justify-end"> {/* Align items to the right */}
             {!isMobile && sidebarOpen && ( // Desktop: show theme toggle when sidebar is open
               <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors mr-auto ${ // Add mr-auto to push to the left
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-slate-100 text-slate-600'
                }`}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <IconSun /> : <IconMoon />}
              </button>
             )}

            {!isMobile && ( // Desktop: show sidebar toggle
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-slate-100 text-slate-600'
                }`}
                title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                <IconMenu />
              </button>
            )}
             {isMobile && ( // Mobile: show theme toggle (always visible in footer)
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-slate-100 text-slate-600'
                }`}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <IconSun /> : <IconMoon />}
              </button>
            )}
          </div>
        </div>
         {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-30"
                onClick={() => setSidebarOpen(false)}
            ></div>
        )}
      </div>


      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden z-20"> {/* Ensure main content is above mobile overlay */}
        {/* Top Bar with mobile menu button */}
        <header className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } border-b px-4 py-3 md:px-6 md:py-4 flex items-center justify-between flex-shrink-0`}> {/* flex-shrink-0 */}
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`mr-3 p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-slate-100 text-slate-600'
                }`}
                title="Open sidebar"
              >
                <IconMenu />
              </button>
            )}
            <div>
              <h2 className={`text-lg md:text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                 {/* Display chat name or "New Chat" */}
                 {activeConversationId === null
                   ? 'New Chat'
                   : allConversations.find(c => c.id === activeConversationId)?.name || 'Chat'
                 }
              </h2>
              <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Ask questions about data science</p>
            </div>
          </div>
          {/* Mobile theme toggle moved to sidebar footer */}
        </header>

        {/* Chat Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar"> {/* Added custom-scrollbar class */}
              {showWelcomeScreen ? (
                 <div className="text-center py-8 md:py-12">
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 md:mb-6 text-white"> {/* Added text-white for icon color */}
                    <IconMessage />
                  </div>
                  <h3 className={`text-lg md:text-xl font-semibold ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  } mb-2`}>Ready to help with Data Science!</h3>
                  <p className={`${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  } mb-6 md:mb-8 text-sm md:text-base`}>Ask me about algorithms, code examples, or concepts</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto mb-6 md:mb-8">
                    {quickActions.map((action, i) => (
                      <button
                        key={i} // Index is okay here as list is static
                        onClick={() => setInput(`Tell me about ${action.label.toLowerCase()}`)}
                        className={`p-3 md:p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left border ${
                          darkMode
                            ? 'bg-gray-800 border-gray-700 hover:border-blue-600 hover:bg-gray-750'
                            : 'bg-white border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-blue-500 mb-1 md:mb-2">
                          <action.icon />
                        </div>
                        <div className={`font-medium text-sm md:text-base ${
                          darkMode ? 'text-white' : 'text-slate-800'
                        }`}>{action.label}</div>
                        <div className={`text-xs md:text-sm ${
                          darkMode ? 'text-gray-400' : 'text-slate-500'
                        }`}>{action.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {topics.map((topic, i) => (
                      <button
                        key={i} // Index is okay here as list is static
                        onClick={() => setInput(`Explain ${topic}`)}
                        className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm transition-colors duration-200 ${
                          darkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // Render messages for the active chat
                currentMessages.map((msg) => ( // Use msg.id as the key
                  <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-full md:max-w-4xl rounded-2xl px-4 py-3 md:px-6 md:py-4 ${
                      msg.from === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                        : darkMode
                          ? "bg-gray-800 border border-gray-700 text-gray-100 shadow-sm"
                          : "bg-white border border-slate-200 text-slate-800 shadow-sm"
                    }`}>
                      {/* Only show bot icon/label if it's not the initial welcome message, AND there's more than just the welcome message */}
                      {msg.from === "bot" && msg.id !== initialBotMessage.id && (
                         <div className="flex items-center mb-2">
                           <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mr-2"></div>
                           <span className={`text-xs md:text-sm font-medium ${
                             darkMode ? 'text-gray-400' : 'text-slate-600'
                           }`}>DS Assistant</span>
                         </div>
                       )}
                      <div className="prose prose-sm max-w-none">
                        {renderMessageContent(msg.text, msg.id)} {/* Pass message ID */}
                      </div>
                    </div>
                  </div>
                ))
              )}


              {loading && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-sm border ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className={`text-xs md:text-sm ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} /> {/* Scroll target */}
            </div>

            {/* Input Area */}
            <div className={`border-t p-4 md:p-6 ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-slate-200 bg-white'
            } flex-shrink-0`}> {/* flex-shrink-0 */}
              <div className="flex space-x-3 md:space-x-4 items-end">
                <div className="flex-1">
                  <textarea
                    rows={1} // Start with 1 row
                    placeholder="Ask me about data science, machine learning, statistics..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full border rounded-xl px-4 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden ${ // Added overflow-hidden to prevent scrollbar on initial load
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
                    }`}
                    disabled={loading}
                    style={{ height: 'auto' }} // Allow height to adjust
                    // Dynamic row adjustment (optional but nice UX)
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = (e.target.scrollHeight) + 'px';
                    }}
                  />
                  {error && (
                    <div className="mt-1 md:mt-2 text-red-500 text-xs md:text-sm">{error}</div>
                  )}
                </div>
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                    loading || !input.trim()
                      ? darkMode
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  <IconSend />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </main>
        </div>
    </div>
  );
}

// Add some basic CSS for the custom scrollbar if needed
// You can add this in index.css or App.css
/*
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: #333;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #555;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #777;
}

*/