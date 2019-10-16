export const participantTypes = ['RESIDENTIAL ORPHAN', 'COMMUNITY ORPHAN', 'NON ORPHAN'];
export const residenceTypes = ['FAMILY', 'RESIDENTIAL'];
export const sites = ['CAMBODIA', 'ETHIOPIA', 'HYDERABAD', 'KENYA', 'NAGALAND', 'TANZANIA'];
export const PARTICIPANTS = 'participants';
export const INTERVIEWS = 'interviews';
export const EVENTS = 'events';
export const EDUCATION = 'education';
export const MOVES = 'moves';
export const TRAUMA = 'trauma';
export const RELATIONSHIPSTATUS = 'relationship status';
export const MENTALHEALTH = 'mental health';
export const eventTypes = [EDUCATION, MOVES, TRAUMA, RELATIONSHIPSTATUS, MENTALHEALTH];
export const educationLevels = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  'College/Vocational training',
  'University or above',
  'Not enrolled',
];
export const moveTypes = ['moved to community', 'moved to institution'];
export const traumaTypes = ['abused'];
export const relationshipStatus = ['single', 'married', 'separated', 'divorced', 'widowed'];
export const mentalHealth = ['low', 'medium', 'high'];
export const eventValues = new Map([
  ['upper', 0],
  ['education', 1],
  ['relationship status', 2],
  ['moves', 3],
  ['trauma', 4],
  ['mental health', 5],
  ['lower', 6],
]);
export const eventValuesInverse = new Map([
  [1, 'Education'],
  [2, 'Relationship Status'],
  [3, 'Moves'],
  [4, 'Trauma'],
  [5, 'Mental Health'],
]);
export const eventColors = new Map([
  [1, '#1976D2'],
  [2, '#FFC107'],
  [3, '#9E9E9E'],
  [4, '#CE1620'],
  [5, '#4CAF50'],
]);
export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
// Colors
export const darkPrimaryColor = '#1976D2';
export const primaryColor = '#2196F3';
export const lightPrimaryColor = '#448AFF';
export const accentColor = '#FFC107';
export const whiteColor = '#FFFFFF';
export const blackColor = '#212121';
export const greenColor = '#4CAF50';
export const grayColor = '#9E9E9E';
export const redColor = '#CE1620';
