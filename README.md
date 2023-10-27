# Online-Examination-System

 This is the backend code for examination system that allow instructor to insert questions, exams and enroll it's students to spicific exam, Also the users can solve the exams that they are enrolled in and get them responses.

Endpoint: POST /home/signup
***

Description

Endpoint for user registration

Request Body

|   Field  |  Type  |     Description      | Required |
 ----------|--------|----------------------|----------|
|name      | String | The name of the user |    Yes   |
|username  | String | unique short name    |    Yes   |
|email     | String | the user email       |    Yes   |
|password  | String | The user password    |    Yes   |
|type      | String | Student/instructor   |    Yes   |

Responses

201 - Created

user succefully singed up and added to the database

Example Value:

```
{
 "name": "Mohammad",
 
 "username": "moha",
 
 "email": "201160@ppu.edu.ps",

"password": "123456",

"type": "instructor"
 
}
```

400 - Bad Request

All field are required

409 - Conflict

username already taken.

500 - Bad Request

General server error, unspecified.

Endpoint: POST /home/signin
***

Description

Endpoint for user login

Request Body

|   Field  |  Type  |     Description      | Required |
 ----------|--------|----------------------|----------|
|email     | String | the user email       |    Yes   |
|password  | String | The user password    |    Yes   |

Responses

200 - Success

user succefully singed in.

Example Value:

```
{
 
 "email": "201160@ppu.edu.ps",

"password": "123456"

}
```

400 - Bad Request

All field are required

500 - Bad Request

General server error, unspecified.

Endpoint: POST /home/signout
***

Description

Endpoint for user signout

Responses

200 - Success

user succefully singed out and his cookies deleted

401 - Bad Request

May I help you to signin

Endpoint: POST /subject/new
***

Description

Endpoint for user registration

Request Body

|   Field  |  Type  |     Description      | Required |
 ----------|--------|----------------------|----------|
|name      | String | The subject name     |    Yes   |

Responses

201 - Created

new subject created succefully.

Example Value:

```
{
 "name": "Math"
}
```
401 - Bad Request

May I help you to signin

403 - Bad Request

you don't have the permission to access this resource!

500 - Bad Request

General server error, unspecified.

Endpoint: POST /role/newRole
***

Description

Endpoint for user registration

Request Body

|    Field  |  Type  |     Description      | Required |
 -----------|--------|----------------------|----------|
|roleName   | String | The name of the role |    Yes   |
|permissions|String[]| The permissions      |    Yes   |


Responses

201 - Created

Role created succefully

Example Value:

```
{
 "roleName": "guest",
 
 "permissions": [

"add_user"

]
 
}
```
401 - Bad Request

May I help you to signin

403 - Bad Request

you don't have the permission to access this resource!

400 - Bad Request

All field are required

409 - Bad Request

There are a Role with this name!

500 - Bad Request

General server error, unspecified.

Endpoint: GET /role/all
***

Description

Endpoint to view all permissions created

Responses

200 - Success

permissions has been retrived

401 - Bad Request

May I help you to signin

403 - Forbidden

you don't have the permission to access this resource

500 - Bad Request

General server error, unspecified.

Endpoint: POST /role/assign_role_to_user
***

Description

Endpoint to give specific user specific Role

Request Body

|    Field  |  Type  |     Description      | Required |
 -----------|--------|----------------------|----------|
|roleName   | String | The name of the role |    Yes   |
|username   | String | The username         |    Yes   |


Responses

200 - Success

permissions has been retrived

401 - Bad Request

May I help you to signin

403 - Forbidden

you don't have the permission to access this resource

500 - Bad Request

General server error, unspecified.

Endpoint: POST /permission/new_permission
***

Description

Endpoint for adding new permission in the database

Request Body

|     Field    |  Type  |     Description      | Required |
 --------------|--------|----------------------|----------|
|permissionName| String | The permission name  |    Yes   |


Responses

201 - Created

permission has been added succefully!

Example Value:

```
{
 "permissionName": "add_users" 
}
```

400 - Bad Request

All field are required

401 - Bad Request

May I help you to signin

409 - Conflict

username already taken.

403 - Bad Request

you don't have the permission to access this resource!

500 - Bad Request

General server error, unspecified.

Endpoint: GET /permission/all
***

Description

Endpoint to see all permissions in the database


Responses

200 - Success

user succefully singed up and added to the database

401 - Bad Request

May I Help You To Signin

403 - Bad Request

you don't have the permission to acces this resource

500 - Bad Request

General server error, unspecified.

Endpoint: PUT /permission/assign_permission_to_role
***

Description

Endpoint to give the role additional permission

Request Body

