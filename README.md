This is a learning project implementing: 
- a minimal REST web api in Asp .Net Core;
- a MySql DB;
- a React & Typescript front-end with Vite

The app is a workout app where a user can CRUD their own exercises, routines, and then populate the routines with exercises. The user's data is persisted in a MySql database.

Major work still to be done:
- The ability to start a workout and then record your progress through that workout in terms of sets and reps completed for each exercise.
- I'm currently adding Auth0 authentication and authorization to the app and once that's implemented, you'll be able to sign up with an email. That will also replace the dummy token which is passed to the client when a user signs in, which currently maintains their signed-in state and allows them to navigate to protected routes.
- Next to no styling has been applied so it doesn't look good at all - this will be added further down the track after I've got the functionality I want. Also it hasn't yet been made mobile responsive so please view on a desktop.

The app is already deployed to https://workout-app-rwp.netlify.app 
Until I have Auth0 implemented, you can sign in with either of these users:
test@email.com
or
sally@gmail.com
The password for both can be anything but it can't be left blank or it will fail validation.
