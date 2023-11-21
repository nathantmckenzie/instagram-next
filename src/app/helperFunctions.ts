export const timeSincePosted = (time: string): string => {
  // Create a new date object from the timestamp in GMT
  console.log("time", time);
  const gmtDate = new Date(time);

  // Get the timezone offset for the PST timezone
  const pstOffset = -7 * 60 * 60 * 1000; // PST is 8 hours behind GMT

  // Convert the timestamp from GMT to PST by adding the timezone offset
  const pstTimestamp = gmtDate.getTime() + pstOffset;

  const currentTimestamp = new Date().getTime();
  const diffMs = currentTimestamp - pstTimestamp;

  // Calculate the difference in seconds, minutes, hours, days, and weeks
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

  if (diffSecs <= 1) {
    return "Now";
  } else if (diffSecs <= 59) {
    return `${diffSecs}s`;
  } else if (diffMins <= 59) {
    return `${diffMins}m`;
  } else if (diffHours <= 23) {
    return `${diffHours}h`;
  } else if (diffDays <= 6) {
    return `${diffDays}d`;
  } else {
    return `${diffWeeks}w`;
  }
};

export const formatDate = (
  dateString: string,
  previousDateString: string,
  recentMessages: string[],
  previousID: string
): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  const previousDate = new Date(previousDateString);
  const diffPreviousDateString = date.getTime() - previousDate.getTime();
  const diffInMinutes = diffPreviousDateString / (1000 * 60);

  if (diffInMinutes < 5) {
    recentMessages.push(previousID);
    return "";
  } else {
    if (diffInDays < 1) {
      // Today's date, display only time
      return date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } else if (diffInDays < 2) {
      // Yesterday
      return `Yesterday, ${date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}`;
    } else if (diffInDays < 6) {
      // Within the past week
      const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
      return `${dayOfWeek}, ${date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}`;
    } else {
      // More than a week ago
      return date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }
  }
};
