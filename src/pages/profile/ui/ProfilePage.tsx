import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Card, Input, Skeleton } from '@/shared/ui';
import { setUser, useAuth } from '@/features/auth';
import { useGetSkillsQuery, useGetSpecializationsQuery } from '@/entities/catalog';
import { useGetMeQuery, useUpdateProfileMutation, useUpdateUserMutation } from '@/entities/user';
import { getApiErrorMessage } from '@/shared/lib';
import type { Profile, ProfileSkill } from '@/entities/user';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user: fallbackUser } = useAuth();
  const { data, isLoading, refetch } = useGetMeQuery();
  const user = data ?? fallbackUser;
  const activeProfile =
    user?.profiles?.find((profile: Profile) => profile.isActive) ?? user?.profiles?.[0];
  const { data: specializations } = useGetSpecializationsQuery({ limit: 100 });
  const { data: skills } = useGetSkillsQuery({ limit: 100 });
  const [updateUser, userUpdate] = useUpdateUserMutation();
  const [updateProfile, profileUpdate] = useUpdateProfileMutation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    city: '',
    avatarUrl: '',
    description: '',
    specializationId: '',
    skillIds: [] as number[],
  });
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      username: user.username ?? '',
      email: user.email ?? '',
      city: user.city ?? '',
      avatarUrl: user.avatarUrl ?? '',
      description: activeProfile?.description ?? '',
      specializationId: activeProfile?.specializationId?.toString() ?? '',
      skillIds: activeProfile?.profileSkills?.map((skill: ProfileSkill) => skill.id) ?? [],
    });
  }, [activeProfile, user]);

  const uploadAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      setNotice({ type: 'error', text: 'Выберите изображение размером до 2 МБ.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, avatarUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const toggleSkill = (id: number) =>
    setForm((current) => ({
      ...current,
      skillIds: current.skillIds.includes(id)
        ? current.skillIds.filter((skillId) => skillId !== id)
        : [...current.skillIds, id],
    }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setNotice(null);
    try {
      await updateUser({
        id: user.id,
        body: {
          username: form.username,
          email: form.email,
          city: form.city,
          avatarUrl: form.avatarUrl,
        },
      }).unwrap();
      if (activeProfile) {
        await updateProfile({
          id: activeProfile.id,
          body: {
            description: form.description,
            specializationId: Number(form.specializationId) || activeProfile.specializationId,
            profileSkills: form.skillIds.map((id) => String(id)),
          },
        }).unwrap();
      }
      const refreshed = await refetch().unwrap();
      dispatch(setUser(refreshed));
      setNotice({ type: 'success', text: 'Профиль успешно обновлён.' });
    } catch (error) {
      setNotice({ type: 'error', text: getApiErrorMessage(error) });
    }
  };

  if (isLoading && !user)
    return (
      <section className="page-section container">
        <Skeleton lines={8} />
      </section>
    );

  return (
    <section className="page-section profile-page">
      <div className="container container--narrow">
        <div className="page-heading">
          <span className="eyebrow">Аккаунт</span>
          <h1>Мой профиль</h1>
          <p>Расскажи о себе и настрой направления подготовки.</p>
        </div>
        <form onSubmit={submit}>
          <Card className="profile-card">
            <div className="avatar-editor">
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt="Аватар пользователя" />
              ) : (
                <span className="avatar avatar--large">
                  {form.username[0]?.toUpperCase() || 'U'}
                </span>
              )}
              <div>
                <h2>Фотография</h2>
                <p>JPG, PNG или WebP, не более 2 МБ</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => fileRef.current?.click()}
                >
                  Загрузить
                </Button>
                <input
                  ref={fileRef}
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={uploadAvatar}
                />
              </div>
            </div>
            <div className="form-grid">
              <Input
                label="Имя пользователя"
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
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Город"
                name="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Москва"
              />
              <label className="field">
                <span className="field__label">Специализация</span>
                <span className="field__control">
                  <select
                    value={form.specializationId}
                    onChange={(e) => setForm({ ...form, specializationId: e.target.value })}
                  >
                    <option value="">Не выбрана</option>
                    {specializations?.data.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
            </div>
            <label className="field">
              <span className="field__label">О себе</span>
              <span className="field__control">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Опыт, цели и интересы"
                />
              </span>
            </label>
            <fieldset className="skills-picker">
              <legend>Навыки</legend>
              <p>Выбери технологии, которые хочешь изучать.</p>
              <div>
                {skills?.data.map((skill) => (
                  <label
                    key={skill.id}
                    className={form.skillIds.includes(skill.id) ? 'chip chip--selected' : 'chip'}
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
              <div className={`alert alert--${notice.type}`} role="alert">
                {notice.text}
              </div>
            )}
            <div className="form-actions">
              <Button type="submit" loading={userUpdate.isLoading || profileUpdate.isLoading}>
                Сохранить изменения
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </section>
  );
}
