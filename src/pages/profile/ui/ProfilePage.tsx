import { Button, Card, Input, Skeleton } from '@/shared/ui';
import { useEditProfile } from '@/features/profile/edit-profile';
import { cn } from '@/shared/lib';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const {
    avatarPreview,
    fileRef,
    form,
    isLoading,
    isReadingAvatar,
    isSaving,
    notice,
    setForm,
    skills,
    specializations,
    submit,
    toggleSkill,
    uploadAvatarFile,
  } = useEditProfile();

  if (isLoading)
    return (
      <section className={styles.loading}>
        <Skeleton lines={8} />
      </section>
    );

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Аккаунт</span>
          <h1>Редактирование профиля</h1>
          <p>Расскажи о себе и настрой направления подготовки.</p>
        </div>
        <form onSubmit={submit}>
          <Card className={styles.profileCard}>
            <div className={styles.avatarEditor}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Аватар пользователя" />
              ) : (
                <span className={styles.avatar}>{form.username[0]?.toUpperCase() || 'U'}</span>
              )}
              <div>
                <h2>Фотография</h2>
                <p>JPG, PNG или WebP, не более 5 МБ</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  loading={isReadingAvatar}
                  onClick={() => fileRef.current?.click()}
                >
                  Загрузить
                </Button>
                <input
                  ref={fileRef}
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={uploadAvatarFile}
                />
              </div>
            </div>
            <div className={styles.formGrid}>
              <Input
                label="Имя"
                name="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                disabled
                hint="Изменение email не поддерживается API"
              />
              <Input
                label="Город"
                name="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Москва"
              />
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Специализация</span>
                <span className={styles.fieldControl}>
                  <select
                    value={form.specializationId}
                    onChange={(e) => setForm({ ...form, specializationId: e.target.value })}
                  >
                    <option value="">Не выбрана</option>
                    {specializations.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
            </div>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>О себе</span>
              <span className={styles.fieldControl}>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Опыт, цели и интересы"
                />
              </span>
            </label>
            <fieldset className={styles.skillsPicker}>
              <legend>Навыки</legend>
              <p>Выбери технологии, которые хочешь изучать.</p>
              <div>
                {skills.map((skill) => (
                  <label
                    key={skill.id}
                    className={cn(
                      styles.chip,
                      form.skillIds.includes(skill.id) && styles.chipSelected,
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={form.skillIds.includes(skill.id)}
                      onChange={() => toggleSkill(skill.id)}
                    />
                    {skill.title}
                  </label>
                ))}
              </div>
            </fieldset>
            {notice && (
              <div className={notice.type === 'error' ? styles.error : styles.success} role="alert">
                {notice.text}
              </div>
            )}
            <div className={styles.formActions}>
              <Button
                type="submit"
                disabled={isReadingAvatar}
                loading={isSaving}
              >
                Сохранить изменения
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </section>
  );
}
