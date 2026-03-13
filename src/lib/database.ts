import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

// ============================================================================
// Type Definitions
// ============================================================================

export interface Committee {
  id?: string;
  name: string;
  description?: string;
  position?: string;
  category?: 'teacher' | 'student';
  year?: string;
  members?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// Committee Data (structured full committee for a year)
// ============================================================================

export interface ExecutiveMember {
  name: string;
  position: string;
}

export interface QuizTeamEntry {
  name: string;
  members: string[];
}

export interface CommitteeData {
  id?: string;
  year: string;
  teachersInCharge: string[];
  executiveCommittee: ExecutiveMember[];
  organizers: string[];
  editors: string[];
  coordinators: string[];
  quizTeams: QuizTeamEntry[];
  committeeMembers: string[];
  classCoordinators: string[];
  updatedAt?: Date;
}

// Uses a fixed document ID "current" in the "committeeData" collection
const COMMITTEE_DOC_ID = "current";

export async function getCommitteeData(): Promise<CommitteeData | null> {
  try {
    const docRef = doc(db, "committeeData", COMMITTEE_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CommitteeData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching committee data:", error);
    throw error;
  }
}

export async function setCommitteeData(data: Omit<CommitteeData, 'id'>): Promise<void> {
  try {
    const docRef = doc(db, "committeeData", COMMITTEE_DOC_ID);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error setting committee data:", error);
    throw error;
  }
}

export interface QuizTeam {
  id?: string;
  name: string;
  members: string[];
  score?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Event {
  id?: string;
  title: string;
  description?: string;
  date: Date;
  location?: string;
  organizers?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Achievement {
  id?: string;
  title: string;
  description?: string;
  date: Date;
  achievedBy?: string[];
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Paper {
  id?: string;
  title: string;
  subject: string;
  year: number;
  medium: 'Sinhala' | 'English';
  downloadUrl: string;
  fileSize?: string | number;
  uploadedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectEvent {
  id?: string;
  title: string;
  description: string;
  images: string[];
  date?: string | Date;
  location?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectAchievement {
  id?: string;
  title: string;
  description: string;
  images: string[];
  date?: string | Date;
  category?: string;
  achievedBy?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PastLeadershipMember {
  name: string;
  position: string;
  category?: 'teacher' | 'student';
}

export interface PastLeadership {
  id?: string;
  year: string;
  members: PastLeadershipMember[];
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// Committees Collection
// ============================================================================

export async function getCommittees(): Promise<Committee[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "committees"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Committee));
  } catch (error) {
    console.error("Error fetching committees:", error);
    throw error;
  }
}

export async function getCommittee(id: string): Promise<Committee | null> {
  try {
    const docRef = doc(db, "committees", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Committee;
    }
    return null;
  } catch (error) {
    console.error("Error fetching committee:", error);
    throw error;
  }
}

export async function addCommittee(committee: Committee): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "committees"), {
      ...committee,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding committee:", error);
    throw error;
  }
}

export async function updateCommittee(
  id: string,
  committee: Partial<Committee>
): Promise<void> {
  try {
    const docRef = doc(db, "committees", id);
    await updateDoc(docRef, {
      ...committee,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating committee:", error);
    throw error;
  }
}

export async function deleteCommittee(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "committees", id));
  } catch (error) {
    console.error("Error deleting committee:", error);
    throw error;
  }
}

// ============================================================================
// Quiz Teams Collection
// ============================================================================

export async function getQuizTeams(): Promise<QuizTeam[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "quizTeams"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as QuizTeam));
  } catch (error) {
    console.error("Error fetching quiz teams:", error);
    throw error;
  }
}

export async function getQuizTeam(id: string): Promise<QuizTeam | null> {
  try {
    const docRef = doc(db, "quizTeams", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as QuizTeam;
    }
    return null;
  } catch (error) {
    console.error("Error fetching quiz team:", error);
    throw error;
  }
}

export async function addQuizTeam(team: QuizTeam): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "quizTeams"), {
      ...team,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding quiz team:", error);
    throw error;
  }
}

export async function updateQuizTeam(
  id: string,
  team: Partial<QuizTeam>
): Promise<void> {
  try {
    const docRef = doc(db, "quizTeams", id);
    await updateDoc(docRef, {
      ...team,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating quiz team:", error);
    throw error;
  }
}

export async function deleteQuizTeam(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "quizTeams", id));
  } catch (error) {
    console.error("Error deleting quiz team:", error);
    throw error;
  }
}

// ============================================================================
// Events Collection
// ============================================================================

export async function getEvents(): Promise<Event[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Event));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function getEvent(id: string): Promise<Event | null> {
  try {
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Event;
    }
    return null;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

export async function addEvent(event: Event): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...event,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
}

export async function updateEvent(
  id: string,
  event: Partial<Event>
): Promise<void> {
  try {
    const docRef = doc(db, "events", id);
    await updateDoc(docRef, {
      ...event,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "events", id));
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

// ============================================================================
// Achievements Collection
// ============================================================================

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "achievements"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Achievement));
  } catch (error) {
    console.error("Error fetching achievements:", error);
    throw error;
  }
}

export async function getAchievement(id: string): Promise<Achievement | null> {
  try {
    const docRef = doc(db, "achievements", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Achievement;
    }
    return null;
  } catch (error) {
    console.error("Error fetching achievement:", error);
    throw error;
  }
}

export async function addAchievement(achievement: Achievement): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "achievements"), {
      ...achievement,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding achievement:", error);
    throw error;
  }
}

