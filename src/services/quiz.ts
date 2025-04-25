/**
 * Represents a quiz question with multiple-choice options.
 */
export interface Question {
  /**
   * The text of the question.
   */
  text: string;
  /**
   * The available answer options.
   */
  options: string[];
  /**
   * The index of the correct answer in the options array.
   */
  correctAnswerIndex: number;
}

const questionsPool: Omit<Question, 'correctAnswerIndex'> & { correctAnswer: string }[] = [
  {
    text: "What keyword is used to declare a variable that cannot be reassigned in JavaScript?",
    options: ["let", "var", "const", "static"],
    correctAnswer: "const",
  },
  {
    text: "Which of the following is NOT a primitive data type in JavaScript?",
    options: ["string", "number", "object", "boolean"],
    correctAnswer: "object",
  },
  {
    text: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
    correctAnswer: "Cascading Style Sheets",
  },
  {
    text: "Which HTML tag is used to define an unordered list?",
    options: ["<ol>", "<list>", "<ul>", "<li>"],
    correctAnswer: "<ul>",
  },
   {
    text: "In React, what hook is used to manage state in a functional component?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: "useState",
  },
   {
    text: "What is the purpose of the 'git clone' command?",
    options: ["Create a new branch", "Stage changes for commit", "Copy a remote repository locally", "Merge branches"],
    correctAnswer: "Copy a remote repository locally",
  },
  {
    text: "Which CSS property controls the spacing between letters?",
    options: ["word-spacing", "line-height", "letter-spacing", "text-indent"],
    correctAnswer: "letter-spacing",
  }
];

// Keep track of the last served question index to avoid immediate repeats
let lastQuestionIndex = -1;

/**
 * Asynchronously retrieves a random quiz question from the pool, ensuring it's different from the last one.
 *
 * @returns A promise that resolves to a Question object.
 */
export async function getQuestion(): Promise<Question> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let randomIndex;
  // Ensure the next question is different from the last one, if possible
  if (questionsPool.length > 1) {
      do {
          randomIndex = Math.floor(Math.random() * questionsPool.length);
      } while (randomIndex === lastQuestionIndex);
  } else {
      randomIndex = 0; // Only one question available
  }


  lastQuestionIndex = randomIndex;
  const selectedQuestionData = questionsPool[randomIndex];

  // Find the correct answer index
  const correctAnswerIndex = selectedQuestionData.options.findIndex(
    option => option === selectedQuestionData.correctAnswer
  );

  // Return the question in the expected format
  return {
    text: selectedQuestionData.text,
    options: selectedQuestionData.options,
    correctAnswerIndex: correctAnswerIndex,
  };
}
