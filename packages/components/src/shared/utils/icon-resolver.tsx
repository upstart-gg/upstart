import type { IconType } from "react-icons";
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

// Icon mapping - same as in the IconifyField component
const ICON_MAP: Record<string, IconType> = {
  // Actions
  "mdi:plus": MdAdd,
  "mdi:minus": MdRemove,
  "mdi:close": MdClose,
  "mdi:check": MdCheck,
  "mdi:check-circle": MdCheckCircle,
  "mdi:close-circle": MdCancel,
  "mdi:edit": MdEdit,
  "mdi:delete": MdDelete,
  "mdi:content-save": MdSave,
  "mdi:download": MdDownload,
  "mdi:upload": MdUpload,
  "mdi:refresh": MdRefresh,
  "mdi:settings": MdSettings,

  // Navigation
  "mdi:arrow-left": MdArrowBack,
  "mdi:arrow-right": MdArrowForward,
  "mdi:arrow-up": MdArrowUpward,
  "mdi:arrow-down": MdArrowDownward,
  "mdi:chevron-left": MdChevronLeft,
  "mdi:chevron-right": MdChevronRight,
  "mdi:chevron-up": MdKeyboardArrowUp,
  "mdi:chevron-down": MdKeyboardArrowDown,
  "mdi:menu": MdMenu,
  "mdi:dots-vertical": MdMoreVert,
  "mdi:dots-horizontal": MdMoreHoriz,
  "mdi:home": MdHome,
  "mdi:account": MdPerson,
  "mdi:logout": MdLogout,

  // Communication
  "mdi:email": MdEmail,
  "mdi:message": MdMessage,
  "mdi:phone": MdPhone,
  "mdi:bell": MdNotifications,
  "mdi:bell-outline": MdNotificationsNone,
  "mdi:chat": MdChat,
  "mdi:comment": MdComment,
  "mdi:heart": MdFavorite,
  "mdi:heart-outline": MdFavoriteBorder,
  "mdi:thumb-up": MdThumbUp,
  "mdi:thumb-down": MdThumbDown,
  "mdi:share": MdShare,
  "mdi:link": MdLink,

  // Files
  "mdi:file": MdInsertDriveFile,
  "mdi:folder": MdFolder,
  "mdi:image": MdImage,
  "mdi:video": MdVideoLibrary,
  "mdi:music": MdLibraryMusic,
  "mdi:file-pdf": MdPictureAsPdf,
  "mdi:file-document": MdDescription,
  "mdi:attachment": MdAttachFile,

  // UI
  "mdi:eye": MdVisibility,
  "mdi:eye-off": MdVisibilityOff,
  "mdi:lock": MdLock,
  "mdi:lock-open": MdLockOpen,
  "mdi:search": MdSearch,
  "mdi:filter": MdFilterList,
  "mdi:sort": MdSort,
  "mdi:calendar": MdCalendarToday,
  "mdi:clock": MdAccessTime,
  "mdi:map-marker": MdLocationOn,
  "mdi:star": MdStar,
  "mdi:star-outline": MdStarBorder,
  "mdi:bookmark": MdBookmark,
  "mdi:bookmark-outline": MdBookmarkBorder,

  // Social Media
  "mdi:facebook": FaFacebook,
  "mdi:instagram": FaInstagram,
  "mdi:twitter": FaTwitter,
  "mdi:linkedin": FaLinkedin,
  "mdi:youtube": FaYoutube,
  "mdi:github": FaGithub,
  "mdi:tiktok": FaTiktok,
  "mdi:pinterest": FaPinterest,
  "mdi:discord": FaDiscord,
  "mdi:whatsapp": FaWhatsapp,
  "mdi:telegram": FaTelegram,
  "mdi:snapchat": FaSnapchat,
  "mdi:reddit": FaReddit,
  "mdi:twitch": FaTwitch,
  "mdi:spotify": FaSpotify,
  "mdi:dribbble": FaDribbble,
  "mdi:behance": FaBehance,
};

/**
 * Resolves an icon name to a React Icons component
 * @param iconName - The icon name (e.g., "mdi:plus")
 * @returns The React Icons component or null if not found
 */
export function resolveIcon(iconName?: string | null): IconType | null {
  if (!iconName) return null;
  return ICON_MAP[iconName] || null;
}

/**
 * Renders an icon with optional size class
 * @param iconName - The icon name (e.g., "mdi:plus")
 * @param className - Additional CSS classes (default: "w-4 h-4")
 * @returns JSX element or null
 */
export function renderIcon(iconName?: string | null, className = "w-4 h-4") {
  const IconComponent = resolveIcon(iconName);
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}
