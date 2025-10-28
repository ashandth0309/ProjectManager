import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface SummaryData {
  totalProjects: number;
  completedProjects: number;
  ongoingProjects: number;
  notStartedProjects: number;
  teamStats: {
    teamName: string;
    projectCount: number;
  }[];
}

interface SummaryChartsProps {
  data: SummaryData;
}

export default function SummaryCharts({ data }: SummaryChartsProps) {
  const pieData = [
    {
      name: 'Completed',
      population: data.completedProjects,
      color: '#28a745',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Ongoing',
      population: data.ongoingProjects,
      color: '#ffc107',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Not Started',
      population: data.notStartedProjects,
      color: '#6c757d',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Overview</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{data.totalProjects}</Text>
            <Text style={styles.statLabel}>Total Projects</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, styles.completed]}>
              {data.completedProjects}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, styles.ongoing]}>
              {data.ongoingProjects}
            </Text>
            <Text style={styles.statLabel}>Ongoing</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Status Distribution</Text>
        <PieChart
          data={pieData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Performance</Text>
        <View style={styles.teamStats}>
          {data.teamStats.map((team, index) => (
            <View key={index} style={styles.teamStatItem}>
              <Text style={styles.teamName}>{team.teamName}</Text>
              <Text style={styles.teamCount}>{team.projectCount} projects</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  completed: {
    color: '#28a745',
  },
  ongoing: {
    color: '#ffc107',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  teamStats: {
    marginTop: 8,
  },
  teamStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  teamName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  teamCount: {
    fontSize: 14,
    color: '#6c757d',
  },
});