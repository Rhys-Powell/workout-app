This is a project implementing: 
- a minimal REST web API in Asp.Net Core;
- a MySql DB;
- a React & Typescript front-end with Vite.
- the API and database have been deployed as separate Fly.io apps, and the front-end deployed to Netlify.

The app is a workout app where a user can CRUD their own exercises, routines, and then populate the routines with exercises. You can drag and drop to rearrange the order of exercises within a routine. This order is not currently saved but I will add this feature. Other user data is persisted in a MySql database though.

It features:
- Continuous deployment of API via GitHub Actions workflow, and frontend via Netlify integration with Github repo;
- Auth0 2.0 authentication and authorization for login and requests to my API endpoints;
- Custom middleware to address a top OWASP security vulnerability, namely insecure direct object references (IDOR). It extracts the user id from the auth token in each http request and compares against the user id of the 'owner' of that requested resource to prevent an authenticated user from obtaining, destroying or altering another user's data. 
- Postman API functional tests collection automatically runs using Newman CLI via a Github Actions workflow with a push to main branch. This obtains an access token, then runs requests to test each endpoint (happy path), including checking the data object (e.g. user, exercise etc) returned in the response body has the correct properties.

The app is already deployed to https://workout-app-rwp.netlify.app and can be interacted with there. If you don't want to register with your real email, feel free to use a fake one as email verification is not required to log in.

Link to my Postman collection of API functional tests: https://www.postman.com/speeding-shadow-539881/workout-app-api-testing/collection/yjjlcfy/workout-app-functional-api-tests

Major work still to be done:
- The ability to start a workout and then record your progress through that workout in terms of sets and reps completed for each exercise.
- This only has boilerplate React + Vite project styling. Better styling will be added further down the track after I've got the functionality I want. Also this is a desktop app project so please view on a desktop. I haven't checked for mobile responsiveness.
- Testing (unit testing, may also add some end-to-end automated tests)
