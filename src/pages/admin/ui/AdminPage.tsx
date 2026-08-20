import { Link } from 'react-router-dom';
import { Button, Card, EmptyState, Input, Modal, Pagination, Skeleton } from '@/shared/ui';
import { useCatalogManagement } from '@/features/admin/manage-catalog';
import trash from '@/shared/config/assets/icons/trash.svg';
import PencilSimple from '@/shared/config/assets/icons/PencilSimple.svg';
import ArrowRight from '@/shared/config/assets/icons/ArrowRight.svg';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const {
    closeEditor,
    confirmDelete,
    deleting,
    editor,
    error,
    filteredData,
    form,
    isDeleting,
    isSaving,
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
    singular,
    submit,
    switchKind,
    title,
  } = useCatalogManagement();

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
            onClick={openCreateEditor}
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
                            onClick={() => openEditEditor(item)}
                            aria-label={`Редактировать ${item.title}`}
                          >
                            <img src={PencilSimple} alt="icon-pencil" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => requestDelete(item)}
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
