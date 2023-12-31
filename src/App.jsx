import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ContextProvider from "./components/ContextProvider";

import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { Spinner } from "./components/Spinner";

import { Top1Page } from "./Pages/Top1Page";
import { Top20Page } from "./Pages/Top20Page";
import { TopPage } from "./Pages/TopPage";

//pages are only imported when they are needed
const LandingPage = lazy(() => import("./Pages/LandingPage"));
const LoginPage = lazy(() => import("./Pages/Login"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound"));

import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.innerApp}>
      <Suspense fallback={<Spinner />}>
        <ContextProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<LoginPage />} />

              <Route
                path="landing"
                element={
                  <ProtectedRoute>
                    <LandingPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="tracksData"
                element={
                  <ProtectedRoute>
                    <TopPage label={"track"} />
                  </ProtectedRoute>
                }
              >
                {/*immmediately the user goes to the tracksData page, redirect to the topTrack route */}
                <Route index element={<Navigate replace to="topTrack" />} />

                <Route
                  path="topTrack"
                  element={
                    <ProtectedRoute>
                      <Top1Page label={"track"} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="allTracks"
                  element={
                    <ProtectedRoute>
                      <Top20Page label={"track"} />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route
                path="artistsData"
                element={
                  <ProtectedRoute>
                    <TopPage label={"artist"} />
                  </ProtectedRoute>
                }
              >
                {/*immmediately the user goes to the artistsData page, redirect to the topArtist page */}
                <Route index element={<Navigate replace to="topArtists" />} />

                <Route
                  path="topArtists"
                  element={
                    <ProtectedRoute>
                      <Top1Page label={"artist"} />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="allArtists"
                  element={
                    <ProtectedRoute>
                      <Top20Page label={"artist"} />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </ContextProvider>
      </Suspense>
    </div>
  );
}
