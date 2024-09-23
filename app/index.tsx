import { useEffect } from 'react';
import { NativeRouter, Routes, Route } from 'react-router-native';
import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';



export default function App() {

  return (
    <NativeRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/details/:id" element={<DetailsScreen />} />
      </Routes>
    </NativeRouter>
  );
}