|     Field    |  Type  |     Description      | Required |
 --------------|--------|----------------------|----------|
|roleName      | String | The name of the role |    Yes   |
|PermissionName| String | The permission name  |    Yes   |


Responses

200 - Success

The permission assigned to the role

400 - Bad Request

All field are required

401 - Bad Request

May I Help You To Signin

403 - Bad Request

you don't have the permission to acces this resource

500 - Bad Request

General server error, unspecified.

Endpoint: POST /question/new
***

Description

Endpoint to add new question

Request Body

|   Field   |   Type   |      Description      | Required |
 -----------|----------|-----------------------|----------|
|text       |  String  | question text         |    Yes   |
|type       |  String  | type of question      |    Yes   |
|weight     |  String  | the weight of question|    Yes   |
|subject    |  String  | the question subject  |    Yes   |
|answer     |  String  | True false answer     |    No    |
|options    | String[] | the MCQ options       |    NO    |
|answer     |  String  | the MCQ options       |    NO    |
|blanks     | String[] | the blankes           |    NO    |
|blankAnswer|  String  | blank answer          |    NO    |

Responses

201 - Created

question created succefully


400 - Bad Request

All field are required

401 - Bad Request

May I Help You To signin

403 - Bad Request

you don't have the permission to access this resource!

500 - Bad Request

General server error, unspecified.

Endpoint: PUT /question/edit
***

Description

Endpoint to change a question

Request Body

|   Field   |   Type   |      Description      | Required |
 -----------|----------|-----------------------|----------|
|id         |  String  | question id           |    Yes   |
|text       |  String  | question text         |    Yes   |
|type       |  String  | type of question      |    Yes   |
|weight     |  String  | the weight of question|    Yes   |
|subject    |  String  | the question subject  |    Yes   |
|answer     |  String  | True false answer     |    No    |
|options    | String[] | the MCQ options       |    NO    |
|answer     |  String  | the MCQ options       |    NO    |
|blanks     | String[] | the blankes           |    NO    |
|blankAnswer|  String  | blank answer          |    NO    |

Responses

200 - Success

question updated successfully


400 - Bad Request

All field are required

401 - Bad Request

May I Help You To Signin

403 - Bad Request

you don't have the permission to access this resource!

500 - Bad Request

General server error, unspecified.

Endpoint: GET /question/get/:id
***

Description

Endpoint for user registration

Responses

200 - Success

question retrived successfully

400 - Bad Request

Enter the question id

404 - Bad Request

question not exist

401 - Bad Request

May I Help You To Signin

403 - Bad Request

you don't have the permission to access this resource!

500 - Bad Request

General server error, unspecified.

Endpoint: Get /question/all
***

Description

Endpoint to see all existed questions


Responses

200 - Success

all questions has been retrived successfully

401 - Bad Request

May I help you to signin

403 - Bad Request

you don't have the permission to access this resource!

500 - Bad Request

General server error, unspecified.

Endpoint: DELETE /question/delete/:id
***

Description

Endpoint to delete question by id

Responses

200 - Success

question deleted successfully

400 - Bad Request

Enter the question id

404 - Bad Request

question not exist

403 - Bad Request

you don't have the permission to access this resource!

401 - Bad Request

May I Help You To Signin

500 - Bad Request

General server error, unspecified.

Endpoint: POST /enrollment/enroll
***

Description

Endpoint enroll user to exam

Request Body

|   Field  |  Type  |     Description      | Required |
 ----------|--------|----------------------|----------|
|userId    | String | The id of the user   |    Yes   |
|examId    | String | The id of the exam   |    Yes   |

Responses

201 - Created

user succefully enrolled to that exam

401 - Bad Request

May I Help You To Signin

400 - Bad Request

All field are required

403 - Bad Request

you don't have the permission to access this resource!

500 - Bad Request

General server error, unspecified.

Endpoint: POST /exam/new
***

Description

Endpoint to create new exam

Request Body

|    Field   |   Type   |     Description        | Required |
 ------------|----------|------------------------|----------|
|title       |  String  | The exam title         |    Yes   |
|score       |  String  | The exam score         |    Yes   |
|startTime   |  String  | when the exam starts   |    Yes   |
|duration    |  String  | The time to solve exam |    Yes   |
|questionIds | String[] | The id of the questions|    Yes   |

Responses

201 - Created

exam created successfully

401 - Bad Request

May I Help You To Signin

403 - Bad Request

you don't have the permission to access this resource!

400 - Bad Request

All field are required

500 - Bad Request

Endpoint: POST /exam/newByRandom
***

Description

Endpoint to create new exam with random questions

Request Body

