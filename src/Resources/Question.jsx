import React from 'react';
import PropTypes from 'prop-types';

const Question = ({ number, question, options, answer }) => {
  return (
    <div className="question">
      <h2>{question}</h2>
      <ul>
        {options.map((option, index) => (
          <li key={index}>
            <p>{option}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

Question.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAnswer: PropTypes.func.isRequired,
};

export default Question;