export async function updateAchievement(
  id: string,
  achievement: Partial<Achievement>
): Promise<void> {
  try {
    const docRef = doc(db, "achievements", id);
    await updateDoc(docRef, {
      ...achievement,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating achievement:", error);
    throw error;
  }
}

export async function deleteAchievement(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "achievements", id));
  } catch (error) {
    console.error("Error deleting achievement:", error);
    throw error;
  }
}

// ============================================================================
// Papers Collection
// ============================================================================

export async function getPapers(): Promise<Paper[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "papers"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Paper));
  } catch (error) {
    console.error("Error fetching papers:", error);
    throw error;
  }
}

export async function getPaper(id: string): Promise<Paper | null> {
  try {
    const docRef = doc(db, "papers", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Paper;
    }
    return null;
  } catch (error) {
    console.error("Error fetching paper:", error);
    throw error;
  }
}

export async function addPaper(paper: Paper): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "papers"), {
      ...paper,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding paper:", error);
    throw error;
  }
}

export async function updatePaper(
  id: string,
  paper: Partial<Paper>
): Promise<void> {
  try {
    const docRef = doc(db, "papers", id);
    await updateDoc(docRef, {
      ...paper,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating paper:", error);
    throw error;
  }
}

export async function deletePaper(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "papers", id));
  } catch (error) {
    console.error("Error deleting paper:", error);
    throw error;
  }
}

export async function getPapersFiltered(
  subject?: string,
  year?: number,
  medium?: 'Sinhala' | 'English'
): Promise<Paper[]> {
  try {
    let queryConstraints: any[] = [];
    
    if (subject) {
      queryConstraints.push(where('subject', '==', subject));
    }
    if (year) {
      queryConstraints.push(where('year', '==', year));
    }
    if (medium) {
      queryConstraints.push(where('medium', '==', medium));
    }

    let q = query(collection(db, "papers"), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Paper));
  } catch (error) {
    console.error("Error fetching filtered papers:", error);
    throw error;
  }
}

export async function getUniquePaperValues(field: 'subject' | 'year' | 'medium'): Promise<any[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "papers"));
    const values = new Set<any>();
    
    querySnapshot.docs.forEach((doc) => {
      const value = doc.data()[field];
      if (value) values.add(value);
    });

    return Array.from(values).sort();
  } catch (error) {
    console.error(`Error fetching unique ${field} values:`, error);
    throw error;
  }
}

// ============================================================================
// Project Events Collection
// ============================================================================

export async function getProjectEvents(): Promise<ProjectEvent[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "projectEvents"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ProjectEvent));
  } catch (error) {
    console.error("Error fetching project events:", error);
    throw error;
  }
}

export async function getProjectEvent(id: string): Promise<ProjectEvent | null> {
  try {
    const docRef = doc(db, "projectEvents", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ProjectEvent;
    }
    return null;
  } catch (error) {
    console.error("Error fetching project event:", error);
    throw error;
  }
}

export async function addProjectEvent(event: ProjectEvent): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "projectEvents"), {
      ...event,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding project event:", error);
    throw error;
  }
}

export async function updateProjectEvent(
  id: string,
  event: Partial<ProjectEvent>
): Promise<void> {
  try {
    const docRef = doc(db, "projectEvents", id);
    await updateDoc(docRef, {
      ...event,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating project event:", error);
    throw error;
  }
}

export async function deleteProjectEvent(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "projectEvents", id));
  } catch (error) {
    console.error("Error deleting project event:", error);
    throw error;
  }
}

// ============================================================================
// Project Achievements Collection
// ============================================================================

export async function getProjectAchievements(): Promise<ProjectAchievement[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "projectAchievements"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ProjectAchievement));
  } catch (error) {
    console.error("Error fetching project achievements:", error);
    throw error;
  }
}

export async function getProjectAchievement(
  id: string
): Promise<ProjectAchievement | null> {
  try {
    const docRef = doc(db, "projectAchievements", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ProjectAchievement;
    }
    return null;
  } catch (error) {
    console.error("Error fetching project achievement:", error);
    throw error;
  }
}

export async function addProjectAchievement(
  achievement: ProjectAchievement
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "projectAchievements"), {
      ...achievement,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding project achievement:", error);
    throw error;
  }
}

export async function updateProjectAchievement(
  id: string,
  achievement: Partial<ProjectAchievement>
): Promise<void> {
  try {
    const docRef = doc(db, "projectAchievements", id);
    await updateDoc(docRef, {
      ...achievement,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating project achievement:", error);
    throw error;
  }
}

export async function deleteProjectAchievement(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "projectAchievements", id));
  } catch (error) {
    console.error("Error deleting project achievement:", error);
    throw error;
  }
}

// ============================================================================
// Past Leadership Collection
// ============================================================================

export async function getPastLeadership(): Promise<PastLeadership[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "pastLeadership"));
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    } as PastLeadership));
  } catch (error) {
    console.error("Error fetching past leadership:", error);
    throw error;
  }
}

export async function addPastLeadership(entry: Omit<PastLeadership, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "pastLeadership"), {
      ...entry,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding past leadership:", error);
    throw error;
  }
}

export async function updatePastLeadership(
  id: string,
  entry: Partial<PastLeadership>
): Promise<void> {
  try {
    const docRef = doc(db, "pastLeadership", id);
    await updateDoc(docRef, {
      ...entry,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating past leadership:", error);
    throw error;
  }
}

export async function deletePastLeadership(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "pastLeadership", id));
  } catch (error) {
    console.error("Error deleting past leadership:", error);
    throw error;
  }
}