|       Field     |   Type   |     Description        | Required |
 -----------------|----------|------------------------|----------|
|title            |  String  | The exam title         |    Yes   |
|startTime        |  String  | when the exam starts   |    Yes   |
|duration         |  String  | The time to solve exam |    Yes   |
|numberOfQuestions|  Number  | The id of the questions|    Yes   |

Responses

201 - Created

exam created successfully

401 - Bad Request

May I Help You To Signin

400 - Bad Request

All field are required

403 - Bad Request

you don't have the permission to access this resource!

500 - Bad Request
General server error, unspecified.

Endpoint: PUT /exam/edit
***

Description

Endpoint to edit existing exam

Request Body

|    Field   |   Type   |     Description        | Required |
 ------------|----------|------------------------|----------|
|title       |  String  | The exam title         |    Yes   |
|score       |  String  | The exam score         |    Yes   |
|startTime   |  String  | when the exam starts   |    Yes   |
|duration    |  String  | The time to solve exam |    Yes   |
|questionIds | String[] | The id of the questions|    Yes   |

Responses

201 - Created

exam updated successfully

401 - Bad Request

May I Help You To Signin

403 - Bad Request

you don't have the permission to access this resource!

404 - Bad Request
Exam not found

500 - Bad Request
something went wrong when trying to update the Exam

Endpoint: GET /exam/getExam/:id
***

Description

Endpoint to retrive an existing exam using it's id

Request Body

|  Field  |   Type   |    Description   | Required |
 ---------|----------|------------------|----------|
|id       |  Number  | The exam id      |    Yes   |

Responses

200 - OK

You will get the exam 

401 - Bad Request

May I Help You To Signin

403 - Bad Request

you don't have the permission to access this resource!

404 - Bad Request

Exam not found

400 - Bad Request

Exam id required

500 - Bad Request
internal server error

Endpoint: POST /exam/start
***

Description

Endpoint to start exam using it's id and password

Request Body

|  Field  |   Type   |    Description   | Required |
 ---------|----------|------------------|----------|
|id       |  Number  | The exam id      |    Yes   |
|password |  String  | The exam password|    Yes   |

Responses

200 - OK

Exam started successfully. Be careful when submitting answers

401 - Bad Request

May I Help You To Signin

404 - Bad Request

Exam not found

400 - Bad Request

Exam id and password required

400 - Bad Request

password isn't correct, You are a good student (NERD), but please wait until the exam starts, The exam time has ended. See you in the summer

404 - Bad Request

User not found

403 - Bad Request

You are not enrolled in this exam, You can't enter the exam more than once

500 - Bad Request
An error occurred while starting the exam

Endpoint: POST /exam/submit
***

Description

Endpoint to submit exam answers 

Request Body

|      Field     |     Type   |      Description      | Required |
 ----------------|------------|-----------------------|----------|
|submittedAnswers|  String[]  | The exam answers      |    Yes   |


Responses

200 - OK

The exam has finished, and the response has been submitted. Best of luck!

401 - Bad Request

May I Help You To Signin

404 - Bad Request

The exam has finished. You can't submit. See you in the summer

400 - Bad Request

submittedAnswers required

400 - Bad Request

Invalid token

404 - Bad Request

User not found

403 - Bad Request
you don't have the permission to access this resource!

403 - Bad Request

You are not enrolled in this exam, You can't enter the exam more than once

500 - Bad Request
No valid exam found for the user., Something went wrong. make the start exam before, An error occurred while submitting the exam.

Endpoint: GET /response/all
***

Description

Endpoint to see all responses

Responses

200 - Success

object of all responses

401 - Bad Request

May I Help You To Signin

403 - Bad Request

you don't have the permission to access this resource!

500 - Bad Request

General server error, unspecified.

Endpoint: GET /analytics/by_user
***

Description

Endpoint to see the user analytics

Responses

200 - Success

Hi ${user.name} your exams rate is: ${sum / responses.length}

401 - Bad Request

May I Help You To Signin

403 - Bad Request

you don't have the permission to access this resource!

500 - Bad Request

General server error, unspecified.

Endpoint: GET /analytics/by_exam
***

Description

Endpoint to see the exam analytics

|   Field  |  Type  |     Description      | Required |
 ----------|--------|----------------------|----------|
|examId    | String | The id of the exam   |    Yes   |

Responses

200 - Success

Hi ${user.name} your exams rate is: ${sum / responses.length}

401 - Bad Request

Token not valid

403 - Bad Request

you don't have the permission to access this resource!

400 - Bad Request

Enter the exam id

404 - Bad Request

There are no exam with this id or no responses to it

500 - Bad Request

General server error, unspecified.
