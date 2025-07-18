import React, {useEffect, useRef} from 'react';
import { SafeAreaView, View, StyleSheet, Dimensions, Text, Animated, Easing } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface VehicleDashboardUIProps {
  speed?: number;
  time?: string;
  batteryPercentage?: number;
  gear?: 'f' | 'n' | 'r';
  mode?: 'eco' | 'sports';
  range?: number;
  odometer?: number;
  turnSignal?: 'left' | 'right' | null;
  brakeStatus?: {
    bf?: boolean;
    hb?: boolean;
    s?: boolean;
  };
  isConnected: boolean;
  headlightStatus?: {
    low?: boolean;
    high?: boolean;
    hazard?: boolean;
    service?: boolean;
  };
  batteryHasFault?: boolean;
  motorHasFault?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  batteryTemp?: number;
motorRpm?: number;
hydraulicRpm?: number;
coolantTemp?: number;
}

const VehicleDashboardUI: React.FC<VehicleDashboardUIProps> = ({
  time,
  isConnected,
  odometer,
  speed,
  batteryPercentage,
   range,
  mode,
  batteryHasFault,
  motorHasFault,
    gear,
  brakeStatus,
  turnSignal,
  headlightStatus,
  batteryTemp,
  motorRpm,
  hydraulicRpm,
  coolantTemp
}) => {
  const leftOpacity = useRef(new Animated.Value(1)).current;
const rightOpacity = useRef(new Animated.Value(1)).current;

useEffect(() => {
  const blink = (target: Animated.Value) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(target, { toValue: 0.2, duration: 400, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(target, { toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.linear }),
      ])
    ).start();
  };

  if (turnSignal === 'left') {
    blink(leftOpacity);
  }
  if (turnSignal === 'right') {
    blink(rightOpacity);
  }
}, [turnSignal]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* We'll start adding components step-by-step from here */}
       {/* Turn Signals Always Visible */}
<Animated.View style={[styles.leftTurnSignal, { opacity: turnSignal === 'left' ? leftOpacity : 0.3 }]}>
  <Icon name="arrow-left" size={38} color="#facc15" />
</Animated.View>

<Animated.View style={[styles.rightTurnSignal, { opacity: turnSignal === 'right' ? rightOpacity : 0.3 }]}>
  <Icon name="arrow-right" size={38} color="#facc15" />
</Animated.View>
        <View style={styles.menuButtonContainer}>
  <Icon name="menu" size={32} color="#f1f5f9" />
</View>
        <View style={styles.topBar}>
  <Text style={styles.topBarText}>Time: {time || '--:--'}</Text>
  <Text style={styles.topBarText}>
    {isConnected ? 'Connected ✅' : 'Disconnected ❌'}
  </Text>
  <Text style={styles.topBarText}>
    Hours: {odometer ? (odometer / 60).toFixed(1) : '--'}
  </Text>
</View>

<View style={styles.gearIndicator}>
  <Text
    style={[
      styles.gearText,
      gear === 'f' ? styles.gearForward : gear === 'r' ? styles.gearReverse : styles.gearNeutral,
    ]}
  >
    {gear?.toUpperCase() || '--'}
  </Text>
</View>
 
 <View style={styles.paramGrid}>
  <View style={styles.paramBox}>
    <View style={styles.paramRow}>
      <Icon name="thermometer" size={20} color="#f87171" style={styles.paramIcon} />
      <Text style={styles.paramLabel}>Battery Temp</Text>
    </View>
    <Text style={styles.paramValue}>{batteryTemp ?? '--'}°C</Text>
  </View>

  <View style={styles.paramBox}>
    <View style={styles.paramRow}>
      <Icon name="rotate-right" size={20} color="#38bdf8" style={styles.paramIcon} />
      <Text style={styles.paramLabel}>Motor RPM</Text>
    </View>
    <Text style={styles.paramValue}>{motorRpm ?? '--'} rpm</Text>
  </View>

  <View style={styles.paramBox}>
    <View style={styles.paramRow}>
      <Icon name="hydraulic-oil-temperature" size={20} color="#facc15" style={styles.paramIcon} />
      <Text style={styles.paramLabel}>Hydraulic RPM</Text>
    </View>
    <Text style={styles.paramValue}>{hydraulicRpm ?? '--'} rpm</Text>
  </View>

  <View style={styles.paramBox}>
    <View style={styles.paramRow}>
      <Icon name="coolant-temperature" size={20} color="#60a5fa" style={styles.paramIcon} />
      <Text style={styles.paramLabel}>Coolant Temp</Text>
    </View>
    <Text style={styles.paramValue}>{coolantTemp ?? '--'}°C</Text>
  </View>
