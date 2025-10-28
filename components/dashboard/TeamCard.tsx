import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Team } from '../../types/team';

interface TeamCardProps {
  team: Team;
  onMorePress: (team: Team) => void;
}

export default function TeamCard({ team, onMorePress }: TeamCardProps) {
  const displayedMembers = team.members.slice(0, 3);
  const hasMoreMembers = team.members.length > 3;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.teamName}>{team.name}</Text>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => onMorePress(team)}
        >
          <Text style={styles.moreButtonText}>More</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.membersContainer}>
        <Text style={styles.membersLabel}>
          Members ({team.members.length})
        </Text>
        <View style={styles.membersList}>
          {displayedMembers.map((member, index) => (
            <View key={member.id} style={styles.memberBadge}>
              <Text style={styles.memberInitials}>
                {getInitials(member.name)}
              </Text>
            </View>
          ))}
          {hasMoreMembers && (
            <View style={styles.moreMembersBadge}>
              <Text style={styles.moreMembersText}>
                +{team.members.length - 3}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  moreButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  moreButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginRight: 12,
  },
  membersList: {
    flexDirection: 'row',
    flex: 1,
  },
  memberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  memberInitials: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  moreMembersBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreMembersText: {
    color: '#6c757d',
    fontSize: 12,
    fontWeight: 'bold',
  },
});