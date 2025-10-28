import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../hooks/useAuth';
import Header from '../../../components/layout/Header';
import TeamMemberPopup from '../../../components/dashboard/TeamMemberPopup';
import { Team } from '../../../types/team';

export default function AddProject() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamPopupVisible, setTeamPopupVisible] = useState(false);
  const [addMembersPopupVisible, setAddMembersPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'teams'));
      const teamsData: Team[] = [];
      querySnapshot.forEach((doc) => {
        teamsData.push({ id: doc.id, ...doc.data() } as Team);
      });
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading teams:', error);
      Alert.alert('Error', 'Failed to load teams');
    }
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    if (!selectedTeam) {
      Alert.alert('Error', 'Please select a team');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'projects'), {
        name: projectName.trim(),
        description: description.trim(),
        startDate: startDate,
        assignedTeam: {
          id: selectedTeam.id,
          name: selectedTeam.name,
          members: selectedTeam.members,
        },
        status: 'not-started',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user?.uid,
      });

      Alert.alert('Success', 'Project created successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error creating project:', error);
      Alert.alert('Error', 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setTeamPopupVisible(false);
  };

  const handleAddMembers = (team: Team) => {
    setSelectedTeam(team);
    setTeamPopupVisible(false);
    setAddMembersPopupVisible(true);
  };

  const handleDatePress = () => {
    // In a real app, you would show a date picker here
    Alert.alert('Select Date', 'Date picker would appear here');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Add New Project" showBackButton={true} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          {/* Project Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Project Name *</Text>
            <TextInput
              style={styles.textInput}
              value={projectName}
              onChangeText={setProjectName}
              placeholder="Enter project name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter project description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Start Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Start Date *</Text>
            <TouchableOpacity style={styles.dateInput} onPress={handleDatePress}>
              <Text style={styles.dateText}>
                {new Date(startDate).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Team Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Assign Team *</Text>
            <TouchableOpacity 
              style={styles.teamSelector}
              onPress={() => setTeamPopupVisible(true)}
            >
              <Text style={selectedTeam ? styles.teamSelectedText : styles.teamPlaceholderText}>
                {selectedTeam ? selectedTeam.name : 'Select a team'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Selected Team Preview */}
          {selectedTeam && (
            <View style={styles.selectedTeam}>
              <Text style={styles.selectedTeamTitle}>Selected Team:</Text>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{selectedTeam.name}</Text>
                <Text style={styles.teamMembers}>
                  {selectedTeam.members.length} members
                </Text>
              </View>
              
              {/* Team Members Preview */}
              <View style={styles.membersPreview}>
                <Text style={styles.membersLabel}>Team Members:</Text>
                <View style={styles.membersList}>
                  {selectedTeam.members.slice(0, 4).map((member, index) => (
                    <View key={member.id} style={styles.memberBadge}>
                      <Text style={styles.memberInitials}>
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </Text>
                    </View>
                  ))}
                  {selectedTeam.members.length > 4 && (
                    <View style={styles.moreMembersBadge}>
                      <Text style={styles.moreMembersText}>
                        +{selectedTeam.members.length - 4}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Create Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              (!projectName.trim() || !selectedTeam) && styles.createButtonDisabled
            ]}
            onPress={handleCreateProject}
            disabled={!projectName.trim() || !selectedTeam || loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Creating...' : 'Create Project'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Team Selection Popup */}
      <TeamSelectionPopup
        visible={teamPopupVisible}
        teams={teams}
        selectedTeam={selectedTeam}
        onSelectTeam={handleTeamSelect}
        onAddMembers={handleAddMembers}
        onClose={() => setTeamPopupVisible(false)}
      />

      {/* Add Members Popup - This would be a separate component */}
      {/* You can implement the add members functionality here */}
    </KeyboardAvoidingView>
  );
}

// Team Selection Popup Component
function TeamSelectionPopup({ 
  visible, 
  teams, 
  selectedTeam, 
  onSelectTeam, 
  onAddMembers, 
  onClose 
}: any) {
  if (!visible) return null;

  return (
    <View style={popupStyles.modalOverlay}>
      <View style={popupStyles.modalContent}>
        <View style={popupStyles.modalHeader}>
          <Text style={popupStyles.modalTitle}>Select Team</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={popupStyles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={popupStyles.teamsList}>
          {teams.map((team: Team) => (
            <TouchableOpacity
              key={team.id}
              style={[
                popupStyles.teamItem,
                selectedTeam?.id === team.id && popupStyles.teamItemSelected
              ]}
              onPress={() => onSelectTeam(team)}
            >
              <View style={popupStyles.teamInfo}>
                <Text style={popupStyles.teamName}>{team.name}</Text>
                <Text style={popupStyles.teamMembers}>
                  {team.members.length} members
                </Text>
              </View>
              <TouchableOpacity
                style={popupStyles.moreButton}
                onPress={() => onAddMembers(team)}
              >
                <Text style={popupStyles.moreButtonText}>More</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {teams.length === 0 && (
          <View style={popupStyles.emptyState}>
            <Text style={popupStyles.emptyStateText}>No teams available</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  teamSelector: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamPlaceholderText: {
    fontSize: 16,
    color: '#999',
  },
  teamSelectedText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  selectedTeam: {
    backgroundColor: '#e7f3ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedTeamTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 8,
  },
  teamInfo: {
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
  teamMembers: {
    fontSize: 14,
    color: '#6c757d',
  },
  membersPreview: {
    marginTop: 8,
  },
  membersLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  membersList: {
    flexDirection: 'row',
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
  createButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

const popupStyles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  teamsList: {
    maxHeight: 400,
  },
  teamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  teamItemSelected: {
    backgroundColor: '#e7f3ff',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  teamMembers: {
    fontSize: 14,
    color: '#6c757d',
  },
  moreButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  moreButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6c757d',
  },
});