</View>

<View style={styles.headlightRow}>
  <View style={styles.headlightItem}>
    <Icon
      name="car-light-dimmed"
      size={22}
      color={headlightStatus?.low ? '#38bdf8' : '#334155'}
    />
    <Text style={[styles.headlightText, !headlightStatus?.low && styles.inactiveText]}>
      Low
    </Text>
  </View>

  <View style={styles.headlightItem}>
    <Icon
      name="car-light-high"
      size={22}
      color={headlightStatus?.high ? '#3b82f6' : '#334155'}
    />
    <Text style={[styles.headlightText, !headlightStatus?.high && styles.inactiveText]}>
      High
    </Text>
  </View>

  <View style={styles.headlightItem}>
    <Icon
      name="alert"
      size={22}
      color={headlightStatus?.hazard ? '#facc15' : '#334155'}
    />
    <Text style={[styles.headlightText, !headlightStatus?.hazard && styles.inactiveText]}>
      Hazard
    </Text>
  </View>

  <View style={styles.headlightItem}>
    <Icon
      name="tools"
      size={22}
      color={headlightStatus?.service ? '#f87171' : '#334155'}
    />
    <Text style={[styles.headlightText, !headlightStatus?.service && styles.inactiveText]}>
      Service
    </Text>
  </View>
</View>

<View style={styles.centerGauges}>
  {/* Battery % */}
  <View style={styles.gaugeBox}>
    <AnimatedCircularProgress
      size={180}
      width={16}
      fill={batteryPercentage || 0}
      tintColor="#22c55e"
      backgroundColor="#1e293b"
      rotation={0}
    >
      {fill => <Text style={styles.gaugeLabel}>{`${Math.round(fill)}%`}</Text>}
    </AnimatedCircularProgress>
    <Text style={styles.gaugeTitle}>Battery</Text>
  </View>

  {/* Speed */}
  <View style={styles.gaugeBox}>
    <AnimatedCircularProgress
      size={180}
      width={16}
      fill={speed ? Math.min(speed, 100) : 0}
      tintColor="#3b82f6"
      backgroundColor="#1e293b"
      rotation={0}
    >
      {fill => <Text style={styles.gaugeLabel}>{`${speed ?? '--'} km/h`}</Text>}
    </AnimatedCircularProgress>
    <Text style={styles.gaugeTitle}>Speed</Text>
  </View>
</View>

{brakeStatus?.bf && (
  <View style={styles.brakeIconContainer}>
    <Icon name="car-brake-alert" size={20} color="#fff" />
<Text style={styles.brakeText}>BRAKE</Text>
  </View>
)}

 <View style={styles.bottomRow}>
  {/* Range */}
  <View style={styles.bottomBox}>
    <Text style={styles.bottomLabel}>Range</Text>
    <Text style={styles.bottomValue}>{range ?? '--'} km</Text>
  </View>

  {/* Mode */}
  <View style={styles.bottomBox}>
    <Text style={styles.bottomLabel}>Mode</Text>
    <Text style={[styles.bottomValue, mode === 'eco' ? styles.eco : styles.sports]}>
      {mode?.toUpperCase() ?? '--'}
    </Text>
  </View>

  {/* Faults */}
  <View style={styles.bottomBox}>
    <Text style={styles.bottomLabel}>Faults</Text>
    <Text style={[styles.bottomValue, (batteryHasFault || motorHasFault) ? styles.fault : styles.ok]}>
      {(batteryHasFault || motorHasFault) ? 'Detected ❌' : 'None ✅'}
    </Text>
  </View>
