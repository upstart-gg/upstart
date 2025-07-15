import { Popover } from "@upstart.gg/style-system/system";
import type React from "react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  FaBehance,
  FaDiscord,
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaSnapchat,
  FaSpotify,
  FaTelegram,
  FaTiktok,
  FaTwitch,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import {
  MdAccessTime,
  MdAdd,
  MdArrowBack,
  MdArrowDownward,
  MdArrowForward,
  MdArrowUpward,
  MdAttachFile,
  MdBookmark,
  MdBookmarkBorder,
  MdCalendarToday,
  MdCancel,
  MdChat,
  MdCheck,
  MdCheckCircle,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdComment,
  MdDelete,
  MdDescription,
  MdDownload,
  MdEdit,
  MdEmail,
  MdFavorite,
  MdFavoriteBorder,
  MdFilterList,
  MdFolder,
  MdGridView,
  MdHome,
  MdImage,
  MdInsertDriveFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdLibraryMusic,
  MdLink,
  MdLocationOn,
  MdLock,
  MdLockOpen,
  MdLogout,
  MdMenu,
  MdMessage,
  MdMoreHoriz,
  MdMoreVert,
  MdNotifications,
  MdNotificationsNone,
  MdPerson,
  MdPhone,
  MdPictureAsPdf,
  MdRefresh,
  MdRemove,
  MdSave,
  MdSearch,
  MdSettings,
  MdShare,
  MdSort,
  MdStar,
  MdStarBorder,
  MdThumbDown,
  MdThumbUp,
  MdUpload,
  MdVideoLibrary,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { FieldTitle } from "../field-factory";
import type { FieldProps } from "./types";

// Icon mapping with names and components
export type IconCategory = "Actions" | "Navigation" | "Communication" | "Files" | "UI" | "Social";
type IconComponent = React.ComponentType<{ className?: string }>;

const ICON_CATEGORIES: Record<
  IconCategory,
  Array<{ name: string; component: IconComponent; title: string }>
> = {
  Actions: [
    { name: "mdi:plus", component: MdAdd, title: "Add" },
    { name: "mdi:minus", component: MdRemove, title: "Remove" },
    { name: "mdi:close", component: MdClose, title: "Close" },
    { name: "mdi:check", component: MdCheck, title: "Check" },
    { name: "mdi:check-circle", component: MdCheckCircle, title: "Check Circle" },
    { name: "mdi:close-circle", component: MdCancel, title: "Cancel" },
    { name: "mdi:edit", component: MdEdit, title: "Edit" },
    { name: "mdi:delete", component: MdDelete, title: "Delete" },
    { name: "mdi:content-save", component: MdSave, title: "Save" },
    { name: "mdi:download", component: MdDownload, title: "Download" },
    { name: "mdi:upload", component: MdUpload, title: "Upload" },
    { name: "mdi:refresh", component: MdRefresh, title: "Refresh" },
    { name: "mdi:settings", component: MdSettings, title: "Settings" },
  ],
  Navigation: [
    { name: "mdi:arrow-left", component: MdArrowBack, title: "Arrow Left" },
    { name: "mdi:arrow-right", component: MdArrowForward, title: "Arrow Right" },
    { name: "mdi:arrow-up", component: MdArrowUpward, title: "Arrow Up" },
    { name: "mdi:arrow-down", component: MdArrowDownward, title: "Arrow Down" },
    { name: "mdi:chevron-left", component: MdChevronLeft, title: "Chevron Left" },
    { name: "mdi:chevron-right", component: MdChevronRight, title: "Chevron Right" },
    { name: "mdi:chevron-up", component: MdKeyboardArrowUp, title: "Chevron Up" },
    { name: "mdi:chevron-down", component: MdKeyboardArrowDown, title: "Chevron Down" },
    { name: "mdi:menu", component: MdMenu, title: "Menu" },
    { name: "mdi:dots-vertical", component: MdMoreVert, title: "More Options" },
    { name: "mdi:dots-horizontal", component: MdMoreHoriz, title: "More Options" },
    { name: "mdi:home", component: MdHome, title: "Home" },
    { name: "mdi:account", component: MdPerson, title: "Account" },
    { name: "mdi:logout", component: MdLogout, title: "Logout" },
  ],
  Communication: [
    { name: "mdi:email", component: MdEmail, title: "Email" },
    { name: "mdi:message", component: MdMessage, title: "Message" },
    { name: "mdi:phone", component: MdPhone, title: "Phone" },
    { name: "mdi:bell", component: MdNotifications, title: "Notifications" },
    { name: "mdi:bell-outline", component: MdNotificationsNone, title: "Notifications (Empty)" },
    { name: "mdi:chat", component: MdChat, title: "Chat" },
    { name: "mdi:comment", component: MdComment, title: "Comment" },
    { name: "mdi:heart", component: MdFavorite, title: "Heart" },
    { name: "mdi:heart-outline", component: MdFavoriteBorder, title: "Heart (Outline)" },
    { name: "mdi:thumb-up", component: MdThumbUp, title: "Thumbs Up" },
    { name: "mdi:thumb-down", component: MdThumbDown, title: "Thumbs Down" },
    { name: "mdi:share", component: MdShare, title: "Share" },
    { name: "mdi:link", component: MdLink, title: "Link" },
  ],
  Files: [
    { name: "mdi:file", component: MdInsertDriveFile, title: "File" },
    { name: "mdi:folder", component: MdFolder, title: "Folder" },
    { name: "mdi:image", component: MdImage, title: "Image" },
    { name: "mdi:video", component: MdVideoLibrary, title: "Video" },
    { name: "mdi:music", component: MdLibraryMusic, title: "Music" },
    { name: "mdi:file-pdf", component: MdPictureAsPdf, title: "PDF" },
    { name: "mdi:file-document", component: MdDescription, title: "Document" },
    { name: "mdi:attachment", component: MdAttachFile, title: "Attachment" },
  ],
  UI: [
    { name: "mdi:eye", component: MdVisibility, title: "Show" },
    { name: "mdi:eye-off", component: MdVisibilityOff, title: "Hide" },
    { name: "mdi:lock", component: MdLock, title: "Lock" },
    { name: "mdi:lock-open", component: MdLockOpen, title: "Unlock" },
    { name: "mdi:search", component: MdSearch, title: "Search" },
    { name: "mdi:filter", component: MdFilterList, title: "Filter" },
    { name: "mdi:sort", component: MdSort, title: "Sort" },
    { name: "mdi:calendar", component: MdCalendarToday, title: "Calendar" },
    { name: "mdi:clock", component: MdAccessTime, title: "Clock" },
    { name: "mdi:map-marker", component: MdLocationOn, title: "Location" },
    { name: "mdi:star", component: MdStar, title: "Star" },
    { name: "mdi:star-outline", component: MdStarBorder, title: "Star (Outline)" },
    { name: "mdi:bookmark", component: MdBookmark, title: "Bookmark" },
    { name: "mdi:bookmark-outline", component: MdBookmarkBorder, title: "Bookmark (Outline)" },
  ],
  Social: [
    { name: "mdi:facebook", component: FaFacebook, title: "Facebook" },
    { name: "mdi:instagram", component: FaInstagram, title: "Instagram" },
    { name: "mdi:twitter", component: FaTwitter, title: "Twitter" },
    { name: "mdi:linkedin", component: FaLinkedin, title: "LinkedIn" },
    { name: "mdi:youtube", component: FaYoutube, title: "YouTube" },
    { name: "mdi:github", component: FaGithub, title: "GitHub" },
    { name: "mdi:tiktok", component: FaTiktok, title: "TikTok" },
    { name: "mdi:pinterest", component: FaPinterest, title: "Pinterest" },
    { name: "mdi:discord", component: FaDiscord, title: "Discord" },
    { name: "mdi:whatsapp", component: FaWhatsapp, title: "WhatsApp" },
    { name: "mdi:telegram", component: FaTelegram, title: "Telegram" },
    { name: "mdi:snapchat", component: FaSnapchat, title: "Snapchat" },
    { name: "mdi:reddit", component: FaReddit, title: "Reddit" },
    { name: "mdi:twitch", component: FaTwitch, title: "Twitch" },
    { name: "mdi:spotify", component: FaSpotify, title: "Spotify" },
    { name: "mdi:dribbble", component: FaDribbble, title: "Dribbble" },
    { name: "mdi:behance", component: FaBehance, title: "Behance" },
  ],
};

const IconifyField: FC<
  FieldProps<string> & {
    categories?: IconCategory[];
  }
> = ({ currentValue, onChange, title, description, placeholder, categories }) => {
  // Filter available categories based on the categories prop
  const availableCategories = categories
    ? (Object.keys(ICON_CATEGORIES).filter((cat) =>
        categories.includes(cat as IconCategory),
      ) as IconCategory[])
    : (Object.keys(ICON_CATEGORIES) as IconCategory[]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IconCategory>(availableCategories[0] || "Actions");

  // Update selected category if it's not in available categories
  useEffect(() => {
    if (!availableCategories.includes(selectedCategory)) {
      setSelectedCategory(availableCategories[0] || "Actions");
    }
  }, [availableCategories, selectedCategory]);

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
  };

  // Find current icon for display (search in all categories, not just filtered ones)
  const currentIcon = Object.values(ICON_CATEGORIES)
    .flat()
    .find((icon) => icon.name === currentValue);

  return (
    <div className="flex justify-between flex-1 pr-1 gap-1">
      <FieldTitle title={title} description={description} />

      <div className="flex items-center gap-1">
        {/* Current icon preview */}
        {currentIcon && (
          <div className="w-6 h-6 flex items-center justify-center">
            <currentIcon.component className="w-4 h-4" />
          </div>
        )}

        {/* Button to open selector */}
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger>
            <button type="button" className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border">
              <MdGridView className="w-4 h-4" />
            </button>
          </Popover.Trigger>

          <Popover.Content className="w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="space-y-3">
              {/* Category selector - only show if there are multiple categories */}
              {availableCategories.length > 1 && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as IconCategory)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                >
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}

              {/* Show category title if only one category */}
              {availableCategories.length === 1 && (
                <div className="text-sm font-medium text-gray-700 text-center">{selectedCategory} Icons</div>
              )}

              {/* Icon grid */}
              <div className="max-h-64 overflow-y-auto">
                <div className="grid grid-cols-6 gap-2">
                  {ICON_CATEGORIES[selectedCategory].map((icon) => (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => handleIconSelect(icon.name)}
                      className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center transition-colors ${
                        currentValue === icon.name
                          ? "bg-blue-100 border border-blue-500"
                          : "border border-transparent"
                      }`}
                      title={icon.title}
                    >
                      <icon.component className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="text-xs text-gray-500 pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onChange(null);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  );
};

export default IconifyField;
