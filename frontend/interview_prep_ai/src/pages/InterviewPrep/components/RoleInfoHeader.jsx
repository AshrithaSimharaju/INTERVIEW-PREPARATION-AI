import React from "react";

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
}) => {
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm">
      {/* Role and Topics Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">{role}</h2>
        <p className="text-sm text-gray-600 mt-1">{topicsToFocus}</p>
      </div>

      {/* Pills for Experience, Questions, Last Updated */}
      <div className="flex flex-wrap gap-3">
        <div className="px-4 py-1 rounded-full bg-black text-white text-sm">
          Experience: {experience} {experience == 1 ? "Year" : "Years"}
        </div>
        <div className="px-4 py-1 rounded-full bg-black text-white text-sm">
          {questions} Q&A
        </div>
        <div className="px-4 py-1 rounded-full bg-black text-white text-sm">
          Last Updated: {lastUpdated}
        </div>
      </div>

      {/* Optional: Description */}
      {description && (
        <div className="mt-4">
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      )}
    </div>
  );
};

export default RoleInfoHeader;
