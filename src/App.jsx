import { BrowserRouter, Route, Routes } from "react-router-dom";
import ContextProvider from "./components/ContextProvider";

import styles from "./CssModules/App.module.css";

import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Spinner from "./components/Spinner";
import PageNotFound from "./Pages/PageNotFound";

const LandingPage = lazy(() => import("./Pages/LandingPage"));
const LoginPage = lazy(() => import("./Pages/Login"));
const Top1Page = lazy(() => import("./Pages/Top1"));

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
                path="tracks"
                element={
                  <ProtectedRoute>
                    <Top1Page pageLabel={"track"} />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="all"
                  element={
                    <ProtectedRoute>
                      <p>Hello</p>
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route
                path="artists"
                element={
                  <ProtectedRoute>
                    <Top1Page pageLabel={"artist"} />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="all"
                  element={
                    <ProtectedRoute>
                      <p>Hello</p>
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
