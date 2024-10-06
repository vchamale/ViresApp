import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Space from './Space';
import { statusMapper } from 'utils/common/statusMapper';

type StatusIconProps = {
  status: string;
};

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {

  const icon = statusMapper[status.toLowerCase()] ?? statusMapper['default']

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.statusIcon}>
        <FontAwesome6 name={icon.name} size={40} color={icon.color} />
      </TouchableOpacity>
      <Space vertical size={15} />
      <Text style={styles.title}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  statusIcon: {
    borderRadius: 50,
    padding: 15,
    backgroundColor: '#79c08e9e'
  },
  title: {
    fontSize: 18,
    color: '#5db075',
    fontWeight: 'bold',
  },
});

export default StatusIcon;
