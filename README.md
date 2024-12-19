N.B. The core functionality is now present and I'll be adding responsive styling/layout to improve the appeal and usability.  

This is a project implementing: 
- a minimal REST web API in Asp.Net Core;
- a MySql DB;
- a React & Typescript front-end with Vite.
- the API and database have been deployed as separate Fly.io apps, and the front-end deployed to Netlify.

The app is a workout app where a user can CRUD their own exercises, routines, and then populate the routines with exercises. You can drag and drop to rearrange the order of exercises within a routine. 

It features:
- Continuous deployment of API via GitHub Actions workflow, and frontend via Netlify integration with the Github repo;
- Auth0 2.0 authentication and authorization for login and requests to my API endpoints;
- Custom middleware to address a top OWASP security vulnerability, namely insecure direct object references (IDOR). It extracts the user id from the auth token in each http request and compares against the user id of the 'owner' of that requested resource to prevent an authenticated user from obtaining, destroying or altering another user's data.
- Relatively complex state management achieved using just vanilla React (useEffect and useState). For instance a workout can be started, and then the routine that the workout is based on can be changed - for instance adding a workout to it and/or rearranging the exercise order - and those changes will be reflected in the current workout. 
- Postman API functional tests collection automatically runs using Newman CLI via a Github Actions workflow with a push to main branch. This obtains an access token, then runs requests to test each endpoint (happy path), including checking the data object (e.g. user, exercise etc) returned in the response body has the correct properties.

The app is already deployed to https://workout-app-rwp.netlify.app and can be interacted with there. If you don't want to register with your real email, feel free to use a fake one as email verification is not required to log in.

Link to my Postman collection of API functional tests: https://www.postman.com/speeding-shadow-539881/workout-app-api-testing/collection/yjjlcfy/workout-app-functional-api-tests

Major work still to be done:
- ~~The ability to start a workout and then record your progress through that workout in terms of sets and reps completed for each exercise.~~ Now complete.
- This only has boilerplate React + Vite project styling currently - responsive styling to come.
- Testing (unit testing, may also add some end-to-end automated tests)
