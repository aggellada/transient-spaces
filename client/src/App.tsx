import { useEffect } from "react";
import { usePostStore } from "./store/usePostStore";
import { useLocationStore } from "./store/useLocationStore";

import Feed from "./components/Feed";
import { Route, Routes } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import SignUpPage from "./pages/auth/SignUpPage";

function App() {
  const { getAllPosts } = usePostStore();
  const { authUser } = useAuthStore();
  const { syncUserLocation, isSyncing, placeId } = useLocationStore();

  useEffect(() => {
    syncUserLocation(14.6503, 121.0747);
  }, [syncUserLocation, authUser]);

  useEffect(() => {
    if (placeId) {
      getAllPosts(placeId);
    }
  }, [getAllPosts, placeId]);

  if (isSyncing) return <h1>Syncing user location...</h1>;
  return (
    <div className="w-full min-h-screen flex bg-[#161718]">
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<Feed />} />
      </Routes>
    </div>
  );
}

export default App;
