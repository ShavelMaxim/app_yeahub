import { useMemo, useState, type FormEvent } from 'react';
import { Button, Card, EmptyState, Input, Modal, Skeleton } from '@/shared/ui';
import {
  useCreateSkillMutation,
  useCreateSpecializationMutation,
  useDeleteSkillMutation,
  useDeleteSpecializationMutation,
  useGetSkillsQuery,
  useGetSpecializationsQuery,
  useUpdateSkillMutation,
  useUpdateSpecializationMutation,
} from '@/entities/catalog';
import type { EntityPayload, Skill, Specialization } from '@/entities/catalog';
import { getApiErrorMessage } from '@/shared/lib';

type EntityKind = 'specializations' | 'skills';
type EditableEntity = Skill | Specialization;

export default function AdminPage() {
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
  const specs = useGetSpecializationsQuery({ page, limit: 10 });
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
  const closeEditor = () => setEditor({ open: false, item: null });

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
    <section className="page-section admin-page">
      <div className="container">
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">Управление контентом</span>
            <h1>Административная панель</h1>
            <p>Создавайте и редактируйте данные платформы.</p>
          </div>
          <Button onClick={() => openEditor()}>+ Добавить {singular}</Button>
        </div>
        <Card className="admin-card">
          <div className="admin-toolbar">
            <div className="tabs" role="tablist">
              <button
                className={kind === 'specializations' ? 'active' : ''}
                onClick={() => switchKind('specializations')}
              >
                Специализации
              </button>
              <button
                className={kind === 'skills' ? 'active' : ''}
                onClick={() => switchKind('skills')}
              >
                Навыки
              </button>
            </div>
            <Input
              label="Поиск"
              aria-label="Поиск"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Найти ${singular}`}
            />
          </div>
          {error && !editor.open && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}
          {query.isLoading ? (
            <Skeleton lines={8} />
          ) : query.isError ? (
            <EmptyState
              icon="!"
              title="Данные не загрузились"
              description="Проверьте соединение с API и права аккаунта."
            />
          ) : !filteredData.length ? (
            <EmptyState
              title={`${title} не найдены`}
              description="Измените запрос или создайте первую запись."
              action={<Button onClick={() => openEditor()}>Добавить</Button>}
            />
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>
                      <span className="visually-hidden">Действия</span>
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
                        <div className="table-actions">
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => openEditor(item)}
                            aria-label={`Редактировать ${item.title}`}
                          >
                            ✎
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
                            ⌫
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
              ← Назад
            </button>
            <span>
              Страница {page} · всего {query.data?.total ?? 0}
            </span>
            <button
              disabled={!query.data || page * 10 >= query.data.total}
              onClick={() => setPage((value) => value + 1)}
            >
              Вперёд →
            </button>
          </div>
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
          <label className="field">
            <span className="field__label">Описание</span>
            <span className="field__control">
              <textarea
                rows={5}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Кратко опишите сущность"
              />
            </span>
          </label>
          {error && (
            <div className="alert alert--error" role="alert">
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
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}
      </Modal>
    </section>
  );
}
