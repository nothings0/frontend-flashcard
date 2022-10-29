import Layout from "./layout/Layout"
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import {store, persistor} from "./redux/store"
// import ReactGA from "react-ga4"
import { GoogleOAuthProvider } from '@react-oauth/google'

// ReactGA.initialize("G-QL0WF8XH3D")

function App() {
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId="243463811299-mr91tfd76l5k134ehddk5q8btej0rj2t.apps.googleusercontent.com">
        <div className="App">
          <Layout/>
        </div>
      </GoogleOAuthProvider>
    </PersistGate>
    </Provider>
  );
}

export default App;
