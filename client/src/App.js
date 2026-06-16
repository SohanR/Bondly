import "@mui/material";
import "react-icons";
import "react-icons/bi";
import "react-icons/md";
import "react-icons/bs";
import "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import theme from "./theme";

import PostView from "./components/views/PostView";
import CreatePostView from "./components/views/CreatePostView";
import ProfileView from "./components/views/ProfileView";
import LoginView from "./components/views/LoginView";
import SignupView from "./components/views/SignupView";
import ExploreView from "./components/views/ExploreView";
import LandingPage from "./components/views/LandingPage";
import PrivateRoute from "./components/PrivateRoute";
import SearchView from "./components/views/SearchView";
import MessengerView from "./components/views/MessengerView";
import CreateSpaceView from "./components/views/CreateSpaceView";
import SpaceView from "./components/views/SpaceView";
import CreateCircleView from "./components/views/CreateCircleView";
import CircleView from "./components/views/CircleView";
import { initiateSocketConnection } from "./helpers/socketHelper";
import { isLoggedIn } from "./helpers/authHelper";

const HomeRoute = () => {
  return isLoggedIn() ? <ExploreView /> : <LandingPage />;
};

function App() {
  initiateSocketConnection();

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/spaces/:slug" element={<SpaceView />} />
          <Route path="/circles/:slug" element={<CircleView />} />
          <Route
            path="/spaces/create"
            element={
              <PrivateRoute>
                <CreateSpaceView />
              </PrivateRoute>
            }
          />
          <Route
            path="/circles/create"
            element={
              <PrivateRoute>
                <CreateCircleView />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/create"
            element={
              <PrivateRoute>
                <CreatePostView />
              </PrivateRoute>
            }
          />
          <Route
            path="/messenger"
            element={
              <PrivateRoute>
                <MessengerView />
              </PrivateRoute>
            }
          />
          <Route path="/search" element={<SearchView />} />
          <Route path="/users/:id" element={<ProfileView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/signup" element={<SignupView />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
