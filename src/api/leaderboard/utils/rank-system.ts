export enum RankTypes {
  PROJECT_VIEW = 'project_view',
  CREATE_PROJECT = 'create_project',
  DEPLOY_PROJECT = 'deploy_project',
  HACKATON_WINNER = 'hackaton_winner',
  HACKATON_PARTICIPANT = 'hackaton_participant',
  CONTRIBUTOR = 'contribtor',
  CUSTOM = 'CUSTOM',
}

export const rankingPoints: Record<RankTypes, number | number[]> = {
  [RankTypes.PROJECT_VIEW]: 20,
  [RankTypes.CREATE_PROJECT]: 50,
  [RankTypes.DEPLOY_PROJECT]: 10,
  [RankTypes.CONTRIBUTOR]: [50, 100],
  [RankTypes.HACKATON_PARTICIPANT]: 300,
  [RankTypes.HACKATON_WINNER]: 2500,
  [RankTypes.CUSTOM]: [0, 99999],
};
