export {
  useCreateSkillMutation,
  useCreateSpecializationMutation,
  useDeleteSkillMutation,
  useDeleteSpecializationMutation,
  useGetSkillsQuery,
  useGetSpecializationByIdQuery,
  useGetSpecializationsQuery,
  useUpdateSkillMutation,
  useUpdateSpecializationMutation,
} from './api/catalogApi';
export type { EntityPayload, Skill, Specialization } from './model/types';
