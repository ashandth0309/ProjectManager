import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  arrayUnion,
  arrayRemove,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { Team, TeamMember } from '../types/team';
import { PREDEFINED_TEAMS, TeamUtils } from '../constants/teams';

interface UseTeamsReturn {
  // State
  teams: Team[];
  team: Team | null;
  loading: boolean;
  error: string | null;
  availableMembers: TeamMember[];
  
  // Team Actions
  createTeam: (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  getTeam: (teamId: string) => Promise<Team | null>;
  
  // Member Management
  addTeamMember: (teamId: string, member: TeamMember) => Promise<void>;
  removeTeamMember: (teamId: string, memberId: string) => Promise<void>;
  updateTeamMember: (teamId: string, memberId: string, updates: Partial<TeamMember>) => Promise<void>;
  
  // Utility
  clearError: () => void;
  refreshTeams: () => Promise<void>;
  getUserTeams: (userId: string) => Team[];
  getTeamMembers: (teamId: string) => TeamMember[];
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAdmin } = useAuth();

  // Initialize with predefined teams if no teams exist in Firestore
  const initializeTeams = async () => {
    try {
      const teamsSnapshot = await getDocs(collection(db, 'teams'));
      if (teamsSnapshot.empty) {
        // Add predefined teams to Firestore
        const addTeams = PREDEFINED_TEAMS.map(team => 
          addDoc(collection(db, 'teams'), team)
        );
        await Promise.all(addTeams);
      }
    } catch (error) {
      console.error('Initialize teams error:', error);
    }
  };

  // Listen to all teams
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Initialize teams on first load
    initializeTeams();

    const teamsQuery = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      teamsQuery,
      (snapshot) => {
        const teamsData: Team[] = [];
        snapshot.forEach((doc) => {
          teamsData.push({ id: doc.id, ...doc.data() } as Team);
        });
        setTeams(teamsData);
        setLoading(false);
      },
      (error) => {
        console.error('Teams listener error:', error);
        setError('Failed to load teams');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const createTeam = async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    if (!user) throw new Error('User must be authenticated');
    if (!isAdmin) throw new Error('Only admins can create teams');

    try {
      setLoading(true);
      setError(null);

      const teamWithMetadata = {
        ...teamData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user.uid,
      };

      const docRef = await addDoc(collection(db, 'teams'), teamWithMetadata);
      return docRef.id;
    } catch (error: any) {
      console.error('Create team error:', error);
      setError('Failed to create team');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTeam = async (teamId: string, updates: Partial<Team>): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');
    if (!isAdmin) throw new Error('Only admins can update teams');

    try {
      setLoading(true);
      setError(null);

      const teamRef = doc(db, 'teams', teamId);
      await updateDoc(teamRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, ...updates } : t));
      if (team?.id === teamId) {
        setTeam(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error: any) {
      console.error('Update team error:', error);
      setError('Failed to update team');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (teamId: string): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');
    if (!isAdmin) throw new Error('Only admins can delete teams');

    try {
      setLoading(true);
      setError(null);

      // Check if team has members
      const teamToDelete = teams.find(t => t.id === teamId);
      if (teamToDelete && teamToDelete.members.length > 0) {
        throw new Error('Cannot delete team with members. Remove all members first.');
      }

      await deleteDoc(doc(db, 'teams', teamId));

      // Update local state
      setTeams(prev => prev.filter(t => t.id !== teamId));
      if (team?.id === teamId) {
        setTeam(null);
      }
    } catch (error: any) {
      console.error('Delete team error:', error);
      setError(error.message || 'Failed to delete team');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTeam = async (teamId: string): Promise<Team | null> => {
    try {
      setLoading(true);
      setError(null);

      const teamDoc = await getDocs(doc(db, 'teams', teamId));
      if (teamDoc.exists()) {
        const teamData = { id: teamDoc.id, ...teamDoc.data() } as Team;
        setTeam(teamData);
        return teamData;
      }
      return null;
    } catch (error: any) {
      console.error('Get team error:', error);
      setError('Failed to load team');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (teamId: string, member: TeamMember): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');
    if (!isAdmin) throw new Error('Only admins can add team members');

    try {
      setLoading(true);
      setError(null);

      const teamRef = doc(db, 'teams', teamId);
      
      // Check if member already exists in the team
      const team = teams.find(t => t.id === teamId);
      if (team && team.members.some(m => m.id === member.id)) {
        throw new Error('Member already exists in this team');
      }

      await updateDoc(teamRef, {
        members: arrayUnion(member),
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setTeams(prev => prev.map(t => 
        t.id === teamId 
          ? { ...t, members: [...t.members, member] }
          : t
      ));
    } catch (error: any) {
      console.error('Add team member error:', error);
      setError(error.message || 'Failed to add team member');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeTeamMember = async (teamId: string, memberId: string): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');
    if (!isAdmin) throw new Error('Only admins can remove team members');

    try {
      setLoading(true);
      setError(null);

      const teamRef = doc(db, 'teams', teamId);
      const team = teams.find(t => t.id === teamId);
      
      if (!team) {
        throw new Error('Team not found');
      }

      const memberToRemove = team.members.find(m => m.id === memberId);
      if (!memberToRemove) {
        throw new Error('Member not found in team');
      }

      await updateDoc(teamRef, {
        members: arrayRemove(memberToRemove),
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setTeams(prev => prev.map(t => 
        t.id === teamId 
          ? { ...t, members: t.members.filter(m => m.id !== memberId) }
          : t
      ));
    } catch (error: any) {
      console.error('Remove team member error:', error);
      setError(error.message || 'Failed to remove team member');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTeamMember = async (teamId: string, memberId: string, updates: Partial<TeamMember>): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');
    if (!isAdmin) throw new Error('Only admins can update team members');

    try {
      setLoading(true);
      setError(null);

      const teamRef = doc(db, 'teams', teamId);
      const team = teams.find(t => t.id === teamId);
      
      if (!team) {
        throw new Error('Team not found');
      }

      // Remove the old member and add the updated one
      const memberToUpdate = team.members.find(m => m.id === memberId);
      if (!memberToUpdate) {
        throw new Error('Member not found in team');
      }

      const updatedMember = { ...memberToUpdate, ...updates };
      
      await updateDoc(teamRef, {
        members: arrayRemove(memberToUpdate),
      });

      await updateDoc(teamRef, {
        members: arrayUnion(updatedMember),
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setTeams(prev => prev.map(t => 
        t.id === teamId 
          ? { 
              ...t, 
              members: t.members.map(m => 
                m.id === memberId ? updatedMember : m
              ) 
            }
          : t
      ));
    } catch (error: any) {
      console.error('Update team member error:', error);
      setError(error.message || 'Failed to update team member');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const refreshTeams = async () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const getUserTeams = (userId: string): Team[] => {
    return teams.filter(team => 
      team.members.some(member => member.id === userId)
    );
  };

  const getTeamMembers = (teamId: string): TeamMember[] => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.members : [];
  };

  // Get available members (all members from predefined teams)
  const availableMembers = PREDEFINED_TEAMS.flatMap(team => team.members);

  return {
    // State
    teams,
    team,
    loading,
    error,
    availableMembers,
    
    // Team Actions
    createTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    
    // Member Management
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
    
    // Utility
    clearError,
    refreshTeams,
    getUserTeams,
    getTeamMembers,
  };
}

// Helper function to get docs (mock implementation)
async function getDocs(ref: any) {
  // This would be implemented with actual Firestore getDoc
  return { exists: () => false, data: () => ({}) };
}