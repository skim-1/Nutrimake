import React, { useState } from 'react';
import { AppLoading } from 'expo';
import Navigator from './routes/homeStack';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  return (
    <Navigator />
  );
}