</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a', // a classy deep blue/gray base
  },
  container: {
    flex: 1,
    padding: 16,
  },
  topBar: {
  position: 'absolute',
  top: 0,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  paddingTop: 12,
  paddingBottom: 20, // Increased from 8
  backgroundColor: '#0f172a',
  zIndex: 15,
},
topBarText: {
  color: '#f1f5f9',
  fontSize: 16,
  fontWeight: '600',
},
leftTurnSignal: {
  position: 'absolute',
  top: 60, // Previously 60, keep here for new gap
  left: 24,
  padding: 12,
  borderRadius: 12,
  backgroundColor: '#1e293b',
  zIndex: 4,
},
rightTurnSignal: {
  position: 'absolute',
  top: 60,
  right: 24,
  padding: 12,
  borderRadius: 12,
  backgroundColor: '#1e293b',
  zIndex: 4,
},
turnText: {
  fontSize: 28,
  color: '#facc15', // amber/yellow for visibility
  fontWeight: 'bold',
},
menuButtonContainer: {
  position: 'absolute',
  top: 120, // Increased from 72 to 120
  left: 16,
  zIndex: 10,
},
menuButton: {
  fontSize: 32,
  color: '#f1f5f9',
  padding: 8,
  borderRadius: 8,
  backgroundColor: '#1e293b',
  overflow: 'hidden',
},
centerGauges: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginTop: 80,
},
gaugeBox: {
  alignItems: 'center',
},
gaugeLabel: {
  color: '#f1f5f9',
  fontSize: 20,
  fontWeight: 'bold',
},
gearIndicator: {
  alignItems: 'center',
  marginTop: 24,
},
gearText: {
  fontSize: 48,
  fontWeight: 'bold',
},
gearForward: {
  color: '#22c55e',
},
gearReverse: {
  color: '#f87171',
},
gearNeutral: {
  color: '#cbd5e1',
},
gaugeTitle: {
  marginTop: 8,
  color: '#cbd5e1',
  fontSize: 16,
},
bottomRow: {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingBottom: 20,
  paddingTop: 10,
  backgroundColor: '#0f172a', // Optional for contrast
  zIndex: 15,
},
bottomBox: {
  alignItems: 'center',
},
bottomLabel: {
  color: '#94a3b8',
  fontSize: 14,
},
bottomValue: {
  color: '#f1f5f9',
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: 4,
},
eco: {
  color: '#10b981',
},
sports: {
  color: '#f43f5e',
},
fault: {
  color: '#f87171',
},
ok: {
  color: '#22c55e',
},
brakeIconContainer: {
  position: 'absolute',
  bottom: 100,
  right: 24,
  backgroundColor: '#dc2626',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
},
brakeText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
headlightRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginTop: 12,
  paddingHorizontal: 12,
},
headlightItem: {
  alignItems: 'center',
  justifyContent: 'center',
},
headlightText: {
  fontSize: 12,
  color: '#f1f5f9',
  marginTop: 4,
},
inactiveText: {
  color: '#64748b',
},
paramGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  marginTop: 16,
  paddingHorizontal: 8,
},
paramBox: {
  width: '45%',
  paddingVertical: 8,
  paddingHorizontal: 4,
  marginVertical: 8,
  alignItems: 'center',
  borderRadius: 8,
},
paramRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
},
paramIcon: {
  marginRight: 6,
},
paramLabel: {
  color: '#cbd5e1',
  fontSize: 16, // larger than before
  fontWeight: '600',
},
paramValue: {
  color: '#f1f5f9',
  fontSize: 20, // increased size
  fontWeight: 'bold',
},
});

export default VehicleDashboardUI;