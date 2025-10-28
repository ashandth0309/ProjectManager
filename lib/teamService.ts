import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
  arrayUnion,
  arrayRemove,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Team, TeamMember } from '../types/team';
import { PREDEFINED_TEAMS } from '../constants/teams';

// Team service
class TeamService {
  // Initialize with predefined teams if empty
  async initializeTeams(): Promise<void> {
    try {
      const teamsSnapshot = await getDocs(collection(db, 'teams'));
      if (teamsSnapshot.empty) {
        // Add predefined teams to Firestore
        const batch = writeBatch(db);
        PREDEFINED_TEAMS.forEach(team => {
          const teamRef = doc(collection(db, 'teams'));
          batch.set(teamRef, team);
        });
        await batch.commit();
        console.log('Predefined teams initialized');
      }
    } catch (error) {
      console.error('Initialize teams error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Team operations

  // Create a new team
  async createTeam(teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const teamWithMetadata = {
        ...teamData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'teams'), teamWithMetadata);
      return docRef.id;
    } catch (error) {
      console.error('Create team error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get team by ID
  async getTeam(teamId: string): Promise<Team | null> {
    try {
      const teamDoc = await getDoc(doc(db, 'teams', teamId));
      if (teamDoc.exists()) {
        return { id: teamDoc.id, ...teamDoc.data() } as Team;
      }
      return null;
    } catch (error) {
      console.error('Get team error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Update team
  async updateTeam(teamId: string, updates: Partial<Team>): Promise<void> {
    try {
      const teamRef = doc(db, 'teams', teamId);
      await updateDoc(teamRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update team error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Delete team
  async deleteTeam(teamId: string): Promise<void> {
    try {
      // Check if team has members
      const team = await this.getTeam(teamId);
      if (team && team.members.length > 0) {
        throw new Error('Cannot delete team with members. Remove all members first.');
      }

      await deleteDoc(doc(db, 'teams', teamId));
    } catch (error) {
      console.error('Delete team error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get all teams
  async getAllTeams(): Promise<Team[]> {
    try {
      await this.initializeTeams(); // Ensure teams are initialized
      
      const teamsQuery = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(teamsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
    } catch (error) {
      console.error('Get all teams error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get teams by member
  async getTeamsByMember(memberId: string): Promise<Team[]> {
    try {
      const teamsQuery = query(
        collection(db, 'teams'),
        where('members', 'array-contains', { id: memberId })
      );
      const snapshot = await getDocs(teamsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
    } catch (error) {
      console.error('Get teams by member error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Member operations

  // Add member to team
  async addTeamMember(teamId: string, member: TeamMember): Promise<void> {
    try {
      const teamRef = doc(db, 'teams', teamId);
      
      // Check if member already exists
      const team = await this.getTeam(teamId);
      if (team && team.members.some(m => m.id === member.id)) {
        throw new Error('Member already exists in this team');
      }

      await updateDoc(teamRef, {
        members: arrayUnion(member),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Add team member error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Remove member from team
  async removeTeamMember(teamId: string, memberId: string): Promise<void> {
    try {
      const teamRef = doc(db, 'teams', teamId);
      const team = await this.getTeam(teamId);
      
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
    } catch (error) {
      console.error('Remove team member error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Update team member
  async updateTeamMember(teamId: string, memberId: string, updates: Partial<TeamMember>): Promise<void> {
    try {
      const teamRef = doc(db, 'teams', teamId);
      const team = await this.getTeam(teamId);
      
      if (!team) {
        throw new Error('Team not found');
      }

      const memberToUpdate = team.members.find(m => m.id === memberId);
      if (!memberToUpdate) {
        throw new Error('Member not found in team');
      }

      // Remove old member and add updated member
      const updatedMember = { ...memberToUpdate, ...updates };
      
      const batch = writeBatch(db);
      batch.update(teamRef, {
        members: arrayRemove(memberToUpdate),
      });
      batch.update(teamRef, {
        members: arrayUnion(updatedMember),
        updatedAt: new Date().toISOString(),
      });

      await batch.commit();
    } catch (error) {
      console.error('Update team member error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get team members
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      const team = await this.getTeam(teamId);
      return team ? team.members : [];
    } catch (error) {
      console.error('Get team members error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get member by ID across all teams
  async getMember(memberId: string): Promise<TeamMember | null> {
    try {
      const teams = await this.getAllTeams();
      for (const team of teams) {
        const member = team.members.find(m => m.id === memberId);
        if (member) return member;
      }
      return null;
    } catch (error) {
      console.error('Get member error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Check if user is in team
  async isUserInTeam(userId: string, teamId: string): Promise<boolean> {
    try {
      const team = await this.getTeam(teamId);
      return team ? team.members.some(member => member.id === userId) : false;
    } catch (error) {
      console.error('Check user in team error:', error);
      return false;
    }
  }

  // Real-time listeners

  // Listen to teams changes
  listenToTeams(callback: (teams: Team[]) => void): Unsubscribe {
    const teamsQuery = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));
    
    return onSnapshot(teamsQuery, (snapshot) => {
      const teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
      callback(teams);
    }, (error) => {
      console.error('Teams listener error:', error);
    });
  }

  // Listen to team changes
  listenToTeam(teamId: string, callback: (team: Team | null) => void): Unsubscribe {
    const teamRef = doc(db, 'teams', teamId);
    
    return onSnapshot(teamRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as Team);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Team listener error:', error);
    });
  }

  // Analytics and reporting

  // Get team statistics
  async getTeamStats(teamId: string): Promise<{
    totalMembers: number;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
  }> {
    try {
      const team = await this.getTeam(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      // Get projects for this team (you would need to import projectService or make a separate query)
      const projectsQuery = query(
        collection(db, 'projects'),
        where('assignedTeam.id', '==', teamId)
      );
      const projectsSnapshot = await getDocs(projectsQuery);
      const projects = projectsSnapshot.docs.map(doc => doc.data() as any);

      return {
        totalMembers: team.members.length,
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'ongoing').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
      };
    } catch (error) {
      console.error('Get team stats error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Get all available members (from predefined teams)
  getAvailableMembers(): TeamMember[] {
    return PREDEFINED_TEAMS.flatMap(team => team.members);
  }

  // Get members not in a specific team
  async getAvailableMembersForTeam(teamId: string): Promise<TeamMember[]> {
    try {
      const team = await this.getTeam(teamId);
      const allMembers = this.getAvailableMembers();
      
      if (!team) {
        return allMembers;
      }

      // Filter out members already in the team
      const teamMemberIds = new Set(team.members.map(m => m.id));
      return allMembers.filter(member => !teamMemberIds.has(member.id));
    } catch (error) {
      console.error('Get available members for team error:', error);
      return this.getAvailableMembers();
    }
  }

  // Utility methods

  // Get team by name
  async getTeamByName(name: string): Promise<Team | null> {
    try {
      const teamsQuery = query(
        collection(db, 'teams'),
        where('name', '==', name),
        limit(1)
      );
      const snapshot = await getDocs(teamsQuery);
      if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Team;
      }
      return null;
    } catch (error) {
      console.error('Get team by name error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Search teams by name
  async searchTeams(searchTerm: string): Promise<Team[]> {
    try {
      const allTeams = await this.getAllTeams();
      return allTeams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Search teams error:', error);
      throw this.handleFirestoreError(error);
    }
  }

  // Error handler for Firestore errors
  private handleFirestoreError(error: any): Error {
    let errorMessage = 'A database error occurred';

    switch (error.code) {
      case 'permission-denied':
        errorMessage = 'You do not have permission to perform this action';
        break;
      case 'not-found':
        errorMessage = 'The requested document was not found';
        break;
      case 'already-exists':
        errorMessage = 'A document with this ID already exists';
        break;
      case 'resource-exhausted':
        errorMessage = 'The database quota has been exceeded';
        break;
      case 'failed-precondition':
        errorMessage = 'Operation was rejected because the system is not in a required state';
        break;
      case 'aborted':
        errorMessage = 'Operation was aborted';
        break;
      case 'out-of-range':
        errorMessage = 'Operation was attempted past the valid range';
        break;
      case 'unimplemented':
        errorMessage = 'Operation is not implemented or not supported';
        break;
      case 'internal':
        errorMessage = 'Internal database error';
        break;
      case 'unavailable':
        errorMessage = 'The service is currently unavailable';
        break;
      case 'data-loss':
        errorMessage = 'Unrecoverable data loss or corruption';
        break;
      case 'unauthenticated':
        errorMessage = 'User is not authenticated';
        break;
      default:
        errorMessage = error.message || errorMessage;
        break;
    }

    return new Error(errorMessage);
  }
}

// Create and export a singleton instance
export const teamService = new TeamService();

// Default export
export default teamService;