import React, { useState } from 'react';

const TruncateText = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the expanded state
  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  // If the text length is less than maxLength, no need to show the button
  if (text?.length <= maxLength) {
    return <p className="text-gray-600">{text}</p>;
  }

  return (
    <div>
      <p className="text-gray-600">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={toggleText}
        className="text-blue-500 underline mt-2 focus:outline-none mb-2"
      >
        {isExpanded ? 'Show Less' : 'See More'}
      </button>
    </div>
  );
};

export default TruncateText;
