# Giosg Interaction Designer embedding demo

This project aims to demonstrate how Giosg partners could embed Interaction Designer inside their application and use Giosg API's to control state of interactions.

Features of this demo app:

- Embed Interaction Designer using iframe
- Publish interaction using API
- Unpublish interaction using API
- Revert interaction to previous published state using API
- Delete interaction using API
- Set users language

To see a demo of SSO please check this [demo page](https://demo.giosg.com/ssologin.html).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running the demo

1. First make sure dependencies are installed: `yarn install`
2. Start the appliction: `yarn start`
3. Start HTTPS tunnel with https://ngrok.com/ for example. This is needed for SSO login to work and also browser to allow iframing of Interaction Designer
4. Make sure you have SSO Giosg App installed in the Giosg account you are using and it has your Ngrok url in allowed redirect urls.
5. Navigate to your public Ngrok url (for example https://f24b-91-156-111-53.ngrok.io) and fill in the SSO login information

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can find Giosg API documentation for [Interaction Designer from docs.giosg.com](https://docs.giosg.com/api_reference/interaction_designer_http_api/).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
