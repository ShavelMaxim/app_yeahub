import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetSkillsQuery, useGetSpecializationsQuery } from '@/entities/catalog';
import {
  createProfileUpdateBody,
  createUserUpdateBody,
  stripImageDataUrl,
  useCreateProfileMutation,
  useGetMeQuery,
  useSetActiveProfileMutation,
  useUpdateProfileMutation,
  useUpdateUserMutation,
  type Profile,
  type ProfileSkill,
} from '@/entities/user';
import { setUser, useAuth } from '@/features/auth';
import { getApiErrorMessage } from '@/shared/lib';

interface ProfileFormValues {
  username: string;
  readonly email: string;
  city: string;
  description: string;
  specializationId: string;
  skillIds: number[];
}

const prepareAvatarData = (source: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth < 128 || image.naturalHeight < 128) {
        reject(new Error('Минимальное разрешение изображения — 128×128 пикселей.'));
        return;
      }

      const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
      const outputSize = Math.min(sourceSize, 2048);
      const sourceX = (image.naturalWidth - sourceSize) / 2;
      const sourceY = (image.naturalHeight - sourceSize) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Браузер не поддерживает обработку изображения.'));
        return;
      }

      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        outputSize,
        outputSize,
      );
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = () => reject(new Error('Выбранный файл не удалось открыть как изображение.'));
    image.src = source;
  });

export const useEditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: fallbackUser } = useAuth();
  const { data, isLoading, refetch } = useGetMeQuery();
  const user = data ?? fallbackUser;
  const activeProfile =
    user?.profiles?.find((profile: Profile) => profile.isActive) ?? user?.profiles?.[0];
  const { data: specializations } = useGetSpecializationsQuery({ limit: 100 });
  const { data: skills } = useGetSkillsQuery({ limit: 100 });
  const [updateUser, userUpdate] = useUpdateUserMutation();
  const [createProfile, profileCreate] = useCreateProfileMutation();
  const [setActiveProfile, activeProfileUpdate] = useSetActiveProfileMutation();
  const [updateProfile, profileUpdate] = useUpdateProfileMutation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [isReadingAvatar, setIsReadingAvatar] = useState(false);
  const [form, setForm] = useState<ProfileFormValues>({
    username: '',
    email: '',
    city: '',
    description: '',
    specializationId: '',
    skillIds: [],
  });
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      username: user.username ?? '',
      email: user.email ?? '',
      city: user.city ?? '',
      description: activeProfile?.description ?? '',
      specializationId: activeProfile?.specializationId?.toString() ?? '',
      skillIds: activeProfile?.profileSkills?.map((skill: ProfileSkill) => skill.id) ?? [],
    });
    setAvatarPreview(user.avatarUrl ?? '');
    setAvatarImage(null);
  }, [activeProfile, user]);

  const uploadAvatarFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (
      !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setNotice({ type: 'error', text: 'Выберите изображение размером до 5 МБ.' });
      return;
    }

    setNotice(null);
    setIsReadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = await prepareAvatarData(String(reader.result));
        setAvatarPreview(dataUrl);
        setAvatarImage(stripImageDataUrl(dataUrl));
        setNotice({ type: 'success', text: 'Фотография выбрана. Сохраните изменения профиля.' });
      } catch (error) {
        setNotice({
          type: 'error',
          text: error instanceof Error ? error.message : 'Не удалось обработать изображение.',
        });
      } finally {
        setIsReadingAvatar(false);
      }
    };
    reader.onerror = () => {
      setIsReadingAvatar(false);
      setNotice({ type: 'error', text: 'Не удалось прочитать выбранный файл.' });
    };
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
    const specializationId = Number(form.specializationId);
    const hasProfileData = Boolean(form.description.trim() || form.skillIds.length);
    if (!activeProfile && hasProfileData && !specializationId) {
      setNotice({
        type: 'error',
        text: 'Выберите специализацию, чтобы создать профиль и сохранить навыки.',
      });
      return;
    }

    const failures: Array<{ label: string; error: unknown }> = [];
    const perform = async <T>(label: string, operation: () => Promise<T>) => {
      try {
        return { ok: true as const, value: await operation() };
      } catch (error) {
        failures.push({ label, error });
        return { ok: false as const };
      }
    };

    const userBody = createUserUpdateBody(user, {
      username: form.username,
      city: form.city,
      avatarImage,
    });
    if (Object.keys(userBody).length > 0) {
      await perform('данные пользователя', () =>
        updateUser({ id: user.id, body: userBody }).unwrap(),
      );
    }

    let targetProfile = specializationId
      ? user.profiles?.find((profile: Profile) => profile.specializationId === specializationId)
      : activeProfile;

    if (!targetProfile && specializationId) {
      const created = await perform('новый профиль', () =>
        createProfile({
          userId: user.id,
          profileType: 1,
          specializationId,
          markingWeight: 1,
        }).unwrap(),
      );

      if (created.ok) {
        const afterCreate = await perform('созданный профиль', () => refetch().unwrap());
        if (afterCreate.ok) {
          dispatch(setUser(afterCreate.value));
          targetProfile = afterCreate.value.profiles?.find(
            (profile: Profile) => profile.specializationId === specializationId,
          );
        }
        if (!targetProfile) {
          failures.push({
            label: 'новый профиль',
            error: new Error('API не вернул созданный профиль.'),
          });
        }
      }
    }

    if (targetProfile) {
      const updated = await perform('данные профиля', () =>
        updateProfile({
          id: targetProfile.id,
          body: createProfileUpdateBody({
            description: form.description,
            skillIds: form.skillIds,
          }),
        }).unwrap(),
      );

      if (updated.ok && targetProfile.id !== activeProfile?.id) {
        await perform('активную специализацию', () => setActiveProfile(targetProfile.id).unwrap());
      }
    }

    const refreshed = await refetch()
      .unwrap()
      .catch(() => undefined);
    if (refreshed) dispatch(setUser(refreshed));

    if (failures.length) {
      const firstFailure = failures[0];
      setNotice({
        type: 'error',
        text: `Не удалось сохранить ${failures.map(({ label }) => label).join(' и ')}. ${getApiErrorMessage(firstFailure.error)}`,
      });
      return;
    }

    navigate('/profile', { replace: true });
  };

  return {
    avatarPreview,
    fileRef,
    form,
    isLoading: isLoading && !user,
    isReadingAvatar,
    isSaving:
      userUpdate.isLoading ||
      profileUpdate.isLoading ||
      profileCreate.isLoading ||
      activeProfileUpdate.isLoading,
    notice,
    setForm,
    skills: skills?.data ?? [],
    specializations: specializations?.data ?? [],
    submit,
    toggleSkill,
    uploadAvatarFile,
  };
};
