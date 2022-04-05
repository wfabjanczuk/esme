import {useContext} from 'react';
import {FlatList, Text, TouchableOpacity} from 'react-native';

import {SafeArea} from '../../../shared/containers/safe-area.component';
import {MockContext} from '../../../shared/services/mock/mock.context';

export const EventsScreen = () => {
  const {events} = useContext(MockContext);
  console.log(events);

  return (
    <SafeArea>
      <FlatList
        data={events}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{padding: 10, backgroundColor: 'white', marginTop: 10}}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.name}
      />
    </SafeArea>
  );
};
