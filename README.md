This is a learning project implementing: 
- a minimal REST web api in Asp.Net Core;
- a MySql DB;
- a React & Typescript front-end with Vite
- Auth0 2.0 authentication
- API and database have been deployed to separate Fly.io apps, and the front-end to Netlify
- Continuous deployment of API via GitHub Actions workflow

The app is a workout app where a user can CRUD their own exercises, routines, and then populate the routines with exercises. You can drag and drop to rearrange the order of exercises within a routine. This order is not currently saved but I will add this feature. Other user data is persisted in a MySql database though.

Major work still to be done:
- The ability to start a workout and then record your progress through that workout in terms of sets and reps completed for each exercise.
- This only has boilerplate React + Vite project styling. Better styling will be added further down the track after I've got the functionality I want. Also this is a desktop app project so please view on a desktop. I haven't checked for mobile responsiveness.
- Testing (unit testing, may also add some end-to-end automated tests)

The app is already deployed to https://workout-app-rwp.netlify.app and can be interacted with there. If you don't want to register with your real email, feel free to use a fake one as email verification is not required to log in.

Link to my Postman collection for API integration testing (have to enter your own environment variable values): https://elements.getpostman.com/redirect?entityId=19177718-b7e9eeb2-407f-447d-b95a-cc403886aa1f&entityType=collection
