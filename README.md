# Online Examination System

The Online Examination System is a backend application developed in ExpressJS with TypeORM, providing a robust platform for conducting online examinations, quizzes, or tests. This system empowers administrators to manage exams, questions, and user enrollments, while allowing students to participate remotely.

## Features

1. **User Authentication:**
   - User registration, login, and authentication mechanisms.
   - Differentiation between administrators (instructors) and students.

2. **Exam Creation and Management:**
   - Create, update, and delete exams.
   - Specify exam details like name, duration, questions, and answers.

3. **Question Bank:**
   - Repository of questions and answers, categorized by subject or topic.

4. **Student Enrollment:**
   - Enable students to enroll in available exams or classes.

5. **Exam Taking:**
   - Secure and time-bound exam-taking process.
   - Question presentation, answers submission, and automatic grading.

6. **Randomized Questions:**
   - Create question banks and generate random question sets for each exam.

7. **Auto-Grading:**
   - Implement auto-grading for multiple-choice and other objective questions.

8. **Exam Analytics:**
   - Generate analytics and reports on student performance.
   - Includes scores, completion times, and question-specific statistics.

## Tech Stack

- **Backend:** ExpressJS, TypeORM
- **Testing:** Jest
- **CI/CD:** GitHub Actions
- **AWS Services:**
  - Autoscaling Group
  - Load Balancer
  - SQS (Simple Queue Service)
  - SES (Simple Email Service)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/online-examination-system.git
2. Install dependencies:
```
npm install

```

## Usage

1.Set up the database:
```
npm run db:migrate
```
2.Run the application :
```
npm run dev
```
## Contributing
Contributions are welcome! If you have any feature suggestions, bug reports, or other improvements, please open an issue or create a pull request.

## License
This project is licensed under the MIT Licens e

