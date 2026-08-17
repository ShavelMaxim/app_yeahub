import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, EmptyState, Input, Modal, Pagination, Skeleton } from '@/shared/ui';
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
} from '@/entities/catalog';
import trash from '@/shared/config/assets/icons/trash.svg';
import PencilSimple from '@/shared/config/assets/icons/PencilSimple.svg';
import ArrowRight from '@/shared/config/assets/icons/ArrowRight.svg';
import type { EntityPayload, Skill, Specialization } from '@/entities/catalog';
import { getApiErrorMessage } from '@/shared/lib';
import styles from './AdminPage.module.css';

type EntityKind = 'specializations' | 'skills';
type EditableEntity = Skill | Specialization;

export default function AdminPage() {
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

  const title = kind === 'specializations' ? 'Специализации' : 'Навыки';
  const singular = kind === 'specializations' ? 'специализацию' : 'навык';
  const isSaving =
    createSpecState.isLoading ||
    updateSpecState.isLoading ||
    createSkillState.isLoading ||
    updateSkillState.isLoading;
  const isDeleting = deleteSpecState.isLoading || deleteSkillState.isLoading;

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>Управление контентом</span>
            <h1>Административная панель</h1>
            <p>Создавайте и редактируйте данные платформы.</p>
          </div>
          <Button
            className={styles.headingButton}
            onClick={() =>
              kind === 'specializations' ? navigate('/admin/specializations/new') : openEditor()
            }
          >
            + Добавить {singular}
          </Button>
        </div>
        <Card className={styles.card}>
          <div className={styles.toolbar}>
            <div className={styles.tabs} role="tablist">
              <button
                className={kind === 'specializations' ? styles.active : undefined}
                onClick={() => switchKind('specializations')}
              >
                Специализации
              </button>
              <button
                className={kind === 'skills' ? styles.active : undefined}
                onClick={() => switchKind('skills')}
              >
                Навыки
              </button>
            </div>
            <Input
              className={styles.search}
              label="Поиск"
              aria-label="Поиск"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Найти ${singular}`}
            />
          </div>
          {error && !editor.open && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}
          {query.isLoading ? (
            <Skeleton className={styles.contentState} lines={8} />
          ) : query.isError ? (
            <EmptyState
              className={styles.contentState}
              icon="!"
              title="Данные не загрузились"
              description="Проверьте соединение с API и права аккаунта."
            />
          ) : !filteredData.length ? (
            <EmptyState
              className={styles.contentState}
              title={`${title} не найдены`}
              description="Измените запрос или создайте первую запись."
              action={<Button onClick={() => openEditor()}>Добавить</Button>}
            />
          ) : (
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>
                      <span className={styles.visuallyHidden}>Действия</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>
                        <strong>{item.title}</strong>
                      </td>
                      <td>{item.description || '—'}</td>
                      <td>
                        <div className={styles.tableActions}>
                          {kind === 'specializations' && (
                            <Link
                              className={styles.detailsLink}
                              to={`/admin/specializations/${item.id}`}
                              aria-label={`Открыть специализацию ${item.title}`}
                            >
                              <img src={ArrowRight} alt="icon-arrow" />
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() =>
                              kind === 'specializations'
                                ? navigate(`/admin/specializations/${item.id}/edit`)
                                : openEditor(item)
                            }
                            aria-label={`Редактировать ${item.title}`}
                          >
                            <img src={PencilSimple} alt="icon-pencil" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => {
                              setDeleting(item);
                              setError('');
                            }}
                            aria-label={`Удалить ${item.title}`}
                          >
                            <img src={trash} alt="icon-trash" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination
            currentPage={page}
            totalPages={Math.ceil((query.data?.total ?? 0) / 10)}
            onPageChange={setPage}
          />
        </Card>
      </div>

      <Modal
        open={editor.open}
        title={`${editor.item ? 'Редактировать' : 'Добавить'} ${singular}`}
        onClose={closeEditor}
        footer={
          <>
            <Button variant="ghost" onClick={closeEditor}>
              Отмена
            </Button>
            <Button form="entity-form" type="submit" loading={isSaving}>
              Сохранить
            </Button>
          </>
        }
      >
        <form id="entity-form" onSubmit={submit}>
          <Input
            label="Название"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Например, React"
            autoFocus
          />
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Описание</span>
            <span className={styles.fieldControl}>
              <textarea
                rows={5}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Кратко опишите сущность"
              />
            </span>
          </label>
          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}
        </form>
      </Modal>
      <Modal
        open={Boolean(deleting)}
        title="Подтвердите удаление"
        onClose={() => setDeleting(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Отмена
            </Button>
            <Button variant="danger" loading={isDeleting} onClick={confirmDelete}>
              Удалить
            </Button>
          </>
        }
      >
        <p>
          Запись <strong>«{deleting?.title}»</strong> будет удалена без возможности восстановления.
        </p>
        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}
      </Modal>
    </section>
  );
}
