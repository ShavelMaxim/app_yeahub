import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useCreateSkillMutation,
  useCreateSpecializationMutation,
  useDeleteSkillMutation,
  useDeleteSpecializationMutation,
  useGetSkillsQuery,
  useGetSpecializationByIdQuery,
  useGetSpecializationsQuery,
  useUpdateSkillMutation,
  useUpdateSpecializationMutation,
  type EntityPayload,
  type Skill,
  type Specialization,
} from '@/entities/catalog';
import { getApiErrorMessage } from '@/shared/lib';

export type EntityKind = 'specializations' | 'skills';
export type EditableEntity = Skill | Specialization;

export const useCatalogManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { specializationId } = useParams();
  const isCreateRoute = location.pathname.endsWith('/specializations/new');
  const isEditRoute = location.pathname.endsWith('/edit') && Boolean(specializationId);
  const [kind, setKind] = useState<EntityKind>('specializations');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editor, setEditor] = useState<{ open: boolean; item: EditableEntity | null }>({
    open: false,
    item: null,
  });
  const [deleting, setDeleting] = useState<EditableEntity | null>(null);
  const [form, setForm] = useState<EntityPayload>({ title: '', description: '' });
  const [error, setError] = useState('');
  const routeSpecialization = useGetSpecializationByIdQuery(Number(specializationId), {
    skip: !isEditRoute || !specializationId,
  });
  const specs = useGetSpecializationsQuery({
    page,
    limit: 10,
    title: kind === 'specializations' ? search || undefined : undefined,
  });
  const skills = useGetSkillsQuery({
    page,
    limit: 10,
    title: kind === 'skills' ? search || undefined : undefined,
  });
  const [createSpec, createSpecState] = useCreateSpecializationMutation();
  const [updateSpec, updateSpecState] = useUpdateSpecializationMutation();
  const [deleteSpec, deleteSpecState] = useDeleteSpecializationMutation();
  const [createSkill, createSkillState] = useCreateSkillMutation();
  const [updateSkill, updateSkillState] = useUpdateSkillMutation();
  const [deleteSkill, deleteSkillState] = useDeleteSkillMutation();

  useEffect(() => {
    if (isCreateRoute) {
      setKind('specializations');
      setForm({ title: '', description: '' });
      setEditor({ open: true, item: null });
      setError('');
    } else if (isEditRoute && routeSpecialization.data) {
      setKind('specializations');
      setForm({
        title: routeSpecialization.data.title,
        description: routeSpecialization.data.description ?? '',
      });
      setEditor({ open: true, item: routeSpecialization.data });
      setError('');
    }
  }, [isCreateRoute, isEditRoute, routeSpecialization.data]);

  const query = kind === 'specializations' ? specs : skills;
  const filteredData = useMemo(() => {
    const items = query.data?.data ?? [];
    if (!search) return items;
    return items.filter((item) =>
      `${item.title} ${item.description ?? ''}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [query.data?.data, search]);

  const switchKind = (next: EntityKind) => {
    setKind(next);
    setPage(1);
    setSearch('');
    setError('');
  };

  const openEditor = (item: EditableEntity | null = null) => {
    setForm({ title: item?.title ?? '', description: item?.description ?? '' });
    setEditor({ open: true, item });
    setError('');
  };

  const closeEditor = () => {
    setEditor({ open: false, item: null });
    if (isCreateRoute || isEditRoute) navigate('/admin', { replace: true });
  };

  const openCreateEditor = () => {
    if (kind === 'specializations') navigate('/admin/specializations/new');
    else openEditor();
  };

  const openEditEditor = (item: EditableEntity) => {
    if (kind === 'specializations') navigate(`/admin/specializations/${item.id}/edit`);
    else openEditor(item);
  };

  const requestDelete = (item: EditableEntity) => {
    setDeleting(item);
    setError('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.title.trim().length < 2 || form.description.trim().length < 3) {
      setError('Заполните название и описание.');
      return;
    }
    try {
      if (kind === 'specializations') {
        if (editor.item) await updateSpec({ id: editor.item.id, body: form }).unwrap();
        else await createSpec(form).unwrap();
      } else if (editor.item) await updateSkill({ id: editor.item.id, body: form }).unwrap();
      else await createSkill(form).unwrap();
      closeEditor();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setError('');
    try {
      if (kind === 'specializations') await deleteSpec(deleting.id).unwrap();
      else await deleteSkill(deleting.id).unwrap();
      setDeleting(null);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  return {
    closeEditor,
    confirmDelete,
    deleting,
    editor,
    error,
    filteredData,
    form,
    isDeleting: deleteSpecState.isLoading || deleteSkillState.isLoading,
    isSaving:
      createSpecState.isLoading ||
      updateSpecState.isLoading ||
      createSkillState.isLoading ||
      updateSkillState.isLoading,
    kind,
    openCreateEditor,
    openEditEditor,
    openEditor,
    page,
    query,
    requestDelete,
    search,
    setDeleting,
    setForm,
    setPage,
    setSearch,
    singular: kind === 'specializations' ? 'специализацию' : 'навык',
    submit,
    switchKind,
    title: kind === 'specializations' ? 'Специализации' : 'Навыки',
  };
};
