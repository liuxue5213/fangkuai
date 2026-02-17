import React from 'react';
import { StatusBar } from 'react-native';
import GameScreen from './screens/GameScreen';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <GameScreen />
    </>
  );
}
