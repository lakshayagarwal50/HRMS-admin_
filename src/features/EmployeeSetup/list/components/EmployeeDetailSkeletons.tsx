export const EmployeeDetailHeaderSkeleton: React.FC = () => (
  <header className="mb-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-2"></div>
    <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
  </header>
);

export const ProfileSidebarSkeleton: React.FC = () => {
  const SKELETON_ITEM_COUNT = 12;
  return (
    <div className="w-full md:w-[260px] font-sans shrink-0 animate-pulse">
      <ul className="list-none m-0 p-0 overflow-hidden rounded-lg border-2 border-gray-200">
        {Array.from({ length: SKELETON_ITEM_COUNT }).map((_, index) => (
          <li
            key={index}
            className="py-4 pr-6 pl-6 border-b border-gray-200 last:border-b-0"
          >
            <div className="h-5 bg-gray-200 rounded"></div>
          </li>
        ))}
      </ul>
    </div>
  );
};


export const MainContentSkeleton: React.FC = () => (
  <div className="flex-grow w-full bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
    <div className="space-y-4">
      <div className="h-8 w-1/4 bg-gray-200 rounded-md"></div>
      <div className="h-5 w-full bg-gray-200 rounded-md"></div>
      <div className="h-5 w-5/6 bg-gray-200 rounded-md"></div>
      <div className="h-5 w-3/4 bg-gray-200 rounded-md mt-6"></div>
    </div>
  </div>
);