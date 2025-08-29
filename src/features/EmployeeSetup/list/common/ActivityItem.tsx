// import React from "react";

// // Define the shape of a single activity's data
// export interface Activity {
//   id: string;
//   date: string;
//   time: string;
//   description: string;
//   authorName: string;
//   authorAvatarUrl?: string; // Avatar is optional
// }

// interface ActivityItemProps {
//   activity: Activity;
// }

// // A helper to get initials if no avatar is provided
// const getInitials = (name: string): string => {
//   const parts = name.split(" ");
//   if (parts.length > 1) {
//     return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
//   }
//   return name.substring(0, 2).toUpperCase();
// };

// const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
//   return (
//     <div className="flex gap-x-4">
//       {/* Timestamp */}
//       <div className="w-24 flex-shrink-0 text-right text-sm text-gray-500">
//         <div>{activity.date}</div>
//         <div className="text-xs">{activity.time}</div>
//       </div>

//       {/* Timeline Gutter (Line and Dot) */}
//       <div className="relative w-4 flex-shrink-0 flex justify-center">
//         <div className="absolute top-1 bottom-0 w-0.5 bg-gray-200"></div>
//         <div className="relative z-10 h-3 w-3 rounded-full bg-gray-400 border-2 border-white"></div>
//       </div>

//       {/* Content */}
//       <div className="flex-grow flex items-start gap-x-3 pb-8">
//         {/* Avatar */}
//         <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
//           {activity.authorAvatarUrl ? (
//             <img
//               src={activity.authorAvatarUrl}
//               alt={activity.authorName}
//               className="h-full w-full rounded-full object-cover"
//             />
//           ) : (
//             <span>{getInitials(activity.authorName)}</span>
//           )}
//         </div>

//         {/* Description */}
//         <div className="flex-grow text-sm">
//           <p className="text-gray-800">{activity.description}</p>
//           <p className="text-xs text-gray-500 mt-0.5">
//             By: {activity.authorName}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ActivityItem;
import React from "react";

// Define the shape of a single activity's data
export interface Activity {
  id: string;
  date: string;
  time: string;
  description: string;
  authorName: string;
  authorAvatarUrl?: string; // Avatar is optional
}

interface ActivityItemProps {
  activity: Activity;
}

// A helper to get initials if no avatar is provided
const getInitials = (name: string): string => {
  const parts = name.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div className="flex gap-x-4">
      {/* Timestamp */}
      <div className="w-24 flex-shrink-0 text-right text-sm text-gray-500">
        <div>{activity.date}</div>
        <div className="text-xs">{activity.time}</div>
      </div>

      {/* Timeline Gutter (Line and Dot) */}
      <div className="relative w-4 flex-shrink-0 flex justify-center">
        <div className="absolute top-1 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="relative z-10 h-3 w-3 rounded-full bg-gray-400 border-2 border-white"></div>
      </div>

      {/* Content */}
      <div className="flex-grow flex items-start gap-x-3 pb-8">
        {/* Avatar */}
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
          {activity.authorAvatarUrl ? (
            <img
              src={activity.authorAvatarUrl}
              alt={activity.authorName}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span>{getInitials(activity.authorName)}</span>
          )}
        </div>

        {/* Description */}
        <div className="flex-grow text-sm">
          <p className="text-gray-800">{activity.description}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            By: {activity.authorName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;