import {createContext} from 'react';

import announcements from './announcements.json';
import conversation from './conversation.json';
import events from './events.json';
import threads from './threads.json';

export const MockContext = createContext();

export const MockContextProvider = ({children}) => {
  const contextValue = {
    announcements,
    conversation,
    events,
    threads,
  };

  return (
    <MockContext.Provider value={contextValue}>{children}</MockContext.Provider>
  );
};
